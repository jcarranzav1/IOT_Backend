import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'
import { UserRole } from '../entities/user.entity'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class SignUpUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastname: string

  @ApiProperty()
  @IsEmail()
  readonly email: string

  @ApiProperty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[a-zA-Z0-9!@#\$%\^&\*]+$/)
  @MinLength(6)
  password: string

  @ApiProperty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])[a-zA-Z0-9!@#\$%\^&\*]+$/)
  @MinLength(6)
  readonly confirmPassword: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^\+(?:[0-9]●?){6,14}[0-9]$/)
  cellphone: string
}

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string

  @ApiProperty()
  @IsString()
  password: string
}
