import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  //   ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  //   Relation,
  UpdateDateColumn,
} from 'typeorm';
import { ClientProfile } from './clientProfile.entity';

@Entity()
export class EmploymentHistory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  company: string;

  @Column({
    default: 'Full Time',
  })
  type: string;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  role: string;

  @ManyToOne(() => ClientProfile, (profile) => profile.employmentHistories)
  profile: Relation<ClientProfile>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
