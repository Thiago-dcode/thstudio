import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString} from 'class-validator';
export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  projectId: number;


  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  serviceId: number;

  
  
}
