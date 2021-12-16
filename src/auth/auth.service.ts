import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; //token
import { Usuario } from '@prisma/client';
import { UsuarioService } from '../usuario/usuario.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
    constructor (
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService, //criador do token de acesso
        ) {}

    async login(loginUserDto: LoginDto) {
        const user = await this.usuarioService.findByLogin(loginUserDto);

        const token = this._createToken(user);
        return {
            email: user.email,
            ...token
        };
    } //criando processo de login
    private _createToken ({email}: LoginDto): any {
        const user: JwtPayload = { email }; //estanciando user pelo email
        const accessToken = this.jwtService.sign(user); //criando tokeon
        return {
            expiresIn: process.env.EXPIRESIN, //tempo de expiracao do token vindo do .env
            accessToken, 
        } //criando token para usuario validado
    }
}
