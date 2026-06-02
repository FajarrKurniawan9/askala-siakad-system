import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@ApiTags('Achievements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  @ApiOperation({
    summary: 'Record a student achievement',
    description:
      'Creates a new achievement record linked to a specific student. ' +
      'The `studentId` must reference an existing student profile — a 404 is returned otherwise. ' +
      'Achievement `type` can be `AKADEMIK`, `ORGANISASI`, or `NON_AKADEMIK`. ' +
      'Achievement `level` ranges from `SEKOLAH` (school-level) up to `INTERNASIONAL`. ' +
      'All new achievements start as unverified (`isVerified: false`) by default.',
  })
  @ApiCreatedResponse({ description: 'Achievement recorded successfully.' })
  @ApiNotFoundResponse({
    description: 'The referenced student does not exist.',
  })
  create(@Body() dto: CreateAchievementDto) {
    return this.achievementsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all achievements',
    description:
      'Returns all achievement records across every student, ordered by creation date (newest first). ' +
      'Each achievement includes the full student profile and their linked user details ' +
      '(first name, last name, email, phone).',
  })
  @ApiOkResponse({
    description: 'List of all achievements returned successfully.',
  })
  findAll() {
    return this.achievementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single achievement',
    description:
      'Fetches one achievement by its UUID. ' +
      'Returns 404 if no achievement with the given ID exists.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the achievement to retrieve.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Achievement found and returned.' })
  @ApiNotFoundResponse({
    description: 'No achievement with the given UUID exists.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.achievementsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an achievement',
    description:
      'Partially updates an achievement record. All fields are optional. ' +
      'To officially verify a student achievement, set `isVerified: true`. ' +
      'To revoke a previous verification, set `isVerified: false`. ' +
      'Note: `studentId` cannot be changed via this endpoint — achievements are permanently ' +
      'tied to the student they were created for.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the achievement to update.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Achievement updated successfully.' })
  @ApiNotFoundResponse({
    description: 'No achievement with the given UUID exists.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAchievementDto,
  ) {
    return this.achievementsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an achievement',
    description:
      'Permanently deletes an achievement record. This action is irreversible. ' +
      'The linked student profile is not affected.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the achievement to delete.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Achievement deleted successfully.' })
  @ApiNotFoundResponse({
    description: 'No achievement with the given UUID exists.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.achievementsService.remove(id);
  }
}
