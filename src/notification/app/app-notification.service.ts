import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppNotification } from './entity/app-notification.entity';
import { AppNotificationEnum, notificationType } from 'src/utils/constants';
import { User } from 'src/user/entities/user.entity';
import { generateReference } from 'src/utils/misc';

@Injectable()
export class AppNotificationService {
  constructor(
    @InjectRepository(AppNotification)
    private appNotificationRespository: Repository<AppNotification>,
  ) {}

  async findOne(notificationId: string) {
    const notification = await this.appNotificationRespository.findOne({
      where: { id: notificationId },
      relations: { user: true },
    });

    if (!notification) {
      throw new NotFoundException(
        `Notification not found for this id: ${this.appNotificationRespository}`,
      );
    }
    return notification;
  }

  async create(user: User, notificationType: notificationType, data?: any) {
    const notification = await this.appNotificationRespository.save({
      data: data,
      notificationRef: generateReference(user.id),
      user: user,
      notificationType: notificationType,
    });
    return notification;
  }

  async updateNotificationSeenStatus(notificationId: string) {
    const notification = await this.findOne(notificationId);
    notification.status = AppNotificationEnum.SEEN;
    await notification.save();
    return notification;
  }

  async findOneByRef(notificationRef: string) {
    const notification = await this.appNotificationRespository.findOne({
      where: { notificationRef },
    });
    if (!notification) {
      throw new NotFoundException(
        `Notification not found for this ref: ${this.appNotificationRespository}`,
      );
    }

    return notification;
  }

  async delete(notificationId: string) {
    const notification = await this.findOne(notificationId);
    await notification.remove();
    return notification;
  }

  async findAll() {
    const notifications = await this.appNotificationRespository.find();
    return notifications;
  }

  async findAllUserNotifications(userId: string) {
    const notifications = await this.appNotificationRespository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });
    return notifications;
  }
}
