import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { RegisterDto, LoginDto } from './auth/dto/register.dto';
import { Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Public } from '../guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body('refreshToken') token: string) {
    return this.authService.refresh(token);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Body('userId') userId: string) {
    return this.authService.logout(userId);
  }
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Passport redirects to Google's consent screen — this body never runs

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req, @Res() res: Response) {
    const { accessToken, refreshToken } = req.user;
    // Redirect back to frontend with tokens as query params (or set httpOnly cookies)
    res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }

    @Public()
    @Post('login')
    login(@Body() dto: LoginDto) { ... }

    @Public()
    @Post('register')
    register(@Body() dto: RegisterDto) { ... }
}