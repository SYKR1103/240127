import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async userCreate(createUserDto: CreateUserDto) {
    const newuser = await this.userRepo.create(createUserDto);
    await this.userRepo.save(newuser);
    return newuser;
  }

  async findOneById(id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new HttpException('not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new HttpException('not found', HttpStatus.NOT_FOUND);
    return user;
  }
}
