import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
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
import * as bcrypt from 'bcryptjs';
import { Profile } from './profile.entity';

import { Exclude, instanceToPlain } from 'class-transformer';
import { Role } from '../role/entities/role.entity';
import { Company } from 'src/company/entities/company.entity';
import { Client } from 'src/client/entities/client.entity';
import { isBcryptHash } from 'src/utils/misc';

@Entity({
  name: '_user',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: true,
  })
  emailVerificationToken: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: true,
  })
  emailVerificationTokenTTL: Date;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: true,
  })
  passwordResetToken: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: true,
  })
  passwordResetTokenTTL: Date;

  @Column({
    default: false,
  })
  isEmailVerified: boolean;

  @OneToOne(() => Profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: Profile;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleName', referencedColumnName: 'name' })
  role: Role;

  @Column()
  roleName: string;

  @Column({ default: false })
  acceptedInvite: boolean;

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({ name: 'companyName', referencedColumnName: 'name' })
  company: Relation<Company>;

  @Column({ nullable: true })
  companyName: string;

  @OneToMany(() => Client, (client) => client.lawyer)
  clients: Relation<Client>[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      if (!isBcryptHash(this.password)) {
        this.password = await bcrypt.hash(this.password, 3); // You can adjust the salt rounds as needed
      }
    }
  }

  async comparePasswords(password: string): Promise<boolean> {
    const result = await bcrypt.compareSync(password, this.password);
    return result;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
