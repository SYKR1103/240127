import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RequestWithUserInterface } from './interfaces/requestWithUser.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() createUser: CreateUserDto) {
    return this.authService.createUser(createUser);
  }

  // @Post('/login')
  // async loginUser(@Body() loginUser: LoginUserDto) {
  //   const user = await this.authService.loginUser(loginUser);
  //   const token = this.authService.generateAccessToken(user.id);
  //   return { user, token };
  // }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async loginUser(@Req() requestWithUser: RequestWithUserInterface) {
    const { user } = requestWithUser;
    console.log(user);
    const token = this.authService.generateAccessToken(user.id);
    return { user, token };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googlecallback(@Req() req: RequestWithUserInterface) {
    const { user } = req;
    return user;
  }
}
