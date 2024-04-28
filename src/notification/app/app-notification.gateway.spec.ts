import { Test, TestingModule } from '@nestjs/testing';
import { AppNotificationGateway } from './app-notification.gateway';

describe('AppNotificationGateway', () => {
  let gateway: AppNotificationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppNotificationGateway],
    }).compile();

    gateway = module.get<AppNotificationGateway>(AppNotificationGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
