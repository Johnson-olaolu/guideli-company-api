import { Global, Module } from '@nestjs/common';
import { AwsFileService } from './aws/aws-file.service';
import { GuideliAIModule } from './guideli/guideli-ai.module';
import { StripeService } from './stripe/stripe.service';

@Global()
@Module({
  imports: [GuideliAIModule],
  providers: [AwsFileService, StripeService],
  exports: [AwsFileService, GuideliAIModule, StripeService],
})
export class ServicesModule {}
