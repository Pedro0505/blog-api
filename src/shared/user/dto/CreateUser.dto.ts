import { IsNotEmpty, Length, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O nome de usuário precisa ser uma strig' })
  @IsNotEmpty({ message: 'O nome de usuário não pode ser vazio' })
  @Length(1, 50, {
    message: 'O nome de usuário precisa ter entre 1 e 50 caracteres',
  })
  username: string;

  @IsString({ message: 'A senha precisa ser uma strig' })
  @IsNotEmpty({ message: 'A senha não pode ser vazia' })
  @Length(1, 50, {
    message: 'A senha precisa ter entre 1 e 50 caracteres',
  })
  @Matches(/^[^\s]+$/, {
    message: 'A senha não pode conter espaços em branco',
  })
  @Matches(/[0-9]/, {
    message: 'A senha tem que conter ao menos um número',
  })
  @Matches(/[a-zA-Z]/, {
    message: 'A senha tem que conter ao menos uma letra',
  })
  password: string;
}
