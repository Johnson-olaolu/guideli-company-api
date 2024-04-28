import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecommendationLetter extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
