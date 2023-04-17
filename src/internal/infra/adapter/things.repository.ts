import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v4 as uuidv4 } from 'uuid'
import { DynamoDBProvider } from '../aws/database/dymano.provider'
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { IThingRepository } from 'src/internal/domain/ports/thing.port'
import { Thing } from 'src/internal/domain/entities/thing.entity'

@Injectable()
export class ThingRepository implements IThingRepository {
  private readonly tableName: string
  private readonly dynamoDBClient: DynamoDBClient

  constructor(
    private readonly dynamoDBProvider: DynamoDBProvider,
    private readonly configService: ConfigService,
  ) {
    this.tableName = this.configService.get<string>('dynamodb.thingTable')
    this.dynamoDBClient = this.dynamoDBProvider.getClient()
  }

  async create(thing: Thing): Promise<Thing> {
    thing.thingID = uuidv4()
    thing.createdAt = new Date()
    thing.updatedAt = new Date()
    const params = {
      TableName: this.tableName,
      Item: marshall(
        {
          ...thing,
          createdAt: thing.createdAt.toISOString(), //lo convertimos a string, porque dynamo no acepta formato Date
          updatedAt: thing.updatedAt.toISOString(),
        },
        { convertClassInstanceToMap: true },
      ),
    }
    const putCommand = new PutItemCommand(params)
    await this.dynamoDBClient.send(putCommand)
    return thing
  }

  async findByUserEmail(email: string): Promise<Thing[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email },
      },
    }

    const queryCommand = new QueryCommand(params)
    const data = await this.dynamoDBClient.send(queryCommand)

    return data.Items.map((item) => unmarshall(item) as Thing)
  }

  async findByID(thingID: string): Promise<Thing | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        thingID: { S: thingID },
      },
    }
    const getCommand = new GetItemCommand(params)
    const { Item } = await this.dynamoDBClient.send(getCommand)

    if (Item) {
      return unmarshall(Item) as Thing
    } else {
      return null
    }
  }

  async findByName(name: string): Promise<Thing | null> {
    const params = {
      TableName: this.tableName,
      IndexName: 'name-index',
      KeyConditionExpression: '#thingName = :name', // Usa un alias para el atributo "name"
      ExpressionAttributeNames: {
        '#thingName': 'name', // Define el alias para el atributo "name"
      },
      ExpressionAttributeValues: {
        ':name': { S: name },
      },
    }

    const queryCommand = new QueryCommand(params)
    const { Items } = await this.dynamoDBClient.send(queryCommand)

    if (Items && Items[0]) {
      return unmarshall(Items[0]) as Thing
    } else {
      return null
    }
  }
}
