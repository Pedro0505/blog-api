import { IsNotEmpty, Length, IsString, IsOptional } from 'class-validator';
import IProjectBodyUpdate from '../interfaces/IProjectBodyUpdate';

export class UpdateProjectDto implements IProjectBodyUpdate {
  @IsString({ message: 'O nome precisa ser uma strig' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @Length(1, 50, {
    message: 'O nome precisa ter entre 1 e 50 caracteres',
  })
  @IsOptional()
  name: string;

  @IsString({ message: 'A url precisa ser uma strig' })
  @IsNotEmpty({ message: 'A url não pode ser vazia' })
  @IsOptional()
  url: string;

  @IsString({ message: 'A descrição precisa ser uma strig' })
  @IsNotEmpty({ message: 'A descrição não pode ser vazia' })
  @Length(1, 255, {
    message: 'A descrição precisa ter entre 1 e 255 caracteres',
  })
  @IsOptional()
  description: string;
}
