import { PartialType } from '@nestjs/swagger';
import { CreateStudentOrganizationDto } from './create-student-organization.dto';

export class UpdateStudentOrganizationDto extends PartialType(
  CreateStudentOrganizationDto,
) {}
