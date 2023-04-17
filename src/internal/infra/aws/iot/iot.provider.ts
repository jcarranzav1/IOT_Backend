import {
  AttachPolicyCommand,
  AttachThingPrincipalCommand,
  CreateKeysAndCertificateCommand,
  CreatePolicyCommand,
  CreateThingCommand,
  CreateThingTypeCommand,
  DeleteThingCommand,
  DescribeThingTypeCommand,
  GetPolicyCommand,
  IoTClient,
} from '@aws-sdk/client-iot'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateThingDTO } from 'src/internal/domain/dto/thing.dto'
import { ThingCredential } from 'src/internal/domain/dto/thing.dto.response'

@Injectable()
export class IoTThingProvider {
  private iotClient: IoTClient

  constructor(private configService: ConfigService) {
    this.iotClient = new IoTClient({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      },
    })
  }

  private async getOrCreateThingType(typeName: string): Promise<void> {
    try {
      const describeThingTypeCommand = new DescribeThingTypeCommand({
        thingTypeName: typeName,
      })
      await this.iotClient.send(describeThingTypeCommand)
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        const createThingTypeCommand = new CreateThingTypeCommand({
          thingTypeName: typeName,
        })
        await this.iotClient.send(createThingTypeCommand)
      } else {
        throw error
      }
    }
  }

  async createThing(createThingInput: CreateThingDTO): Promise<string> {
    await this.getOrCreateThingType(createThingInput.typeName)
    const createThingParams = {
      thingName: createThingInput.name,
      thingTypeName: createThingInput.typeName,
      attributePayload: {
        attributes: {
          workplaceName: createThingInput.workplaceName,
          manufacturer: createThingInput.manufacturer,
          version: createThingInput.version,
        },
      },
    }
    const createThingCommand = new CreateThingCommand(createThingParams)
    const { thingArn } = await this.iotClient.send(createThingCommand)
    return thingArn
  }

  async createKeysAndCertificate(): Promise<ThingCredential> {
    const createKeysAndCertificateCommand = new CreateKeysAndCertificateCommand({
      setAsActive: true,
    })

    const { certificateArn, certificatePem, keyPair } = await this.iotClient.send(
      createKeysAndCertificateCommand,
    )

    return {
      certificateArn,
      certificatePem,
      privateKey: keyPair.PrivateKey,
      publicKey: keyPair.PublicKey,
    }
  }

  async getOrCreatePolicy(
    policyName: string,
    workplace: string,
    typeSensor: string,
  ): Promise<string> {
    const region = this.configService.get<string>('aws.region')
    const accountId = this.configService.get<string>('aws.accountId')

    let policyArn: string

    try {
      const getPolicyCommand = new GetPolicyCommand({ policyName })
      const policy = await this.iotClient.send(getPolicyCommand)
      policyArn = policy.policyArn
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        // Lógica para crear la política si no existe
        const policyDocument = JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: 'iot:Connect',
              Resource: '*',
            },
            {
              Effect: 'Allow',
              Action: 'iot:Publish',
              Resource: `arn:aws:iot:${region}:${accountId}:topic/${workplace}/${typeSensor}/*`,
            },
            {
              Effect: 'Allow',
              Action: 'iot:Subscribe',
              Resource: `arn:aws:iot:${region}:${accountId}:topicfilter/${workplace}/${typeSensor}/*`,
            },
            {
              Effect: 'Allow',
              Action: 'iot:Receive',
              Resource: `arn:aws:iot:${region}:${accountId}:topic/${workplace}/${typeSensor}/*`,
            },
          ],
        })

        const createPolicyCommand = new CreatePolicyCommand({
          policyName,
          policyDocument,
        })
        const createdPolicy = await this.iotClient.send(createPolicyCommand)

        policyArn = createdPolicy.policyArn
      } else {
        throw error
      }
    }

    return policyArn
  }

  async attachPolicy(policyName: string, target: string): Promise<void> {
    const attachPolicyCommand = new AttachPolicyCommand({ policyName, target })
    await this.iotClient.send(attachPolicyCommand)
  }

  async attachThingPrincipal(thingName: string, principal: string): Promise<void> {
    const attachThingPrincipalCommand = new AttachThingPrincipalCommand({
      thingName,
      principal,
    })
    await this.iotClient.send(attachThingPrincipalCommand)
  }

  async deleteThing(thingName: string): Promise<void> {
    const deleteThingCommand = new DeleteThingCommand({ thingName })
    await this.iotClient.send(deleteThingCommand)
  }
}
