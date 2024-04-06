import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Users } from './schemas/users.schemas';
import { CreateUsersDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}

  async findAll(): Promise<Users[]> {
    const users = await this.usersModel.find();
    return users;
  }

  async findOne(id: Types.ObjectId): Promise<Users> {
    return await this.usersModel.findById(id);
  }

  async addUser(createUsersDtoDto: CreateUsersDto): Promise<Users> {
    const createdUser = new this.usersModel(createUsersDtoDto);
    return createdUser.save();
  }

  async updateOne(id: Types.ObjectId, userDto: CreateUsersDto): Promise<Users> {
    return await this.usersModel.findByIdAndUpdate(id, userDto);
  }

  async deleteOne(id: Types.ObjectId): Promise<Users> {
    return await this.usersModel.findByIdAndDelete(id);
  }
}
