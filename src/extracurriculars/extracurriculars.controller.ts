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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ExtracurricularsService } from './extracurriculars.service';
import { CreateExtracurricularDto } from './dto/create-extracurricular.dto';
import { UpdateExtracurricularDto } from './dto/update-extracurricular.dto';

@ApiTags('Extracurriculars')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('extracurriculars')
export class ExtracurricularsController {
  constructor(
    private readonly extracurricularsService: ExtracurricularsService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin menambahkan daftar ekstrakurikuler baru' })
  create(@Body() dto: CreateExtracurricularDto) {
    return this.extracurricularsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lihat semua daftar ekstrakurikuler' })
  findAll() {
    return this.extracurricularsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lihat detail satu ekstrakurikuler' })
  findOne(@Param('id') id: string) {
    return this.extracurricularsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin mengupdate data ekstrakurikuler' })
  update(@Param('id') id: string, @Body() dto: UpdateExtracurricularDto) {
    return this.extracurricularsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin menghapus ekstrakurikuler' })
  remove(@Param('id') id: string) {
    return this.extracurricularsService.remove(id);
  }
}
