import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive } from "class-validator";

export class TagFiltersDto{

	@IsOptional()
	@IsBoolean()
	@Transform(({key})=>key != '')
	sortByOrder: boolean

	@IsOptional()
	@IsBoolean()
	@Transform(({key})=>key != '')
	sortByName: boolean 

	@IsOptional()
	@IsInt()
	@IsPositive()
	@Transform(({value})=>+value)
	offset: number

	@IsOptional()
	@IsInt()
	@IsPositive()
	@Transform(({value})=>+value)
	length: number
}