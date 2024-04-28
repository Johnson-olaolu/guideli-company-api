import { forwardRef, Inject } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppNotificationService } from './app-notification.service';
import { User } from 'src/user/entities/user.entity';
import { Payment } from 'src/payment/entities/payment.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'notification',
})
export class AppNotificationGateway {
  constructor(
    @Inject(forwardRef(() => AppNotificationService))
    private appNotificationService: AppNotificationService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query?.userId as string;
    if (userId) {
      this.updateUserNotifications(userId);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(client: Socket) {
    // Handle disconnection event
  }

  async updateUserNotifications(userId: string) {
    const notifications =
      await this.appNotificationService.findAllUserNotifications(userId);
    this.server.emit(userId, notifications);
  }

  @SubscribeMessage('notificationSeen')
  async handleNotificationSeen(client: any, payload: string) {
    const notification =
      await this.appNotificationService.updateNotificationSeenStatus(payload);
    this.updateUserNotifications(notification.user.id);
  }

  @SubscribeMessage('notificationDelete')
  async handleNotificationDelete(client: any, payload: string) {
    const notification = await this.appNotificationService.delete(payload);
    if (notification) {
      this.updateUserNotifications(notification.user.id);
    }
  }

  async sendRecommendationLetterNotitification(user: User) {
    await this.appNotificationService.create(user, 'recommendation-generated');
    this.updateUserNotifications(user.id);
  }

  async sendPetitionLetterNoification(user: User) {
    await this.appNotificationService.create(user, 'petition-generated');
    this.updateUserNotifications(user.id);
  }

  async sendPaymentSuccessfullNoification(user: User, payment: Payment) {
    await this.appNotificationService.create(
      user,
      'payment-confirmed',
      payment,
    );
    this.updateUserNotifications(user.id);
  }
}
