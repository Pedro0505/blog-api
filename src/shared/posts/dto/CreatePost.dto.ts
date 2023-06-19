import IPostBodyCreate from '../interfaces/IPostBodyCreate';
import { IsNotEmpty, Length, IsString } from 'class-validator';

export class CreatePostDto implements IPostBodyCreate {
  @IsString({ message: 'O título precisa ser uma strig' })
  @IsNotEmpty({ message: 'O título não pode ser vazio' })
  @Length(1, 50, { message: 'O título precisa ter entre 1 e 50 caracteres' })
  title: string;

  @IsString({ message: 'A descrição precisa ser uma strig' })
  @IsNotEmpty({ message: 'A descrição não pode ser vazia' })
  @Length(1, 255, {
    message: 'A descrição precisa ter entre 1 e 255 caracteres',
  })
  description: string;

  @IsString({ message: 'A categoria precisa ser uma strig' })
  @IsNotEmpty({ message: 'A categoria não pode ser vazia' })
  @Length(1, 30, { message: 'A categoria precisa ter entre 1 e 30 caracteres' })
  category: string;

  @IsString({ message: 'O conteúdo precisa ser uma strig' })
  @IsNotEmpty({ message: 'O conteúdo não pode ser vazio' })
  content: string;
}
