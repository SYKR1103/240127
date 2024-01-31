import { BaseEntity } from '../../common/common.base';
import { Column } from 'typeorm';

export class User extends BaseEntity {
  @Column()
  public nickname: string;

  @Column()
  public email: string;

  @Column()
  public password: string;
}
