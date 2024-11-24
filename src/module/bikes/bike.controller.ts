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
import { BikeService } from './bike.service';
import { CreateBikeDto } from './dto/bike.dto';
import { Bike } from './schema/bike.schema';
import { AuthGuard } from '../../common/auth.guard';
import { RoleGuard } from '../../common/role.guard';
import { Roles } from '../../common/roles.decorator';
import { Role } from '../../common/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token') 
@Controller('bikes')
export class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Post()
  @Version('1')
  async createV1(@Body() createBikeDto: CreateBikeDto): Promise<Bike> {
    return this.bikeService.create(createBikeDto);
  }
  
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.User, Role.Admin)
  @Get(':id')
  @Version('1')
  async findByIdV1(@Param('id') id: string): Promise<Bike> {
    const bike = await this.bikeService.findById(id);
    if (!bike) {
      throw new NotFoundException(`Bike with ID ${id} not found`);
    }
    return bike;
  }
  
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @Put(':id')
  @Version('1')
  async updateV1(
    @Param('id') id: string,
    @Body() updateBikeDto: Partial<CreateBikeDto>,
  ): Promise<Bike> {
    return this.bikeService.update(id, updateBikeDto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Get()
  @Version('1')
  async findAllV1(): Promise<Bike[]> {
    return this.bikeService.findAll();
  }
}
