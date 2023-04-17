import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { SensorType } from '../entities/thing.entity'

export class CreateThingDTO {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  email: string

  @IsOptional()
  @IsEnum(SensorType)
  @IsString()
  typeName = SensorType.GAS

  @IsNotEmpty()
  @IsString()
  workplaceName: string

  @IsOptional()
  @IsString()
  manufacturer = 'Arduino'

  @IsOptional()
  @IsString()
  version = '1.0.0'
}
