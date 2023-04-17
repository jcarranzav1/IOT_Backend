// src/internal/domain/entities/thing.entity.ts
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator'
import { CreateThingDTO } from '../dto/thing.dto'

export enum SensorType {
  GAS = 'gasSensor',
}

export class Thing {
  @IsUUID()
  thingID: string

  @IsNotEmpty()
  @IsString()
  email: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsEnum(SensorType)
  @IsString()
  typeName: SensorType

  @IsNotEmpty()
  @IsString()
  workplaceName: string

  @IsOptional()
  @IsString()
  manufacturer: string

  @IsOptional()
  @IsString()
  version: string

  @IsNotEmpty()
  @IsString()
  thingArn: string

  @IsNotEmpty()
  @IsString()
  certificatePem: string

  @IsNotEmpty()
  @IsString()
  certificateArn: string

  @IsNotEmpty()
  @IsString()
  privateKey: string

  @IsNotEmpty()
  @IsString()
  publicKey: string

  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date

  constructor(createThingDto?: CreateThingDTO) {
    if (createThingDto) {
      this.name = createThingDto.name
      this.email = createThingDto.email
      this.typeName = createThingDto.typeName
      this.workplaceName = createThingDto.workplaceName
      this.manufacturer = createThingDto.manufacturer
      this.version = createThingDto.version
    }
  }
}
