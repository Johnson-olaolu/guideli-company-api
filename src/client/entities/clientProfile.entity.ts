import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { EducationHistory } from './education-history.entity';
import { EmploymentHistory } from './employment-history.entity';
import { ExtraInformation } from './extra-information.entity';
import { Client } from './client.entity';
import { File } from 'src/file/entities/file.entity';

@Entity()
export class ClientProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => File)
  cv: Relation<File>;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToOne(() => Client, (client) => client.profiles)
  client: Relation<Client>;

  @OneToMany(
    () => EducationHistory,
    (educationHistory) => educationHistory.profile,
  )
  educationHistories: Relation<EducationHistory>[];

  @OneToMany(
    () => EmploymentHistory,
    (employmentHistory) => employmentHistory.profile,
  )
  employmentHistories: Relation<EmploymentHistory>[];

  @OneToMany(
    () => ExtraInformation,
    (extraInformation) => extraInformation.profile,
  )
  extraInformations: Relation<ExtraInformation>[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
