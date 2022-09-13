import { IsEmail, IsString, Length, Matches } from "class-validator"

export class SigninDto{
	@IsEmail()
	email: string

	@IsString()
	@Length(8)
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {message: 'password too weak'})
	password: string

	@IsString()
	nickname: string
}