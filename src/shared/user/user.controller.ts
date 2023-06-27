import { Body, Controller, Headers, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import { LoginUserDto } from './dto/LoginUser.dto';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  public async registerUser(
    @Body() user: CreateUserDto,
    @Headers() headers: { 'owner-key': string },
  ) {
    const ownerKey = headers['owner-key'];

    return this.userService.registerUser(user, ownerKey);
  }

  @Post('/login')
  public async login(@Body() user: LoginUserDto) {
    return this.userService.login(user);
  }
}
