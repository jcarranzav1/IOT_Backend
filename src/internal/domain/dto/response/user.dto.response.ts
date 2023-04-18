import { ApiProperty } from '@nestjs/swagger'
import { User, UserRole } from '../../entities/user.entity'
import { ApiResponseDto, AuthApiResponseDto } from './api-response.dto'

export class UserResponse {
  @ApiProperty()
  userID: string

  @ApiProperty({ enum: UserRole })
  role: UserRole

  @ApiProperty()
  name: string

  @ApiProperty()
  lastname: string

  @ApiProperty()
  email: string

  @ApiProperty()
  cellphone: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

export function omitPassword(user: User): UserResponse {
  const { password, ...rest } = user
  return rest
}

export class UserAccountResponse {
  user: UserResponse
  token: string
}

export class UserAccountResponseApi extends AuthApiResponseDto<UserResponse> {
  @ApiProperty({ type: () => UserResponse })
  data: UserResponse
}

export class UserResponseApi extends ApiResponseDto<UserResponse> {
  @ApiProperty({ type: () => UserResponse })
  data: UserResponse
}

export class AllUsersResponseApi extends ApiResponseDto<UserResponse[]> {
  @ApiProperty({ type: () => UserResponse, isArray: true })
  data: UserResponse[]
}
