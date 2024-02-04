import { ProviderEnum } from '../entities/provider.enum';

export class CreateUserDto {
  nickname: string;
  email: string;
  password?: string;
  provider: ProviderEnum;
}
