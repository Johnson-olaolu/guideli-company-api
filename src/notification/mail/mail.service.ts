import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/user/entities/user.entity';
import { EnvironmentVariables } from 'src/utils/env.validation';

@Injectable()
export class MailService {
  logger = new Logger(MailService.name);
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService<EnvironmentVariables>,
  ) {}

  async sendCompanyRegistrationSuccessMail(user: User, company: Company) {
    const response = await this.mailerService.sendMail({
      to: user.email,
      from: '<no-reply@guideli.com>', // override default from
      subject: 'Thanks for Registering your company with Guideli',
      template: './register_company', // `.hbs` extension is appended automatically
      context: {
        company: company.name,
        email: user.email,
        project_name: this.configService.get('PROJECT'),
      },
    });

    this.logger.log(
      `Company Registration Success Mail Sent to : ${response?.response?.accepted?.toString()}`,
    );
    console.log(response);
    return response?.response;
  }

  async sendAcceptCompanyInviteMail(user: User, company: Company) {
    const response = await this.mailerService.sendMail({
      to: user.email,
      from: '<no-reply@guideli.com>', // override default from
      subject: `Join ${company.name} on Guideli`,
      template: './accept_invite', // `.hbs` extension is appended automatically
      context: {
        company: company.name,
        email: user.email,
        project_name: this.configService.get('PROJECT'),
        domain_url: this.configService.get('CLIENT_URL'),
        accept_endpoint: `/auth/accept-invite?email=${user.email}&company=${encodeURI(company.name)}`,
      },
    });

    this.logger.log(
      `Invite Mail Sent to : ${response?.response?.accepted?.toString()}`,
    );
    console.log(response);
    return response?.response;
  }

  async sendRegistrationSuccessMail(user: User) {
    const response = await this.mailerService.sendMail({
      to: user.email,
      from: '<no-reply@guideli.com>', // override default from
      subject: 'Welcome to Guideli Please confirm your email',
      template: './email_verification', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        // "request": request,
        email: user.email,
        first_name: user.profile.firstName,
        last_name: user.profile.lastName,
        project_name: this.configService.get('PROJECT'),
        domain_url: this.configService.get('BASE_URL'),
        verify_endpoint: `/auth/confirm-email/confirm?token=${user.emailVerificationToken}&email=${user.email}`,
      },
    });
    this.logger.log(
      `Registration  Success Mail Sent to : ${response?.response?.accepted?.toString()}`,
    );
    console.log(response);
    return response?.response;
  }

  async sendResetPasswordMail(user: User) {
    const response = await this.mailerService.sendMail({
      to: user.email,
      from: '<no-reply@guideli.com>', // override default from
      subject: 'Password Reset',
      template: './reset_password', // `.hbs` extension is appended automatically
      context: {
        email: user.email,
        first_name: user.profile.firstName,
        last_name: user.profile.lastName,
        project_name: this.configService.get('PROJECT'),
        domain_url: this.configService.get('CLIENT_URL'),
        reset_endpoint: `/reset-password?token=${user.passwordResetToken}&email=${user.email}`,
      },
    });
    this.logger.log(
      `Password Reset Mail Sent to : ${response?.envelope?.to?.toString()}`,
    );
    return response;
  }

  async sendPetitionLetterMail(user: User) {
    const response = await this.mailerService.sendMail({
      to: user.email,
      from: '<no-reply@guideli.com>', // override default from
      subject: 'Draft Petition Letter',
      template: './recommendation_letter', // `.hbs` extension is appended automatically
      context: {
        email: user.email,
        first_name: user.profile.firstName,
        last_name: user.profile.lastName,
        type: 'petition',
        project_name: this.configService.get('PROJECT'),
        domain_url: this.configService.get('CLIENT_URL'),
        endpoint: `/application/management/draft-petition`,
      },
    });
    this.logger.log(
      `Petition letter Mail Sent to : ${response?.envelope?.to?.toString()}`,
    );
    return response;
  }

  async sendRecommendationLetterMail(user: User) {
    const response = await this.mailerService.sendMail({
      to: user.email,
      from: '<no-reply@guideli.com>', // override default from
      subject: 'Draft Recommendation Letter',
      template: './recommendation_letter', // `.hbs` extension is appended automatically
      context: {
        email: user.email,
        first_name: user.profile.firstName,
        last_name: user.profile.lastName,
        type: 'recommendation',
        project_name: this.configService.get('PROJECT'),
        domain_url: this.configService.get('CLIENT_URL'),
        endpoint: `/application/management/draft-recommendation`,
      },
    });
    this.logger.log(
      `Recommendation Sent to : ${response?.envelope?.to?.toString()}`,
    );
    return response;
  }
}
