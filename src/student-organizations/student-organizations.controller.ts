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
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StudentOrganizationsService } from './student-organizations.service';
import { CreateStudentOrganizationDto } from './dto/create-student-organization.dto';
import { UpdateStudentOrganizationDto } from './dto/update-student-organization.dto';

@ApiTags('Student Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('student-organizations')
export class StudentOrganizationsController {
  constructor(
    private readonly studentOrganizationsService: StudentOrganizationsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Enroll a student in an organization (Admin only)' })
  @ApiBody({ type: CreateStudentOrganizationDto })
  create(@Body() dto: CreateStudentOrganizationDto) {
    return this.studentOrganizationsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary:
      'Retrieve all organization memberships (Admin, Student, or Parent Only)',
  })
  findAll() {
    return this.studentOrganizationsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary:
      'Retrieve a single organization membership by ID (Admin, Student, or Parent Only)',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the student-organization membership record',
  })
  findOne(@Param('id') id: string) {
    return this.studentOrganizationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a membership role or status (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the student-organization membership record',
  })
  @ApiBody({ type: UpdateStudentOrganizationDto })
  update(@Param('id') id: string, @Body() dto: UpdateStudentOrganizationDto) {
    return this.studentOrganizationsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Remove a student from an organization (Admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID of the student-organization membership record',
  })
  remove(@Param('id') id: string) {
    return this.studentOrganizationsService.remove(id);
  }
}
