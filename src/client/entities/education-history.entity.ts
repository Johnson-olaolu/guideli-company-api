import { File } from 'src/file/entities/file.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  //   ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { ClientProfile } from './clientProfile.entity';

@Entity()
export class EducationHistory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  institutionName: string;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  fieldOfStudy: string;

  @Column({ nullable: true })
  qualificationEarned: string; //Might chnage to enum

  @OneToOne(() => File, { eager: true, createForeignKeyConstraints: false })
  @JoinColumn()
  earnedCertificate: Relation<File>;

  @OneToOne(() => File, { eager: true, createForeignKeyConstraints: false })
  @JoinColumn()
  transcriptCertificate: Relation<File>;

  @ManyToOne(() => ClientProfile, (profile) => profile.educationHistories)
  profile: Relation<ClientProfile>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
