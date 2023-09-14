import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async register(userDto: CreateUserDto) {
        const user = await this.userService.createUser(userDto);
        const token = await this._createToken(user);
        return {
            email: user.email,
            token,
        };
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.userService.findByLogin(loginUserDto);
        const token = await this._createToken(user);
        
        return {
            email: user.email,
            token,
        };
    }

    async validateUser(email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }

        return user;
    }

    private async _createToken(
        { email }
    ) {
        const accessToken = this.jwtService.sign({
            email,
        })

        return accessToken;
    }
}
