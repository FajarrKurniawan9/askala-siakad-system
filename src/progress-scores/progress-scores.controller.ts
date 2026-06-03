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
import { ProgressScoresService } from './progress-scores.service';
import { CreateProgressScoreDto } from './dto/create-progress-score.dto';
import { UpdateProgressScoreDto } from './dto/update-progress-score.dto';

@ApiTags('Progress Scores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('progress-scores')
export class ProgressScoresController {
  constructor(private readonly progressScoresService: ProgressScoresService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create or update a progress score (Admin Only)',
    description:
      'Creates a new progress score for a student in a given month/year. ' +
      'If a score for the same student+month+year already exists, it is updated (upsert). ' +
      'The `studentId` must reference an existing student — a 404 is returned otherwise.',
  })
  @ApiCreatedResponse({
    description: 'Progress score created or updated successfully.',
  })
  @ApiNotFoundResponse({
    description: 'The referenced student does not exist.',
  })
  create(@Body() dto: CreateProgressScoreDto) {
    return this.progressScoresService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'List all progress scores (Admin, Student, or Parent Only)',
    description:
      'Returns all progress scores, ordered by year and month ascending (for line chart rendering). ' +
      'Optionally filter by `studentId` to return only scores for a specific student. ' +
      'Each score includes the full student profile and linked user details.',
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: 'Filter scores by student UUID.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'List of progress scores returned successfully.',
  })
  findAll(@Query('studentId') studentId?: string) {
    return this.progressScoresService.findAll(studentId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'Get a single progress score (Admin, Student, or Parent Only)',
    description:
      'Fetches one progress score by its UUID. ' +
      'Returns 404 if no score with the given ID exists.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the progress score to retrieve.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Progress score found and returned.' })
  @ApiNotFoundResponse({
    description: 'No progress score with the given UUID exists.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.progressScoresService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update a progress score (Admin Only)',
    description:
      'Partially updates a progress score. All fields are optional. ' +
      'Note: `studentId` cannot be changed — scores are permanently tied to their student.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the progress score to update.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Progress score updated successfully.' })
  @ApiNotFoundResponse({
    description: 'No progress score with the given UUID exists.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProgressScoreDto,
  ) {
    return this.progressScoresService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete a progress score (Admin Only)',
    description:
      'Permanently deletes a progress score. This action is irreversible. ' +
      'The linked student profile is not affected.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the progress score to delete.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Progress score deleted successfully.' })
  @ApiNotFoundResponse({
    description: 'No progress score with the given UUID exists.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.progressScoresService.remove(id);
  }
}
