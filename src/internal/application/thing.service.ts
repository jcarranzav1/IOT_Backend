import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Thing } from '../domain/entities/thing.entity'
import { IThingRepository } from '../domain/ports/thing.port'
import { CreateThingDTO } from '../domain/dto/thing.dto'
import { IoTThingProvider } from '../infra/aws/iot/iot.provider'
import { decrypt, encrypt } from 'src/utils/crypto.utils'
import { ConfigService } from '@nestjs/config'
import {
  ThingResponse,
  omitSensibleInfo,
  ThingCredentialsResponse,
} from '../domain/dto/response/thing.dto.response'
import { IUserRepository } from '../domain/ports/user.port'

const POLICY_NAME = 'IOTPolicy'

export interface IThingService {
  create: (createDTO: CreateThingDTO) => Promise<ThingResponse>
  findByID: (thingID: string) => Promise<ThingResponse | null>
  findAllByUserID: (userID: string) => Promise<ThingResponse[]>
  getCredentialsByID: (thingID: string) => Promise<ThingCredentialsResponse>
}

@Injectable()
export class ThingService implements IThingService {
  constructor(
    @Inject('IThingRepository') private readonly thingRepository: IThingRepository,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly iotThingProvider: IoTThingProvider,
    private readonly configService: ConfigService,
  ) {}

  async create(createDTO: CreateThingDTO): Promise<ThingResponse> {
    try {
      // Buscar al usuario por correo electrónico
      const user = await this.userRepository.findByEmail(createDTO.email)

      // Si el usuario no existe, lanzar un error
      if (!user) {
        throw new NotFoundException('Not exist user with this email')
      }

      createDTO.name = createDTO.name.toLowerCase()
      const thingExist = await this.thingRepository.findByName(createDTO.name)

      if (thingExist) {
        throw new BadRequestException('Already exist thing with that name')
      }

      // Crear una nueva instancia de Thing
      const thingEntity = new Thing(createDTO)

      // Crear el objeto Thing en AWS IoT y obtener el ARN del Thing
      const thingArn = await this.iotThingProvider.createThing(createDTO)

      // Obtener o crear una política en AWS IoT
      await this.iotThingProvider.getOrCreatePolicy(
        POLICY_NAME,
        thingEntity.workplaceName,
        thingEntity.typeName,
      )

      // Crear un nuevo par de claves y certificado en AWS IoT
      const thingCredentials = await this.iotThingProvider.createKeysAndCertificate()

      // Asociar la política al certificado en AWS IoT
      await this.iotThingProvider.attachPolicy(
        POLICY_NAME,
        thingCredentials.certificateArn,
      )

      // Asociar el certificado al objeto Thing en AWS IoT
      await this.iotThingProvider.attachThingPrincipal(
        thingEntity.name,
        thingCredentials.certificateArn,
      )

      const cryptoSecret = this.configService.get<string>('crypto.secret')

      // Cifrar el ARN del Thing, el ARN del certificado, el certificado PEM y las claves privada y pública
      thingEntity.thingArn = encrypt(thingArn, cryptoSecret)
      thingEntity.certificateArn = encrypt(
        thingCredentials.certificateArn,
        cryptoSecret,
      )
      thingEntity.certificatePem = encrypt(
        thingCredentials.certificatePem,
        cryptoSecret,
      )
      thingEntity.privateKey = encrypt(thingCredentials.privateKey, cryptoSecret)
      thingEntity.publicKey = encrypt(thingCredentials.publicKey, cryptoSecret)

      // Guardar la entidad Thing en la base de datos
      const result = await this.thingRepository.create(thingEntity)

      return omitSensibleInfo(result)
    } catch (err) {
      throw err
    }
  }

  async findByID(thingID: string): Promise<ThingResponse> {
    const thing = await this.thingRepository.findByID(thingID)

    if (!thing) {
      throw new NotFoundException('Thing not found')
    }

    return omitSensibleInfo(thing)
  }

  async findAllByUserID(userID: string): Promise<ThingResponse[]> {
    const user = await this.userRepository.findByID(userID)

    if (!user) {
      throw new NotFoundException('Not exist user with this id')
    }

    const things = await this.thingRepository.findByUserEmail(user.email)
    return things.map(omitSensibleInfo)
  }

  async getCredentialsByID(thingID: string): Promise<ThingCredentialsResponse> {
    const thing = await this.thingRepository.findByID(thingID)

    if (!thing) {
      throw new NotFoundException('Thing not found')
    }

    const cryptoSecret = this.configService.get<string>('crypto.secret')
    const decryptedThingArn = decrypt(thing.thingArn, cryptoSecret)
    const decryptedCertificateArn = decrypt(thing.certificateArn, cryptoSecret)
    const decryptedCertificatePem = decrypt(thing.certificatePem, cryptoSecret)
    const decryptedPrivateKey = decrypt(thing.privateKey, cryptoSecret)
    const decryptedPublicKey = decrypt(thing.publicKey, cryptoSecret)

    return {
      thingArn: decryptedThingArn,
      certificateArn: decryptedCertificateArn,
      certificatePem: decryptedCertificatePem,
      privateKey: decryptedPrivateKey,
      publicKey: decryptedPublicKey,
    }
  }
}
