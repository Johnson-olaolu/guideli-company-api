import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/utils/env.validation';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.stripe = new Stripe(configService.get('STRIPE_API_SECRET_KEY'));
  }

  getPusblishableKey(): string {
    return this.configService.get('STRIPE_PUBLISHABLE_KEY');
  }

  async createPaymentIntent(
    userName: string,
    email,
    metadata: Record<string, string>,
    currency = 'usd',
  ) {
    const customer = await this.stripe.customers.create({
      name: userName,
      email: email,
      metadata: {
        ...metadata,
        webhook_url: `${this.configService.get('BASE_URL')}/payment/stripe/payment-webhook`,
      },
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      currency: currency,
      amount: 10000,
      receipt_email: email,
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
    });

    return paymentIntent;
  }

  async getCustomer(id: string) {
    const customer = await this.stripe.customers.retrieve(id);
    return customer as Stripe.Response<Stripe.Customer>;
  }
}
