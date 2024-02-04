import { BaseEntity } from '../../common/common.base';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { RoleEnum } from './role.enum';
import { ProviderEnum } from './provider.enum';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';

@Entity()
export class User extends BaseEntity {
  @Column()
  public nickname: string;

  @Column()
  public email: string;

  @Column({ nullable: true })
  public password: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.Admin,
  })
  public role: RoleEnum;

  @Column({
    type: 'enum',
    enum: ProviderEnum,
    default: ProviderEnum.LOCAL,
  })
  public provider: ProviderEnum;

  @BeforeInsert()
  async hashPassword() {
    if (this.provider === 'local') {
      try {
        const saltValue = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, saltValue);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string) {
    if (this.provider === 'local') {
      try {
        const isMatched = await bcrypt.compare(aPassword, this.password);
        return isMatched;
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }
}
