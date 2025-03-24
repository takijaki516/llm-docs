import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { RefreshJwtGuard } from './guard/refresh-jwt.guard';
import { getCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { UserInfo } from 'src/types/request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signup(signupDto);
    const { refreshToken, ...rest } = result;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return rest;
  }

  @Post('signin')
  async signin(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signin(signinDto);
    const { refreshToken, ...rest } = result;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return rest;
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh-token')
  async refreshToken(
    @getCurrentUser() user: UserInfo,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('🚀 ~ auth.controller.ts:58 ~ AuthController ~ user:', user);

    const {
      accessToken,
      refreshToken,
      user: refreshedUser,
    } = await this.authService.refreshAccessToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { accessToken, user: refreshedUser };
  }
}
