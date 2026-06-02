import { Module } from '@nestjs/common';
import { StudentOrganizationsService } from './student-organizations.service';
import { StudentOrganizationsController } from './student-organizations.controller';
import { PrismaService } from '../../prisma/prisma.service'; // <--- Import ini

@Module({
  controllers: [StudentOrganizationsController],
  providers: [StudentOrganizationsService, PrismaService],
})
export class StudentOrganizationsModule {}
