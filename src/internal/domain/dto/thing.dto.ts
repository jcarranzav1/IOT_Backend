import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { SensorType } from '../entities/thing.entity'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateThingDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(SensorType)
  @IsString()
  typeName = SensorType.GAS

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  workplaceName: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacturer = 'Arduino'

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  version = '1.0.0'
}
