import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { IUserRepository } from '../domain/ports/user.port'
import { UserResponse, omitPassword } from '../domain/dto/response/user.dto.response'

export interface IUserService {
  findAllUsers: () => Promise<UserResponse[]>
  findByID: (id: string) => Promise<UserResponse>
  findByEmail: (email: string) => Promise<UserResponse>
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async findAllUsers(): Promise<UserResponse[]> {
    try {
      const users = await this.userRepository.findAllUsers()
      return users.map(omitPassword)
    } catch (err) {
      throw err
    }
  }

  async findByEmail(email: string): Promise<UserResponse> {
    try {
      const user = await this.userRepository.findByEmail(email)
      if (user === null) {
        throw new NotFoundException('Not exist user with this email')
      }
      return omitPassword(user)
    } catch (err) {
      throw err
    }
  }

  async findByID(id: string): Promise<UserResponse> {
    try {
      const user = await this.userRepository.findByID(id)
      if (user === null) {
        throw new NotFoundException('The user not exist')
      }
      return omitPassword(user)
    } catch (err) {
      throw err
    }
  }
}
