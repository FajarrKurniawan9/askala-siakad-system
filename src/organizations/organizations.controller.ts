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
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a school organization (Admin Only)',
    description:
      'Creates a new school organization record (e.g. OSIS, Paskibra, KIR, Rohis). ' +
      'Organization `name` must be unique system-wide — a 409 is returned on duplicates. ' +
      'New organizations are active (`isActive: true`) by default.',
  })
  @ApiCreatedResponse({
    description: 'School organization created successfully.',
  })
  @ApiConflictResponse({
    description: 'A school organization with this name already exists.',
  })
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'List all school organizations (Admin, Student, or Parent Only)',
    description:
      'Returns all school organizations ordered by creation date (newest first). ' +
      'Includes both active and inactive organizations. ' +
      'Use the `isActive` field in the response to filter on the client side if needed.',
  })
  @ApiOkResponse({
    description: 'List of all school organizations returned successfully.',
  })
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary:
      'Get a single school organization (Admin, Student, or Parent Only)',
    description: 'Fetches one school organization by its UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the school organization to retrieve.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'School organization found and returned.' })
  @ApiNotFoundResponse({
    description: 'No school organization with the given UUID exists.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update a school organization (Admin Only)',
    description:
      'Partially updates a school organization. All fields are optional. ' +
      'To temporarily deactivate an organization without deleting it, set `isActive: false`. ' +
      'If `name` is changed, it must remain unique — a 409 is returned on duplicates.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the school organization to update.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'School organization updated successfully.' })
  @ApiNotFoundResponse({
    description: 'No school organization with the given UUID exists.',
  })
  @ApiConflictResponse({
    description:
      'Another school organization with the new name already exists.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete a school organization (Admin Only)',
    description:
      'Permanently deletes a school organization. This action is irreversible. ' +
      'Warning: deletion will fail if student membership records, treasury transactions, ' +
      'or payment bills are still linked to this organization. ' +
      'Remove or reassign all related records before deleting.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the school organization to delete.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'School organization deleted successfully.' })
  @ApiNotFoundResponse({
    description: 'No school organization with the given UUID exists.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.remove(id);
  }
}
