import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { AchievementsModule } from './achievements/achievements.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { BillsModule } from './bills/bills.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ParentsModule } from './parents/parents.module';
import { UploadModule } from './upload/upload.module';
import { StudentOrganizationsModule } from './student-organizations/student-organizations.module';
import { ExtracurricularsModule } from './extracurriculars/extracurriculars.module';
import { TreasuryModule } from './treasury/treasury.module';
import { ProgressScoresModule } from './progress-scores/progress-scores.module';
import { ActivitiesModule } from './activities/activities.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    StudentsModule,
    AuthModule,
    AchievementsModule,
    OrganizationsModule,
    UsersModule,
    BillsModule,
    SubmissionsModule,
    ParentsModule,
    UploadModule,
    StudentOrganizationsModule,
    ExtracurricularsModule,
    TreasuryModule,
    ProgressScoresModule,
    ActivitiesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

