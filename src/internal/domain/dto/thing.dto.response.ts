import { Thing } from '../entities/thing.entity'

export type ThingResponse = Omit<
  Thing,
  'thingArn' | 'certificatePem' | 'certificateArn' | 'privateKey' | 'publicKey'
>

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

export interface ThingCredential {
  certificateArn: string
  certificatePem: string
  privateKey: string
  publicKey: string
}

export interface ThingCredentialsResponse extends ThingCredential {
  thingArn: string
}
