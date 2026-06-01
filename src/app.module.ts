import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { AuthModule } from './auth/auth.module';
import { AchievementsModule } from './achievements/achievements.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';
import { BillsModule } from './bills/bills.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ParentsModule } from './parents/parents.module';

@Module({
  imports: [
    StudentsModule,
    AuthModule,
    AchievementsModule,
    OrganizationsModule,
    UsersModule,
    BillsModule,
    SubmissionsModule,
    ParentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
