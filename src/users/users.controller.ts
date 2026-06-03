import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new user account (Admin Only)',
    description:
      'Registers a new user account in the system. The password is automatically ' +
      'hashed before storage — never send or store plain-text passwords. ' +
      'The `email` must be unique across all accounts. ' +
      'Role defaults to `STUDENT` if not provided. Only accessible by ADMIN.',
  })
  @ApiCreatedResponse({ description: 'User account created successfully.' })
  @ApiConflictResponse({
    description: 'An account with this email address already exists.',
  })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'List all user accounts (Admin, Student, or Parent Only)',
    description:
      'Returns all registered user accounts. ' +
      'The `password` field is always excluded from the response for security. ' +
      'Only accessible by ADMIN.',
  })
  @ApiOkResponse({
    description: 'List of all user accounts returned successfully.',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
  @ApiOperation({
    summary: 'Get a single user account (Admin, Student, or Parent Only)',
    description:
      'Fetches one user account by its numeric integer ID (auto-incremented, not a UUID). ' +
      'Returns 404 if no user with the given ID exists. ' +
      'Accessible by ADMIN, STUDENT, and PARENT roles.',
  })
  @ApiParam({
    name: 'id',
    description: 'The numeric integer ID of the user (e.g. 1, 2, 42).',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({ description: 'User account found and returned.' })
  @ApiNotFoundResponse({ description: 'No user with the given ID exists.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({
    summary: 'Update a user account (Admin or Student Only)',
    description:
      'Partially updates a user account. All fields in the request body are optional — ' +
      'only the fields you provide will be changed. ' +
      'If a new `password` is supplied, it will be automatically re-hashed. ' +
      'If a new `email` is supplied, it must not conflict with another existing account.',
  })
  @ApiParam({
    name: 'id',
    description: 'The numeric integer ID of the user to update.',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({ description: 'User account updated successfully.' })
  @ApiNotFoundResponse({ description: 'No user with the given ID exists.' })
  @ApiConflictResponse({
    description:
      'The provided email address is already in use by another account.',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete a user account (Admin Only)',
    description:
      'Permanently deletes a user account. This action is irreversible. ' +
      'Due to `ON DELETE CASCADE` in the database schema, any linked `Student`, `Parent`, ' +
      'or `AdminProfile` records belonging to this user will also be automatically deleted.',
  })
  @ApiParam({
    name: 'id',
    description: 'The numeric integer ID of the user to delete.',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({ description: 'User account deleted successfully.' })
  @ApiNotFoundResponse({ description: 'No user with the given ID exists.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
