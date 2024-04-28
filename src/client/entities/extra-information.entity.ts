import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  // ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { File } from 'src/file/entities/file.entity';
import { ExtraInfoTypeEnum } from 'src/utils/constants';
import { ClientProfile } from './clientProfile.entity';

@Entity()
export class ExtraInformation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  detail: string;

  @Column({
    type: 'enum',
    enum: ExtraInfoTypeEnum,
    nullable: true,
  })
  type: ExtraInfoTypeEnum;

  @OneToMany(() => File, (file) => file.visaApplicationExtraInformation, {
    eager: true,
  })
  @JoinColumn({ name: 'fileURI', referencedColumnName: 'url' })
  files: Relation<File>[];

  @Column({ type: 'simple-array', nullable: true })
  links: string[];

  @ManyToOne(() => ClientProfile, (profile) => profile.extraInformations)
  profile: Relation<ClientProfile>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
