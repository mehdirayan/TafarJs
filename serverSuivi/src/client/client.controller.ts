import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './schema/client.schema';
import { Types } from 'mongoose';
import { CreateClientDto } from './dto/createClient.dto';

@Controller('clients')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get()
  async findAll(): Promise<Client[]> {
    const clients = await this.clientService.findAll();
    return clients;
  }

  @Get(':id')
  async findOne(@Param('id') id: Types.ObjectId): Promise<Client> {
    return await this.clientService.findOne(id);
  }

  @Post()
  async addClient(@Body() ClientDto: CreateClientDto): Promise<Client> {
    const createdClient = this.clientService.addClient(ClientDto);
    return createdClient;
  }

  @Put(':id')
  async updateOne(
    @Param('id') id: Types.ObjectId,
    @Body() ClientDto: CreateClientDto,
  ): Promise<Client> {
    return await this.clientService.updateOne(id, ClientDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: Types.ObjectId): Promise<Client> {
    return await this.clientService.deleteOne(id);
  }
}
