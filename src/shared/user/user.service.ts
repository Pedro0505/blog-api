import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/CreateUser.dto';
import { LoginUserDto } from './dto/LoginUser.dto';
import { PassCryptography } from '../utils/passCryptography';
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

    const getUser = await this.userRepository.getUserByUsername(user.username);

    if (getUser !== null) {
      throw new ConflictException('Usuário já existe');
    }

    const newPass = await this.passCryptography.bcryptEncrypt(user.password);

    user.password = newPass;

    const newUser = await this.userRepository.createUser(user);

    return { username: newUser.username, id: newUser._id };
  }

  public async login(user: LoginUserDto) {
    const getUser = await this.userRepository.getUserByUsername(user.username);

    if (!getUser) {
      throw new UnauthorizedException('Usuário não cadastrado');
    }

    const token = await this.authService.signIn(
      user.password,
      getUser.password,
      getUser.id,
      getUser.username,
    );

    return { token };
  }
}
