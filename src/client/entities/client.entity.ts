import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { ClientProfile } from './clientProfile.entity';

@Entity()
export class Client extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @ManyToOne(() => Company)
  company: Relation<Company>;

  @ManyToOne(() => User, (user) => user.clients)
  lawyer: Relation<User>;

  @OneToMany(() => ClientProfile, (profile) => profile.client)
  profiles: Relation<ClientProfile>[];

  @OneToOne(() => ClientProfile)
  @JoinColumn()
  defautProfile: ClientProfile;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
