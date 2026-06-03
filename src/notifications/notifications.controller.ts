import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification for a user' })
  @ApiBody({ type: CreateNotificationDto })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all notifications' })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single notification by ID' })
  @ApiParam({ name: 'id', description: 'Numeric ID of the notification' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notification (e.g., mark as read)' })
  @ApiParam({ name: 'id', description: 'Numeric ID of the notification' })
  @ApiBody({ type: UpdateNotificationDto })
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification by ID' })
  @ApiParam({ name: 'id', description: 'Numeric ID of the notification' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }
}
