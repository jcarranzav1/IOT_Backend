import { ApiProperty } from '@nestjs/swagger'
import { SensorType, Thing } from '../../entities/thing.entity'
import { ApiResponseDto } from './api-response.dto'

export class ThingResponse {
  @ApiProperty()
  thingID: string

  @ApiProperty()
  email: string

  @ApiProperty()
  name: string

  @ApiProperty({ enum: SensorType })
  typeName: SensorType

  @ApiProperty()
  workplaceName: string

  @ApiProperty()
  manufacturer: string

  @ApiProperty()
  version: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

export function omitSensibleInfo(thing: Thing): ThingResponse {
  const {
    certificateArn,
    certificatePem,
    privateKey,
    publicKey,
    thingArn,
    ...rest
  } = thing
  return rest
}

export class ThingCredential {
  @ApiProperty()
  certificateArn: string

  @ApiProperty()
  certificatePem: string

  @ApiProperty()
  privateKey: string

  @ApiProperty()
  publicKey: string
}

export class ThingCredentialsResponse extends ThingCredential {
  @ApiProperty()
  thingArn: string
}

export class ThingResponseApi extends ApiResponseDto<ThingResponse> {
  @ApiProperty({ type: () => ThingResponse })
  data: ThingResponse
}

export class AllThingsResponseApi extends ApiResponseDto<ThingResponse[]> {
  @ApiProperty({ type: () => ThingResponse, isArray: true })
  data: ThingResponse[]
}

export class ThingCeredentialsResponseApi extends ApiResponseDto<ThingCredentialsResponse> {
  @ApiProperty({ type: () => ThingCredentialsResponse })
  data: ThingCredentialsResponse
}
