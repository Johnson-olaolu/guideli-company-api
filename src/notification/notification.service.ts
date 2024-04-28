import { Injectable } from '@nestjs/common';
import { MailService } from './mail/mail.service';
import { User } from 'src/user/entities/user.entity';
import { AppNotificationGateway } from './app/app-notification.gateway';
import { Payment } from 'src/payment/entities/payment.entity';
import { Company } from 'src/company/entities/company.entity';

@Injectable()
export class NotificationService {
  constructor(
    private emailService: MailService,
    private appNotification: AppNotificationGateway,
  ) {}

  async sendCompanyRegistrationSuccess(user: User, company: Company) {
    this.emailService.sendCompanyRegistrationSuccessMail(user, company);
  }

  async sendInviteUserEmail(user: User, company: Company) {
    this.emailService.sendAcceptCompanyInviteMail(user, company);
  }

  async sendRegistrationSuccessNotification(user: User) {
    await this.emailService.sendRegistrationSuccessMail(user);
  }

  async sendResetPasswordNotification(user: User) {
    await this.emailService.sendResetPasswordMail(user);
  }

  async sendGenerateLettersNotification(user: User) {
    await this.emailService.sendRecommendationLetterMail(user);
    await this.appNotification.sendRecommendationLetterNotitification(user);
    await this.emailService.sendPetitionLetterMail(user);
    await this.appNotification.sendPetitionLetterNoification(user);
  }

  async sendPaymentSuccessfullNotification(user: User, payment: Payment) {
    await this.appNotification.sendPaymentSuccessfullNoification(user, payment);
  }
}
