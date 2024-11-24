import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assembly, AssemblyDocument } from './schema/assembly.schema';
import { CreateAssemblyDto } from './dto/assembly.dto';
import { PinoLogger } from 'nestjs-pino';
import { AgendaService } from '../agenda/agenda.service';

@Injectable()
export class AssemblyService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectModel(Assembly.name)
    private readonly assemblyModel: Model<AssemblyDocument>,
    private readonly agendaService: AgendaService,
  ) {}

  async onModuleInit() {
    this.agendaService.defineJob('bike-assembly-complete', async (job) => {
      const data = job.attrs.data;
      this.logger.info(`Assembly with ID ${data.id} completed`);
      await this.update(data.id, { status: 'completed' });
    });
  }

  async create(createAssemblyDto: CreateAssemblyDto): Promise<Assembly> {
    const existingAssembly = await this.assemblyModel.findOne({
      userId: createAssemblyDto.userId,
      status: 'processing',
    });
    if (existingAssembly) {
      throw new ConflictException('Assembly in progress for the user');
    }
    const createdAssembly = new this.assemblyModel(createAssemblyDto);
    await createdAssembly.save();
    await this.agendaService.scheduleJob(
      'bike-assembly-complete',
      createdAssembly.endTime,
      { id: createdAssembly._id },
    );
    this.logger.info(`Assembly with ID ${createdAssembly._id} created`);
    return createdAssembly;
  }

  async update(
    id: string,
    updateAssemblyDto: Partial<CreateAssemblyDto>,
  ): Promise<Assembly> {
    const existingAssembly = await this.assemblyModel.findByIdAndUpdate(
      id,
      updateAssemblyDto,
      { new: true },
    );
    if (!existingAssembly) {
      throw new NotFoundException(`Assembly with ID ${id} not found`);
    }
    this.logger.info(`Assembly with ID ${id} updated`);
    return existingAssembly;
  }

  async findAll(searchQuery: {
    user: any;
    reqQuery: any;
  }): Promise<{ data: Assembly[]; count: number }> {
    let { user, reqQuery } = searchQuery;
    let { limit, page, ...query } = reqQuery;
    if (user.role === 'user' || user.role.includes('user')) {
      query.userId = user.userId;
    }
    if (query.date) {
      const startOfDay = new Date(query.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(query.date);
      endOfDay.setHours(23, 59, 59, 999);
      query.startTime = { $gte: startOfDay };
      query.endTime = { $lte: endOfDay };
      delete query.date;
    }
    limit = limit ?? 50;
    page = page ?? 1;
    const data = await this.assemblyModel
      .find(query)
      .skip(limit * (page - 1))
      .limit(limit)
      .sort({ _id: -1 })
      .populate('bikeId', 'brand')
      .populate('userId', 'username')
      .exec();
    const count = await this.assemblyModel.find(query).countDocuments();
    return { data, count };
  }
  async adminDashboard(query: any): Promise<any> {
    if (query.date) {
      const startOfDay = new Date(query.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(query.date);
      endOfDay.setHours(23, 59, 59, 999);
      query.startTime = { $gte: startOfDay };
      query.endTime = { $lte: endOfDay };
      delete query.date;
    }
    const statusGroup = await this.assemblyModel.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    query.status = 'completed';
    const bikeGroup = await this.assemblyModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'bikes',
          localField: 'bikeId',
          foreignField: '_id',
          as: 'bike',
        },
      },
      { $unwind: '$bike' },
      { $group: { _id: '$bike.brand', count: { $sum: 1 } } },
    ]);
    const userGroup = await this.assemblyModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $group: { _id: '$user.username', count: { $sum: 1 } } },
    ]);
    const userByBikeGroup = await this.assemblyModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'bikes',
          localField: 'bikeId',
          foreignField: '_id',
          as: 'bike',
        },
      },
      { $unwind: '$user' },
      { $unwind: '$bike' },
      {
        $group: {
          _id: { user: '$user.username', model: '$bike.brand' },
          totalValue: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.user',
          models: {
            $push: {
              model: '$_id.model',
              totalValue: '$totalValue',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          user: '$_id',
          models: 1,
        },
      },
    ]);
    const transformedData = userByBikeGroup.map((item) => {
      const transformed = { user: item.user };

      item.models.forEach((modelData) => {
        transformed[modelData.model] = modelData.totalValue;
      });

      return transformed;
    });

    const data = {
      statusGroup,
      bikeGroup,
      userGroup,
      userByBikeGroup: transformedData,
    };
    return data;
  }

  async findById(id: string): Promise<Assembly> {
    const assembly = await this.assemblyModel.findById(id).exec();
    if (!assembly) {
      throw new NotFoundException(`Assembly with ID ${id} not found`);
    }
    return assembly;
  }
}
