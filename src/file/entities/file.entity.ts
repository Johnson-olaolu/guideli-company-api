import { ExtraInformation } from 'src/client/entities/extra-information.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: Relation<User>;

  @Column({ unique: true })
  url: string;

  @Column({ unique: true, nullable: true })
  s3URI: string;

  // @Column()
  // document_id: string;
  @Column()
  name: string;

  @Column()
  folder: string;

  @Column()
  content_type: string;

  @Column()
  size: string;

  @ManyToOne(
    () => ExtraInformation,
    (extraInformation) => extraInformation.files,
  )
  visaApplicationExtraInformation: ExtraInformation;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
