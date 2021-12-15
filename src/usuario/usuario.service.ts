import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Usuario, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UsuarioCreateInput): Promise<Usuario> { //criando usuario com o prisma
    data.senha = await bcrypt.hash(data.senha,10)
  //pegando a senha e passando pelo bcrypt embaralhando 10x  
    return await this.prisma.usuario.create({ data });
  }

  async findByLogin(login: CreateUsuarioDto): Promise<Usuario>{ //criando login
    const user = await this.prisma.usuario.findFirst({
      where: {
        email: login.email,
      },
    }); //testando o dado com o primeiro item encontrado
    
    const senhaIgual = await bcrypt.compare(login.senha,user.senha); //comparando a senha inserida com a senha no banco criptografada com bcryot
    
    if(!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND,)
    }//parando o login quando nao encontrado o user

    if(!senhaIgual) {
      throw new HttpException('Senha inválida.', HttpStatus.UNAUTHORIZED,)
    } //parando o login quando senha nao confere

    return user; //retornando usuario quando validado
  }

  findAll() {
    return `This action returns all usuario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
