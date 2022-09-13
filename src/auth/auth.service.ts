import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectClient } from '../dataBase';
import { Client } from 'pg'
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		@InjectClient() private pg: Client
	) { }

	async signin(signinDto: SigninDto) {
		const userCheck = await this.pg.query(`select * from "User" where email = $1 or nickname = $2`, [signinDto.email, signinDto.nickname])
		if (userCheck.rowCount > 0) throw new BadRequestException("email or nickname is busy")

		const passwordHash = await bcrypt.hash(signinDto.password, 8)
		const user = await this.pg.query(`insert into "User"(password, email, nickname) values($1, $2, $3)`, [
			passwordHash,
			signinDto.email,
			signinDto.nickname
		])
		return { token: this.generateJwt(signinDto), expire: 1800 }
	}

	async login(loginDto: LoginDto) {
		const userCheck = await this.pg.query<User>(`select * from "User" where email = $1`, [loginDto.email])
		if (userCheck.rowCount == 0) throw new BadRequestException("email or password entered incorrectly")
		const user = userCheck.rows[0]
		if (!await bcrypt.compare(loginDto.password, user.password)) throw new BadRequestException("email or password entered incorrectly")

		return { token: this.generateJwt(user), expire: 1800 }
	}

	private async generateJwt({ email, nickname }) {
		const uid = await (await this.pg.query(`select uid from "User" where nickname = $1 and email = $2`, [nickname, email])).rows[0].uid
		const jwt = this.jwtService.sign(
			{ uid: uid },
			{ expiresIn: 1800 })
		return jwt
	}


}
