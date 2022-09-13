import { Transform, Type } from "class-transformer"
import { IsArray, IsEmail, IsIn, IsInt, IsNumber, IsOptional, IsString, Length, Matches, ValidateNested } from "class-validator"

export class AddTagDto {

	@IsArray()
	@IsInt({ each: true })
	@Transform(({ value }) => JSON.parse(value))
	tags: number[]

}
