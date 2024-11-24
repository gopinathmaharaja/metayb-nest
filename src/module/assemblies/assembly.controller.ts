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
  Query,
} from '@nestjs/common';
import { AssemblyService } from './assembly.service';
import { CreateAssemblyDto } from './dto/assembly.dto';
import { Assembly } from './schema/assembly.schema';
import { User } from 'src/common/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth.guard';
import { RoleGuard } from '../../common/role.guard';
import { Roles } from '../../common/roles.decorator';
import { Role } from '../../common/role.enum';

@ApiBearerAuth('access-token')
@Controller('assemblies')
export class AssemblyController {
  constructor(private readonly assemblyService: AssemblyService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User)
  @Post()
  @Version('1')
  async createV1(
    @Body() createAssemblyDto: CreateAssemblyDto,
    @User() user: any,
  ): Promise<Assembly> {
    createAssemblyDto.userId = user.userId;
    createAssemblyDto.startTime = new Date();
    let endTime = new Date();
    endTime.setMinutes(new Date().getMinutes() + createAssemblyDto.duration);
    createAssemblyDto.endTime = endTime;
    return this.assemblyService.create(createAssemblyDto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User, Role.Admin)
  @Get(':id')
  @Version('1')
  async findByIdV1(@Param('id') id: string): Promise<Assembly> {
    const assembly = await this.assemblyService.findById(id);
    if (!assembly) {
      throw new NotFoundException(`Assembly with ID ${id} not found`);
    }
    return assembly;
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User)
  @Put(':id')
  @Version('1')
  async updateV1(
    @Param('id') id: string,
    @Body() updateAssemblyDto: Partial<CreateAssemblyDto>,
  ): Promise<Assembly> {
    return this.assemblyService.update(id, updateAssemblyDto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User, Role.Admin)
  @Get()
  @Version('1')
  async findAllV1(
    @Query() reqQuery: any,
    @User() user: any,
  ): Promise<{ data: Assembly[]; count: number }> {
    return this.assemblyService.findAll({ user, reqQuery });
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Get("/admin/dashboard")
  @Version('1')
  async adminDashboard(
    @Query() reqQuery: any,
  ): Promise<any> {
    return this.assemblyService.adminDashboard(reqQuery);
  }
}
