import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        // check exists
        const exists = await this.userRepository.findOneBy({
            email: createUserDto.email,
        });

        if(exists) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userRepository.create(createUserDto);
        user.password = await bcrypt.hash(createUserDto.password, 10);
        
        return await this.userRepository.save(user);
    }

    async findAllUser(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async viewUser(id: number): Promise<User> {
        return await this.userRepository.findOneBy({ id });
    }

    async findByLogin(loginUserDto: LoginUserDto) {
        const {email, password} = loginUserDto;
        const user = await this.userRepository.findOneBy({
            email: email,
        })

        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        const is_equal = bcrypt.compareSync(password, user.password);

        if (!is_equal) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }

    async findByEmail(email) {
        return await this.userRepository.findOneBy({
          email: email,
        });
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        await this.userRepository.update({ id }, updateUserDto);
        return await this.userRepository.findOneBy({ id });
    }
    
    async removeUser(id: number): Promise<{ affected?: number }> {
        return await this.userRepository.delete(id);
    }
}
