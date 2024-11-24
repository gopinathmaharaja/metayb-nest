import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bike, BikeDocument } from './schema/bike.schema';
import { CreateBikeDto } from './dto/bike.dto';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class BikeService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Bike.name) private readonly bikeModel: Model<BikeDocument>,
  ) {}

  async onModuleInit() {
    const bikes = [
      { brand: 'BrandA', model: 'ModelA', price: 10000, assemblyTime: 50 },
      { brand: 'BrandB', model: 'ModelB', price: 8000, assemblyTime: 60 },
      { brand: 'BrandC', model: 'ModelC', price: 11000, assemblyTime: 80 },
    ];

    for (const bikeData of bikes) {
      let bike = await this.bikeModel.findOne(bikeData);
      if (!bike) {
        bike = new this.bikeModel(bikeData);
        await bike.save();
        this.logger.info(`Bike created ${bike.brand}`);
      }
    }
  }

  async create(createBikeDto: CreateBikeDto): Promise<Bike> {
    const createdBike = new this.bikeModel(createBikeDto);
    return createdBike.save();
  }

  async update(
    id: string,
    updateBikeDto: Partial<CreateBikeDto>,
  ): Promise<Bike> {
    const existingBike = await this.bikeModel.findByIdAndUpdate(
      id,
      updateBikeDto,
      { new: true },
    );
    if (!existingBike) {
      throw new NotFoundException(`Bike with ID ${id} not found`);
    }
    return existingBike;
  }

  async findAll(): Promise<Bike[]> {
    this.logger.info(`Bike Search`);
    return this.bikeModel.find().exec();
  }

  async findById(id: string): Promise<Bike> {
    const bike = await this.bikeModel.findById(id).exec();
    if (!bike) {
      throw new NotFoundException(`Bike with ID ${id} not found`);
    }
    return bike;
  }
}
