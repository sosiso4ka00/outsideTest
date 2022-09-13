import {
  Controller,
  Get,
  Body,
  Req,
  Delete,
  Put,
  Post,
  ValidationPipe,
  UsePipes,
  Param,
  ParseIntPipe,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Auth } from '../../src/auth/decorators/auth.decorator';
import { AddTagDto } from './dto/addTag.dto';

@Controller('user')
export class UserController {
  constructor( private userService: UserService) { }


  @Get()
  @Auth()
  find(@Req() { user }) {
    return this.userService.find(user);
  }

  @Put()
  @Auth()
  update(@Body() updateUserDto: UpdateUserDto, @Req() { user }) {
    return this.userService.update(user, updateUserDto);
  }

  @Delete()
  @Auth()
  delete(@Req() { user }) {
    return this.userService.remove(user)
  }

  @Post('tag')
  @Auth()
  async addTagToUser(@Body() dto: AddTagDto, @Req() { user }) {
    return this.userService.addTags(dto, user)
  }

  @Delete('tag/:id')
  @Auth()
  async deleteTag(@Param('id', ParseIntPipe) id: number, @Req() { user }) {
    return this.userService.deleteTag(id, user)

  }

  @Get('tag/my')
  @Auth()
  async userTags(@Req() { user }) {
    return this.userService.getUserTags(user)
  }


}
