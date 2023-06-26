import { IsNotEmpty, Length, IsString, IsOptional } from 'class-validator';
import IPostBodyUpdate from '../interfaces/IPostBodyUpdate';

export class UpdatePostDto implements IPostBodyUpdate {
  @IsString({ message: 'O título precisa ser uma strig' })
  @IsNotEmpty({ message: 'O título não pode ser vazio' })
  @Length(1, 50, { message: 'O título precisa ter entre 1 e 50 caracteres' })
  @IsOptional()
  title: string;

  @IsString({ message: 'A descrição precisa ser uma strig' })
  @IsNotEmpty({ message: 'A descrição não pode ser vazia' })
  @Length(1, 255, {
    message: 'A descrição precisa ter entre 1 e 255 caracteres',
  })
  @IsOptional()
  description: string;

  @IsString({ message: 'A categoria precisa ser uma strig' })
  @IsNotEmpty({ message: 'A categoria não pode ser vazia' })
  @Length(1, 30, { message: 'A categoria precisa ter entre 1 e 30 caracteres' })
  @IsOptional()
  category: string;

  @IsString({ message: 'O conteúdo precisa ser uma strig' })
  @IsNotEmpty({ message: 'O conteúdo não pode ser vazio' })
  @IsOptional()
  content: string;
}
