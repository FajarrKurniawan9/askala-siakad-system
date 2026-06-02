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
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

@ApiTags('Bills')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a payment bill (tagihan)',
    description:
      'Creates a new payment bill that can be assigned to students via the Submissions endpoint. ' +
      'The `amount` must be a positive integer in IDR (Indonesian Rupiah). ' +
      'Optionally, link the bill to a school organization (e.g. OSIS monthly dues) by providing `orgId`. ' +
      'When a linked submission is verified, a treasury income record is automatically created for that organization. ' +
      'Returns 404 if the provided `orgId` does not reference an existing organization.',
  })
  @ApiCreatedResponse({ description: 'Payment bill created successfully.' })
  @ApiNotFoundResponse({
    description: 'The referenced organization (orgId) does not exist.',
  })
  create(@Body() dto: CreateBillDto) {
    return this.billsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all payment bills',
    description:
      'Returns all payment bills ordered by creation date (newest first). ' +
      'If a bill is linked to a school organization, the full organization details are included in the response.',
  })
  @ApiOkResponse({
    description: 'List of all payment bills returned successfully.',
  })
  findAll() {
    return this.billsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a single payment bill',
    description:
      'Fetches one payment bill by its UUID, including any linked organization details.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the payment bill to retrieve.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Payment bill found and returned.' })
  @ApiNotFoundResponse({
    description: 'No payment bill with the given UUID exists.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.billsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a payment bill',
    description:
      'Partially updates a payment bill. All fields are optional. ' +
      'If `orgId` is changed to a new value, that organization must exist — a 404 is returned otherwise. ' +
      'Important: updating a bill does not retroactively affect student submissions that have already been verified.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the payment bill to update.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Payment bill updated successfully.' })
  @ApiNotFoundResponse({
    description:
      'Payment bill not found, or the new orgId does not reference an existing organization.',
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBillDto) {
    return this.billsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a payment bill',
    description:
      'Permanently deletes a payment bill. This action is irreversible. ' +
      'Warning: deletion will fail if student payment submissions are still linked to this bill. ' +
      'Remove all associated submissions first before deleting the bill.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the payment bill to delete.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Payment bill deleted successfully.' })
  @ApiNotFoundResponse({
    description: 'No payment bill with the given UUID exists.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.billsService.remove(id);
  }
}
