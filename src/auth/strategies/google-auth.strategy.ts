import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
import { ProviderEnum } from '../../user/entities/provider.enum';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(
  Strategy,
  ProviderEnum.GOOGLE,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get('GOOGLE_AUTH_CLIENTID'),
      clientSecret: configService.get('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_AUTH_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refereshToken: string,
    profile: any,
    done: any,
  ) {
    const { name, picture, email } = profile._json;
    const { provider } = profile;

    try {
      const user = await this.userService.findOneByEmail(email);
      if (user.provider !== 'google')
        throw new HttpException('already signed up', HttpStatus.BAD_REQUEST);
      done(null, user);
    } catch (e) {
      if (e.status === 404 || e.status === undefined) {
        const newUser = await this.userService.userCreate({
          nickname: name,
          email,
          provider,
        });
        done(null, newUser);
      }
    }

    return profile;
  }
}
