import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Client } from 'pg';
import { filter } from 'rxjs';
import { User } from '../../src/user/entities/user.entity';
import { InjectClient } from '../../src/dataBase';
import { CreateTagDto } from './dto/createTag.dto';
import { EditTagDto } from './dto/editTag.dto';
import { TagFiltersDto } from './dto/tagFilters.dto';
import { Tag } from './entities/tag.entity'


@Injectable()
export class TagService {
  constructor(@InjectClient() private pg: Client) { }

  async create(createTagDto: CreateTagDto, user: User) {
    const tagCheck = await this.pg.query(`select * from "Tag" where name = $1`, [createTagDto.name])
    if (tagCheck.rowCount > 0) throw new BadRequestException("name is busy")

    const tag = await (await this.pg.query(`insert into "Tag"(name, "sortOrder", creator) values($1, $2, $3) returning name, "sortOrder", id`, [createTagDto.name, createTagDto.sortOrder, user.uid])).rows[0]
    this.pg.query(`insert into "UserTag"(userid, tagid) values($1, $2)`, [user.uid, tag.id])

    return tag
  }

  async getFromId(id: number) {
    let find = await this.pg.query(
      `select t.name, t."sortOrder", u.nickname, u.uid  
      from "Tag" t 
      join "User" u on u.uid = t.creator 
      where t.id = $1;`, [id])

    const rows = find.rows.map((el) => ({
      creator: {
        nickname: el.nickname,
        uid: el.uid
      },
      name: el.name,
      sortOrder: el.sortOrder
    }))

    return find.rows[0]
  }

  async searchByFilter(filters: TagFiltersDto) {
    let find = await this.pg.query(
      `select t.id, t.name, t."sortOrder", u.nickname, u.uid  
      from "Tag" t 
      join "User" u on u.uid = t.creator 
      ${(filters.sortByName || filters.sortByOrder) &&
      `order by 
        ${filters.sortByOrder ? `t."sortOrder" desc` : ``} 
        ${filters.sortByName && filters.sortByOrder ? `,` : ``}
        ${filters.sortByName ? `t.name desc` : ``}`
      }
      ${filters.offset ? `offset ${filters.offset}` : ``}
      ${filters.length ? `limit ${filters.length}` : ``}

      `)
    const rows = find.rows.map((el) => ({
      creator: {
        nickname: el.nickname,
        uid: el.uid
      },
      name: el.name,
      sortOrder: el.sortOrder
    }))

    return {
      data: rows,
      meta: {
        offset: filters.offset,
        length: filters.length,
        quantity: find.rowCount
      }
    }

  }

  async editTag(id: number, dto: EditTagDto, user: User) {
    if (!dto.name && !dto.sortOrder) throw new BadRequestException()
    const tagQuery = await this.pg.query(`select t.id, t.name, t."sortOrder", u.nickname, u.uid from "Tag" t join "User" u on u.uid = t.creator where t.id = $1`, [id])
    if (tagQuery.rowCount === 0) throw new BadRequestException(`id not found`)

    const tag = tagQuery.rows[0]

    if (user.uid !== tag.uid) throw new UnauthorizedException(`access denied`)

    const updatedTagQuery = await this.pg.query(`update "Tag" set 
      ${dto.name ? `name = '${dto.name}'` : ``}
      ${dto.name && dto.sortOrder ? `,` : ''}
      ${dto.sortOrder ? `"sortOrder" = ${dto.sortOrder}` : ``}
      where id = $1
      returning name, "sortOrder"`, [id])

    const updatedTag = updatedTagQuery.rows[0]
    return {
      creator: {
        nickname: tag.nickname,
        uid: tag.uid
      },
      name: updatedTag.name,
      sortOrder: updatedTag.sortOrder
    }
  }

  async deleteTag(id: number, user: User) {
    const tagQuery = await this.pg.query(`select t.id, t.name, t."sortOrder", u.nickname, creator from "Tag" t join "User" u on u.uid = t.creator where t.id = $1`, [id])
    if (tagQuery.rowCount === 0) throw new BadRequestException(`id not found`)

    const tag = tagQuery.rows[0]
    if (tag.creator !== user.uid) throw new UnauthorizedException(`access denied`)

    await this.pg.query(`delete from "Tag" where id = $1`, [id])

  }

}
