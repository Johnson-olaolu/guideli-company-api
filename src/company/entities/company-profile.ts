import { File } from 'src/file/entities/file.entity';
import { Location } from 'src/utils/constants';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class CompanyProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contactEmail: string;

  @Column()
  contactPhoneNo: string;

  @Column()
  website: string;

  @Column()
  address: string;

  @Column()
  zipCode: string;

  @Column({ type: 'simple-json' })
  country: Location;

  @Column({ type: 'simple-json' })
  state: Location;

  @OneToOne(() => File)
  @JoinColumn({ name: 'logoUrl', referencedColumnName: 'url' })
  logo: Relation<File>;

  @OneToOne(() => Company)
  company: Relation<Company>;

  @Column({ nullable: true })
  logoUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
