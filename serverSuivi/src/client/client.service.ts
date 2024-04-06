import { Injectable } from '@nestjs/common';
import { Client } from './schema/client.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateClientDto } from './dto/createClient.dto';

@Injectable()
export class ClientService {
  constructor(@InjectModel(Client.name) private ClientModel: Model<Client>) {}

  async findAll(): Promise<Client[]> {
    const clients = await this.ClientModel.find();
    return clients;
  }

  async findOne(id: Types.ObjectId): Promise<Client> {
    return await this.ClientModel.findById(id);
  }

  async addClient(ClientDto: CreateClientDto): Promise<Client> {
    const createdClient = new this.ClientModel(ClientDto);
    return createdClient.save();
  }

  async updateOne(
    id: Types.ObjectId,
    ClientDto: CreateClientDto,
  ): Promise<Client> {
    return await this.ClientModel.findByIdAndUpdate(id, ClientDto);
  }

  async deleteOne(id: Types.ObjectId): Promise<Client> {
    return await this.ClientModel.findByIdAndDelete(id);
  }
}
