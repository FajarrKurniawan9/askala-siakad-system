// src/parents/parents.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { ParentsService } from './parents.service';

@ApiTags('Parents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  // ── POST /parents ──────────────────────────────────────────────────────────

  @Post()
  @ApiOperation({
    summary: 'Create a Parent profile',
    description:
      'Links an existing User account (role = PARENT) to a new Parent profile record.',
  })
  @ApiCreatedResponse({ description: 'Parent profile created successfully.' })
  create(@Body() createParentDto: CreateParentDto) {
    return this.parentsService.create(createParentDto);
  }

  // ── GET /parents ───────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({
    summary: 'List all Parent profiles',
    description:
      'Returns every Parent profile including their linked User details and associated Student children.',
  })
  @ApiOkResponse({ description: 'List of all Parent profiles.' })
  findAll() {
    return this.parentsService.findAll();
  }

  // ── GET /parents/:id ───────────────────────────────────────────────────────

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single Parent profile',
    description:
      'Fetches one Parent by UUID, including User details and their Student children.',
  })
  @ApiOkResponse({ description: 'Parent profile found.' })
  @ApiNotFoundResponse({ description: 'Parent not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.parentsService.findOne(id);
  }

  // ── PATCH /parents/:id ─────────────────────────────────────────────────────

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a Parent profile',
    description: 'Partially updates a Parent profile (e.g. reassigns userId).',
  })
  @ApiOkResponse({ description: 'Parent profile updated.' })
  @ApiNotFoundResponse({ description: 'Parent not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateParentDto: UpdateParentDto,
  ) {
    return this.parentsService.update(id, updateParentDto);
  }

  // ── DELETE /parents/:id ────────────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a Parent profile',
    description:
      'Removes the Parent profile record. The linked User account is not affected.',
  })
  @ApiOkResponse({ description: 'Parent profile deleted.' })
  @ApiNotFoundResponse({ description: 'Parent not found.' })
  @ApiNoContentResponse({ description: 'No content.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.parentsService.remove(id);
  }
}
