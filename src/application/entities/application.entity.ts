import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
