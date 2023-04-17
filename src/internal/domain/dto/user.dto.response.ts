import { User } from '../entities/user.entity'

export type UserResponse = Omit<User, 'password'>

export function omitPassword(user: User): UserResponse {
  const { password, ...rest } = user
  return rest
}

export interface UserAccountResponse {
  user: UserResponse
  token: string
}
