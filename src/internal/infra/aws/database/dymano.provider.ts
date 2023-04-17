import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

@Injectable()
export class DynamoDBProvider {
  private readonly dynamoDBClient: DynamoDBClient

  constructor(private readonly configService: ConfigService) {
    this.dynamoDBClient = new DynamoDBClient({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      },
    })
  }

  getClient(): DynamoDBClient {
    return this.dynamoDBClient
  }
}
