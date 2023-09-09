import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = await this.userRepository.create(createUserDto);
        return this.userRepository.save(user)
    }

    async findAllUser(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async viewUser(id: number): Promise<User> {
        return await this.userRepository.findOneBy({ id });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        await this.userRepository.update({ id }, updateUserDto);
        return await this.userRepository.findOneBy({ id });
    }
    
    async removeUser(id: number): Promise<{ affected?: number }> {
        return await this.userRepository.delete(id);
    }
}
