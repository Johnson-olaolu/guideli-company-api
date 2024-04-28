import { User } from 'src/user/entities/user.entity';
import { AppNotificationEnum, notificationType } from 'src/utils/constants';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AppNotification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  notificationType: notificationType;

  @Column()
  notificationRef: string;

  @Column({
    type: 'enum',
    enum: AppNotificationEnum,
    default: AppNotificationEnum.CREATED,
  })
  status: AppNotificationEnum;

  @Column({ type: 'simple-json', nullable: true })
  data: any;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
