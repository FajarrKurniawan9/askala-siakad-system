import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new notification for a user (Admin Only)',
  })
  @ApiBody({ type: CreateNotificationDto })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'Retrieve all notifications (Admin, Student, or Parent Only)',
  })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary:
      'Retrieve a single notification by ID (Admin, Student, or Parent Only)',
  })
  @ApiParam({ name: 'id', description: 'UUID of the notification' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update a notification (Admin Only)',
  })
  @ApiParam({ name: 'id', description: 'UUID of the notification' })
  @ApiBody({ type: UpdateNotificationDto })
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete a notification by ID (Admin Only)',
  })
  @ApiParam({ name: 'id', description: 'UUID of the notification' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}

