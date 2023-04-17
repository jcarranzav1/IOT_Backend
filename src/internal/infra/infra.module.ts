import { Module } from '@nestjs/common'
import { UserRepository } from './adapter/users.repository'
import { DynamoDBProvider } from './aws/database/dymano.provider'
import { IoTThingProvider } from './aws/iot/iot.provider'
import { ThingRepository } from './adapter/things.repository'

@Module({
  providers: [
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'IThingRepository', useClass: ThingRepository },
    DynamoDBProvider,
    IoTThingProvider,
  ],
  exports: [
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'IThingRepository', useClass: ThingRepository },

    IoTThingProvider,
  ],
})
export default class InfraModule {}
