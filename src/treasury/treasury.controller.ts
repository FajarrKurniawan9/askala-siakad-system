import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { TreasuryService } from './treasury.service';
import { CreateTreasuryDto } from './dto/create-treasury.dto';
import { UpdateTreasuryDto } from './dto/update-treasury.dto';

@ApiTags('Treasury')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('treasury')
export class TreasuryController {
  constructor(private readonly treasuryService: TreasuryService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a treasury transaction (Admin Only)',
    description:
      'Records a new income (IN) or expense (OUT) transaction for a school organization. ' +
      'The `orgId` must reference an existing organization — a 404 is returned otherwise. ' +
      'Note: income records are also created automatically when payment submissions are verified.',
  })
  @ApiCreatedResponse({
    description: 'Treasury transaction created successfully.',
  })
  @ApiNotFoundResponse({
    description: 'The referenced organization (orgId) does not exist.',
  })
  create(@Body() dto: CreateTreasuryDto) {
    return this.treasuryService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'List all treasury transactions (Admin, Student, or Parent Only)',
    description:
      'Returns all treasury transactions, ordered by date (newest first). ' +
      'Optionally filter by `orgId` to return only transactions for a specific organization. ' +
      'Each transaction includes the related school organization details.',
  })
  @ApiQuery({
    name: 'orgId',
    required: false,
    description: 'Filter transactions by organization UUID.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'List of treasury transactions returned successfully.',
  })
  findAll(@Query('orgId') orgId?: string) {
    return this.treasuryService.findAll(orgId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary:
      'Get a single treasury transaction (Admin, Student, or Parent Only)',
    description:
      'Fetches one treasury transaction by its UUID. ' +
      'Returns 404 if no transaction with the given ID exists.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the treasury transaction to retrieve.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Treasury transaction found and returned.' })
  @ApiNotFoundResponse({
    description: 'No treasury transaction with the given UUID exists.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.treasuryService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update a treasury transaction (Admin Only)',
    description:
      'Partially updates a treasury transaction. All fields are optional. ' +
      'If `orgId` is changed, the new organization must exist.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the treasury transaction to update.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Treasury transaction updated successfully.' })
  @ApiNotFoundResponse({
    description:
      'Transaction not found, or the new orgId does not reference an existing organization.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTreasuryDto,
  ) {
    return this.treasuryService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete a treasury transaction (Admin Only)',
    description:
      'Permanently deletes a treasury transaction. This action is irreversible.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the treasury transaction to delete.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Treasury transaction deleted successfully.' })
  @ApiNotFoundResponse({
    description: 'No treasury transaction with the given UUID exists.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.treasuryService.remove(id);
  }
}
