import { ApiProperty } from '@nestjs/swagger'
import { UserResponse } from './user.dto.response'

class MetaData {
  @ApiProperty()
  statusCode: number
  @ApiProperty()
  message: string
}

class AccountMetaData extends MetaData {
  @ApiProperty()
  token: string
}

export class ApiResponseDto<T> {
  @ApiProperty()
  data: T | null
  @ApiProperty({ type: () => MetaData })
  meta: MetaData
}

export class AuthApiResponseDto<T> {
  @ApiProperty()
  data: T
  @ApiProperty({ type: () => AccountMetaData })
  meta: AccountMetaData
}
