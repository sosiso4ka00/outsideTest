import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateTagDto{

	@IsString()
	name:string

	@IsOptional()
	@IsInt()
	sortOrder: number = 0
}