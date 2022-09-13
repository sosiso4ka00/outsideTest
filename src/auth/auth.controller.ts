import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { LoginDto } from './dto/login.dto';
import { SigninDto } from './dto/signin.dto';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

	@Post('signin')
	async signin(@Body() signinDto: SigninDto){
		return this.authService.signin(signinDto)
	}

	@Post('login')
	async login(@Body() loginDto: LoginDto){
		return this.authService.login(loginDto)
	}

	@Post('logout')
	@Auth()
	async logout(@Req() req){		
		return 
	}


}
