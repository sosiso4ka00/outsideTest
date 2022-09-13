import { IsEmail, IsString, Length, Matches } from "class-validator"

export class LoginDto{
	@IsEmail()
	email: string

	@IsString()
	@Length(8)
	password: string
}