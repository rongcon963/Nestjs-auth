import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.login(loginUserDto);
    }
}
