import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class EditTagDto {

	@IsOptional()
	@IsString()
	name: string

	@IsOptional()
	@IsInt()
	@Transform(({ value }) => +value)
	sortOrder: number
}