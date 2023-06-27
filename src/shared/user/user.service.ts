import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/CreateUser.dto';
import { LoginUserDto } from './dto/LoginUser.dto';
import { PassCryptography } from '../utils/PassCryptography';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private passCryptography: PassCryptography,
    private authService: AuthService,
  ) {}

  public async registerUser(user: CreateUserDto, ownerKey: string) {
    if (ownerKey !== process.env.OWNER_KEY) {
      throw new UnauthorizedException('User unauthorized');
    }

    const newPass = await this.passCryptography.bcryptEncrypt(user.password);

    user.password = newPass;

    return this.userRepository.createUser(user);
  }

  public async login(user: LoginUserDto) {
    const getUser = await this.userRepository.getUserByUsername(user.username);

    if (!getUser) {
      return new UnauthorizedException('Usuário ou senha incorreta');
    }

    const token = await this.authService.signIn(
      user.password,
      getUser.password,
      getUser.id,
      getUser.username,
    );

    return token;
  }
}
