/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkShortener {
  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {}

  async shortenUrl(longUrl: string): Promise<string> {
    const accessToken = 'YOUR_BITLY_ACCESS_TOKEN'; // Replace with your Bitly access token

    try {
      const response = await this.httpService
        .post(
          '/shorten',
          {
            long_url: longUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .toPromise();

      return response.data.link;
    } catch (error) {
      console.error('Error shortening URL:', error);
      throw error;
    }
  }
}
