import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Client } from 'pg';
import { InjectClient } from '../../src/dataBase';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AddTagDto } from './dto/addTag.dto';


@Injectable()
export class UserService {
  constructor(@InjectClient() private pg: Client) { }


  async find(user: User) {
    const tags = await this.pg.query(
      `select t.id, t.name, t."sortOrder"
      from "User" u 
      join "UserTag" ut 
        ON ut.userid = u.uid 
      join "Tag" t 
        ON t.id =ut.tagid 
      where uid = $1`, [user.uid])
      
    return {
      email: user.email,
      nickname: user.nickname,
      tags: tags.rows
    }
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    if (Object.keys(updateUserDto).length == 0) throw new BadRequestException("fields not found")
    if (updateUserDto.email) {
      const userCheck = await this.pg.query(`select * from "User" where email = $1`, [updateUserDto.email])
      if (userCheck.rowCount > 0) throw new BadRequestException("email is busy")
    }
    if (updateUserDto.nickname) {
      const userCheck = await this.pg.query(`select * from "User" where nickname = $1`, [updateUserDto.nickname])
      if (userCheck.rowCount > 0) throw new BadRequestException("nickname is busy")
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 8);
    }

    const updatedUser = await this.pg.query(
      `update "User" 
      set ${Object.keys(updateUserDto).map((key) => `${key}='${updateUserDto[key]}'`).join(', ')} 
      where uid = $1
      returning email, nickname
      `, [user.uid])

    return updatedUser.rows[0]
  }

  async remove(user: User) {
    await this.pg.query(`delete from "User" where uid = $1`, [user.uid])
  }

  async addTags(dto: AddTagDto, user: User) {
    try {
      await this.pg.query(
        `insert into "UserTag"(userid, tagid) 
      values${dto.tags.map(value => `('${user.uid}', ${value})`).join(',')}
      on conflict do nothing;`)
    }
    catch (e) {
      return {
        tags: []
      }
    }
    const tagsQuery = await this.pg.query(`select * from "Tag" where id in ( ${dto.tags.join(',')} )`)

    return { tags: tagsQuery.rows }
  }

  async deleteTag(id: number, user: User) {
    const tagQuery = await this.pg.query(`select * from "Tag" t join "User" u on t.creator = u.uid where id = $1`, [id])
    if (tagQuery.rowCount === 0) throw new BadRequestException(`id not found`)

    const tag = tagQuery.rows[0]

    if (tag.creator !== user.uid) throw new UnauthorizedException(`you not creator`)

    await this.pg.query(`delete from "Tag" where id = $1`, [id])

  }


  async getUserTags(user: User) {
    const tagsQuery = await this.pg.query(`select id,name,"sortOrder" from "Tag" where creator = $1`, [user.uid])
    const tags = tagsQuery.rows
    return {
      tags
    }

  }
}
