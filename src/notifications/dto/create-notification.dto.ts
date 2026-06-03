import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Your payment for the July tuition has been verified.',
    description: 'The notification message text displayed to the user',
  })
  @IsString()
  @IsNotEmpty()
  text!: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the notification has been read (defaults to false)',
  })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @ApiPropertyOptional({
    example: 'payment',
    description:
      'Category of the notification (e.g., "payment", "achievement", "info")',
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the user who will receive this notification',
  })
  @IsInt()
  @IsNotEmpty()
  userId!: number;
}
