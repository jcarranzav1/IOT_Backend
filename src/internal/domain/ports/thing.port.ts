import { Thing } from '../entities/thing.entity'

export interface IThingRepository {
  create: (thing: Thing) => Promise<Thing>
  findByID: (id: string) => Promise<Thing | null>
  findByUserEmail: (email: string) => Promise<Thing[]>
  findByName(name: string): Promise<Thing | null>
}
