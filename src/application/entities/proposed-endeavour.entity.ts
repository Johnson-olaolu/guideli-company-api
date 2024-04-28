import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProposedEndeavour extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
