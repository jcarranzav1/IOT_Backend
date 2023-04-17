import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from 'src/internal/domain/entities/user.entity'
import { IUserRepository } from 'src/internal/domain/ports/user.port'
import { v4 as uuidv4 } from 'uuid'
import { DynamoDBProvider } from '../aws/database/dymano.provider'
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly tableName: string
  private readonly dynamoDBClient: DynamoDBClient

  constructor(
    private readonly dynamoDBProvider: DynamoDBProvider,
    private readonly configService: ConfigService,
  ) {
    this.tableName = this.configService.get<string>('dynamodb.userTable')
    this.dynamoDBClient = this.dynamoDBProvider.getClient()
  }

  async createUser(user: User): Promise<User> {
    user.userID = uuidv4()
    user.createdAt = new Date()
    user.updatedAt = new Date()
    const params = {
      TableName: this.tableName,
      Item: marshall(
        {
          ...user,
          createdAt: user.createdAt.toISOString(), //lo convertimos a string, porque dynamo no acepta formato Date
          updatedAt: user.updatedAt.toISOString(),
        },
        { convertClassInstanceToMap: true },
      ),
    }
    const putCommand = new PutItemCommand(params)
    await this.dynamoDBClient.send(putCommand)
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        email: { S: email },
      },
    }
    const getCommand = new GetItemCommand(params)
    const { Item } = await this.dynamoDBClient.send(getCommand)

    if (Item) {
      return unmarshall(Item) as User
    } else {
      return null
    }
  }

  async findByID(userID: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      IndexName: 'userID-index', // Asegúrate de crear un índice global secundario en DynamoDB con el atributo "name"
      KeyConditionExpression: 'userID = :id',
      ExpressionAttributeValues: {
        ':id': { S: userID },
      },
    }

    const getCommand = new QueryCommand(params)
    const { Items } = await this.dynamoDBClient.send(getCommand)

    if (Items && Items[0]) {
      return unmarshall(Items[0]) as User
    } else {
      return null
    }
  }

  async findAllUsers(): Promise<User[]> {
    const params: ScanCommandInput = {
      TableName: this.tableName,
    }

    const scanCommand = new ScanCommand(params)
    const { Items } = await this.dynamoDBClient.send(scanCommand)

    if (Items) {
      return Items.map((item) => unmarshall(item) as User)
    } else {
      return []
    }
  }
}
