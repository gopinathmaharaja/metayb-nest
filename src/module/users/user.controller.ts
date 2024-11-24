import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  NotFoundException,
  Version,
  UseGuards,
} from '@nestjs/common';
import { Payload, UserService } from './user.service';
import { LoginUserDto, CreateUserDto } from './dto/user.dto';
import { User } from './schema/user.schema';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { RoleGuard } from '../../common/role.guard';
import { Roles } from '../../common/roles.decorator';
import { Role } from '../../common/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @Version('1')
  async loginV1(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ token: string, user: Payload }> {
    return this.userService.login(loginUserDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Post()
  @Version('1')
  async createV1(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
  
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin, Role.User)
  @Get(':id')
  @Version('1')
  async findByIdV1(@Param('id') id: string): Promise<User> {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Put(':id')
  @Version('1')
  async updateV1(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }
}
