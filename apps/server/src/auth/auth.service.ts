import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'node:crypto';
import * as jwt from 'jsonwebtoken';

import { DRIZZLE, type DRIZZLE_CLIENT } from 'src/drizzle/drizzle.module';
import { usersSchema } from 'src/drizzle/schema/users.schema';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private db: DRIZZLE_CLIENT,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password } = signupDto;

    const existingUser = await this.db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new BadRequestException('User already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // 80 characters
    const refreshToken = crypto.randomBytes(40).toString('hex');

    const [newUser] = await this.db
      .insert(usersSchema)
      .values({
        email,
        password: hashedPassword,
        refreshToken,
      })
      .returning({
        id: usersSchema.id,
        email: usersSchema.email,
      });

    const accessToken = this.generateAccessToken(newUser.email);

    return {
      user: newUser,
      accessToken,
      refreshToken,
    };
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    const [user] = await this.db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.email, email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshToken = crypto.randomBytes(40).toString('hex');

    await this.db
      .update(usersSchema)
      .set({ refreshToken: refreshToken })
      .where(eq(usersSchema.email, email));

    const accessToken = this.generateAccessToken(user.email);
    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async validateToken(token: string) {
    try {
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      const payload = jwt.verify(token, secret) as { sub: string };

      const [user] = await this.db
        .select({
          id: usersSchema.id,
          email: usersSchema.email,
        })
        .from(usersSchema)
        .where(eq(usersSchema.email, payload.sub))
        .limit(1);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      return user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private generateAccessToken(userEmail: string) {
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');
    return jwt.sign({ sub: userEmail }, secret, { expiresIn: '15m' });
  }
}
