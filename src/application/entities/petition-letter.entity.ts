import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PetitionLetter extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
