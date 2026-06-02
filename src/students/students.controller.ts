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
  ApiConflictResponse,
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
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a student profile',
    description:
      'Creates a student profile and links it to an existing User account via `userId`. ' +
      'The referenced User account must already exist (role `STUDENT` recommended) — a 404 is returned otherwise. ' +
      'The `nis` (Nomor Induk Siswa / student registration number) must be unique across all students. ' +
      'Optionally, link the student to an existing Parent profile by providing `parentId`.',
  })
  @ApiCreatedResponse({ description: 'Student profile created successfully.' })
  @ApiConflictResponse({
    description:
      'A student with this NIS, or a profile for this userId, already exists.',
  })
  @ApiNotFoundResponse({
    description: 'The referenced User account (userId) does not exist.',
  })
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'List all student profiles',
    description:
      'Returns all student profiles, each including the linked user details ' +
      '(first name, last name, email, phone, and role).',
  })
  @ApiOkResponse({
    description: 'List of all student profiles returned successfully.',
  })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'Get a single student profile',
    description:
      'Fetches one student profile by its UUID, including the linked user details.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the student profile to retrieve.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Student profile found and returned.' })
  @ApiNotFoundResponse({
    description: 'No student profile with the given UUID exists.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update a student profile',
    description:
      'Partially updates a student profile. All fields are optional. ' +
      'If `nis` is changed, it must remain unique across all students. ' +
      'If `parentId` is changed, it must reference an existing Parent profile. ' +
      'Note: `userId` cannot be changed via this endpoint — the user link is set at creation.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the student profile to update.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Student profile updated successfully.' })
  @ApiNotFoundResponse({
    description:
      'No student profile with the given UUID exists, or the new parentId does not reference an existing Parent profile.',
  })
  @ApiConflictResponse({
    description: 'A student with the new NIS already exists.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete a student profile',
    description:
      'Permanently deletes a student profile. This action is irreversible. ' +
      'Due to `ON DELETE CASCADE` in the database schema, all records belonging to this student — ' +
      'including achievements, payment submissions, organization memberships, ' +
      'activity logs, and progress scores — will also be automatically deleted.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the student profile to delete.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Student profile deleted successfully.' })
  @ApiNotFoundResponse({
    description: 'No student profile with the given UUID exists.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.studentsService.remove(id);
  }
}
