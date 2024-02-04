import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { TokenPayload } from './interfaces/Token.interface';
import * as Joi from '@hapi/joi';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.userService.userCreate(createUserDto);
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.findOneByEmail(loginUserDto.email);
    const ispwmatched = await user.checkPassword(loginUserDto.password);
    if (!ispwmatched)
      throw new HttpException('wrong password', HttpStatus.BAD_REQUEST);
    return user;
  }

  public generateAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return token;
  }
}
