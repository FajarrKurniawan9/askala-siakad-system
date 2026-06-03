import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@ApiTags('Activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({
    summary: 'Log a student activity (Admin Or Student Only)',
    description:
      'Creates a new activity log entry linked to a specific student. ' +
      'The `studentId` must reference an existing student profile — a 404 is returned otherwise. ' +
      'Activity `type` can be `Prestasi`, `Organisasi`, `Eskul`, or `Pembayaran`. ' +
      'The `date` field defaults to the current timestamp if not provided.',
  })
  @ApiCreatedResponse({ description: 'Activity logged successfully.' })
  @ApiNotFoundResponse({
    description: 'The referenced student does not exist.',
  })
  create(@Body() dto: CreateActivityDto) {
    return this.activitiesService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'List all activities (Optionally filter by student)',
    description:
      'Returns all activity log entries, ordered by creation date (newest first). ' +
      'Optionally filter by `studentId` to return only activities for a specific student. ' +
      'Each activity includes the full student profile and their linked user details.',
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: 'Filter activities by student UUID.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'List of activities returned successfully.',
  })
  findAll(@Query('studentId') studentId?: string) {
    return this.activitiesService.findAll(studentId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'Get a single activity (Admin, Student, or Parent Only)',
    description:
      'Fetches one activity log entry by its UUID. ' +
      'Returns 404 if no activity with the given ID exists.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the activity to retrieve.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Activity found and returned.' })
  @ApiNotFoundResponse({
    description: 'No activity with the given UUID exists.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.activitiesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update an activity (Admin Only)',
    description:
      'Partially updates an activity log entry. All fields are optional. ' +
      'Note: `studentId` cannot be changed — activities are permanently tied to their student.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the activity to update.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Activity updated successfully.' })
  @ApiNotFoundResponse({
    description: 'No activity with the given UUID exists.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete an activity (Admin Only)',
    description:
      'Permanently deletes an activity log entry. This action is irreversible. ' +
      'The linked student profile is not affected.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the activity to delete.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Activity deleted successfully.' })
  @ApiNotFoundResponse({
    description: 'No activity with the given UUID exists.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.activitiesService.remove(id);
  }
}
