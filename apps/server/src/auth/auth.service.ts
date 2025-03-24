import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { DRIZZLE, type DRIZZLE_CLIENT } from 'src/drizzle/drizzle.module';
import { usersSchema } from 'src/drizzle/schema/users.schema';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { UserInfo } from 'src/types/request';

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

    // 7 days
    const refreshToken = this.generateToken(email, 7 * 24 * 60 * 60 * 1000);

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

    // 15 minutes
    const accessToken = this.generateToken(newUser.email, 15 * 60 * 1000);

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

    // 7 days
    const refreshToken = this.generateToken(
      user.email,
      7 * 24 * 60 * 60 * 1000,
    );

    await this.db
      .update(usersSchema)
      .set({ refreshToken: refreshToken })
      .where(eq(usersSchema.email, email));

    // 15 minutes
    const accessToken = this.generateToken(user.email, 15 * 60 * 1000);

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

  async refreshAccessToken(userInfo: UserInfo) {
    const [user] = await this.db
      .select()
      .from(usersSchema)
      .where(eq(usersSchema.id, userInfo.id))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const accessToken = this.generateToken(user.email, 15 * 60 * 1000);
    const refreshToken = this.generateToken(
      user.email,
      7 * 24 * 60 * 60 * 1000,
    );

    await this.db
      .update(usersSchema)
      .set({ refreshToken: refreshToken })
      .where(eq(usersSchema.id, user.id));

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  private generateToken(userEmail: string, expiresInMilliseconds: number) {
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');

    return jwt.sign({ sub: userEmail }, secret, {
      expiresIn: expiresInMilliseconds,
    });
  }
}
