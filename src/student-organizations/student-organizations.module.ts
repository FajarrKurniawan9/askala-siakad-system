import { Module } from '@nestjs/common';
import { StudentOrganizationsService } from './student-organizations.service';
import { StudentOrganizationsController } from './student-organizations.controller';

@Module({
  controllers: [StudentOrganizationsController],
  providers: [StudentOrganizationsService],
})
export class StudentOrganizationsModule {}
