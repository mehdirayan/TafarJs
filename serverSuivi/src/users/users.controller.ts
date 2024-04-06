import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './schemas/users.schemas';
import { CreateUsersDto } from './dto/users.dto';
import { Types } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(): Promise<Users[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId): Promise<Users> {
    return await this.usersService.findOne(id);
  }

  @Post()
  async addUser(@Body() userDto: CreateUsersDto): Promise<Users> {
    console.log(userDto);
    return await this.usersService.addUser(userDto);
  }

  @Put(':id')
  async updateOne(
    @Param('id') id: Types.ObjectId,
    @Body() userDto: CreateUsersDto,
  ): Promise<Users> {
    console.log(userDto);
    return await this.usersService.updateOne(id, userDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: Types.ObjectId): Promise<Users> {
    return await this.usersService.deleteOne(id);
  }
}
