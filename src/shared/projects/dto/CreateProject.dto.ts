import { IsNotEmpty, Length, IsString } from 'class-validator';
import IProjectBodyCreate from '../interfaces/IProjectBodyCreate';

export class CreateProjectDto implements IProjectBodyCreate {
  @IsString({ message: 'O nome precisa ser uma strig' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @Length(1, 50, {
    message: 'O nome precisa ter entre 1 e 50 caracteres',
  })
  name: string;

  @IsString({ message: 'A url precisa ser uma strig' })
  @IsNotEmpty({ message: 'A url não pode ser vazia' })
  url: string;

  @IsString({ message: 'A descrição precisa ser uma strig' })
  @IsNotEmpty({ message: 'A descrição não pode ser vazia' })
  @Length(1, 255, {
    message: 'A descrição precisa ter entre 1 e 255 caracteres',
  })
  description: string;
}
