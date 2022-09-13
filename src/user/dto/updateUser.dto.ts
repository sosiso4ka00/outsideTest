import { IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	nickname?: string

	@IsOptional()
	@IsString()
	@Length(8)
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: 'password too weak' })
	password?: string

	@IsOptional()
	@IsEmail()
	email?: string
}
