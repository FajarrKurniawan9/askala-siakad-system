import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  create(createNotificationDto: CreateNotificationDto) {
    return `This action adds a new notification for user ID ${createNotificationDto.userId}`;
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification with data: ${JSON.stringify(updateNotificationDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
