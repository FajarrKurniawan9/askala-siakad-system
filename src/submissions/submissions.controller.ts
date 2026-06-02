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
  ApiBadRequestResponse,
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
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { SubmissionsService } from './submissions.service';

@ApiTags('Submissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({
    summary: 'Create a payment submission',
    description:
      'Creates a new payment submission that records a student uploading proof of payment for a specific bill. ' +
      'Both `billId` and `studentId` must reference existing records. ' +
      'A student can only have one submission per bill — a 409 is returned on duplicates. ' +
      'The `fileUrl` field should contain the public URL of the uploaded proof-of-payment file, ' +
      'obtained from the `/upload` endpoint. ' +
      'New submissions start with `status: PENDING` by default.',
  })
  @ApiCreatedResponse({
    description: 'Payment submission created successfully.',
  })
  @ApiConflictResponse({
    description:
      'A submission for this billId and studentId combination already exists.',
  })
  @ApiNotFoundResponse({
    description: 'The referenced bill or student does not exist.',
  })
  create(@Body() dto: CreateSubmissionDto) {
    return this.submissionsService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'List all payment submissions',
    description:
      'Returns all payment submissions ordered by creation date (newest first). ' +
      'Each submission includes the full bill details and the student profile with linked user details.',
  })
  @ApiOkResponse({
    description: 'List of all payment submissions returned successfully.',
  })
  findAll() {
    return this.submissionsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'Get a single payment submission',
    description:
      'Fetches one payment submission by its UUID, including bill and student details.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the payment submission to retrieve.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Payment submission found and returned.' })
  @ApiNotFoundResponse({
    description: 'No payment submission with the given UUID exists.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.submissionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update or verify a payment submission',
    description:
      'Partially updates a payment submission. This endpoint handles two distinct flows:\n\n' +
      '**Standard update** (`status` is `PENDING` or `REJECTED`): ' +
      'Update `fileUrl`, `note`, or `status` freely with no extra requirements.\n\n' +
      '**Verification flow** (`status: "VERIFIED"`): ' +
      'Marks the submission as officially verified. ' +
      "The `verifiedBy` field is **required** and must contain the verifying admin's numeric User ID as a string. " +
      'This triggers an atomic database transaction that: ' +
      '(1) sets `status` to `VERIFIED` and records `verifiedAt`, ' +
      '(2) automatically creates an incoming treasury record for the linked organization if the bill has an `orgId`, ' +
      "and (3) appends a verification activity log entry to the student's timeline.",
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the payment submission to update.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Payment submission updated (or verified) successfully.',
  })
  @ApiNotFoundResponse({
    description:
      'No payment submission with the given UUID exists, or its associated bill was not found.',
  })
  @ApiBadRequestResponse({
    description:
      '`verifiedBy` is missing or not a valid numeric ID when `status` is `"VERIFIED"`.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSubmissionDto,
  ) {
    return this.submissionsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete a payment submission',
    description:
      'Permanently deletes a payment submission. This action is irreversible. ' +
      'Deleting a verified submission does NOT reverse the treasury transaction or activity log ' +
      'that were created during verification.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the payment submission to delete.',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ description: 'Payment submission deleted successfully.' })
  @ApiNotFoundResponse({
    description: 'No payment submission with the given UUID exists.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.submissionsService.remove(id);
  }
}
