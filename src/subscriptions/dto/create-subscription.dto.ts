import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { SubscriptionFrequency } from '../enums/subscription-frequency.enum';

export class CreateSubscriptionDto {
  @ApiProperty({ type: 'string', example: 'email@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: 'boolean', example: true })
  @IsBoolean()
  @IsOptional()
  is_email_verified: boolean;

  @ApiProperty({ type: 'string', example: 'Omar' })
  @IsString()
  @IsNotEmpty()
  subscriber_name: string;

  @ApiProperty({ type: 'string', example: 'Egypt' })
  @IsString()
  @IsOptional()
  subscriber_country: string;

  @ApiProperty({ type: 'enum', enum: SubscriptionFrequency })
  @IsEnum(SubscriptionFrequency)
  @IsNotEmpty()
  frequency: SubscriptionFrequency;
}
