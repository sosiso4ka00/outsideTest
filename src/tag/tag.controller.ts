import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Put, ParseIntPipe } from '@nestjs/common';
import { TagService } from './tag.service';
import { Auth } from '../../src/auth/decorators/auth.decorator';
import { TagFiltersDto } from './dto/tagFilters.dto';
import { CreateTagDto } from './dto/createTag.dto';
import { EditTagDto } from './dto/editTag.dto';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) { }

  @Post()
  @Auth()
  async create(@Body() createTagDto: CreateTagDto, @Req() { user }) {
    return this.tagService.create(createTagDto, user)
  }

  @Get(":id")
  @Auth()
  async getSingle(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.getFromId(id)
  }

  @Get()
  @Auth()
  async search(@Query() params: TagFiltersDto) {
    return this.tagService.searchByFilter(params)
  }

  @Put(':id')
  @Auth()
  async editTag(@Param('id', ParseIntPipe) id: number, @Body() dto: EditTagDto, @Req() { user }) {
    return this.tagService.editTag(id, dto, user)
  }

  @Delete(':id')
  @Auth()
  async delete(@Param('id', ParseIntPipe) id: number, @Req() { user }) {
    return this.tagService.deleteTag(id, user)
  }


}
