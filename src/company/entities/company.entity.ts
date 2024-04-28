import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyProfile } from './company-profile';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({ default: 0 })
  onboardingStage: number;

  @OneToOne(() => CompanyProfile)
  @JoinColumn()
  profile: Relation<CompanyProfile>;

  @OneToMany(() => User, (user) => user.company)
  users: Relation<User>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
