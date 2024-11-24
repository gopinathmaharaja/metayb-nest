import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { PinoLogger } from 'nestjs-pino';
import { JwtService } from '@nestjs/jwt';

export interface Payload {
  username: string;
  userId: any;
  role: string;
}

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: PinoLogger,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    const users = [
      { username: 'admin', password: 'password', role: 'admin', firstName: 'Admin', lastName: 'User', email: 'admin@example.com' },
      { username: 'user1', password: 'password', role: 'user', firstName: 'User', lastName: 'One', email: 'user1@example.com' },
      { username: 'user2', password: 'password', role: 'user', firstName: 'User', lastName: 'Two', email: 'user2@example.com' },
      { username: 'user3', password: 'password', role: 'user', firstName: 'User', lastName: 'Three', email: 'user3@example.com' },
      { username: 'user4', password: 'password', role: 'user', firstName: 'User', lastName: 'Four', email: 'user4@example.com' },
      { username: 'user5', password: 'password', role: 'user', firstName: 'User', lastName: 'Five', email: 'user5@example.com' },
    ];

    for (const userData of users) {
      let user = await this.userModel.findOne({ username: userData.username });
      if (!user) {
        user = new this.userModel(userData);
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(userData.password, salt);
        await user.save();
        this.logger.info(
          `User with username ${userData.username} created with ${userData.role} role`,
        );
      }
    }
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ token: string, user: Payload }> {
    const { username, password } = loginUserDto;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }
    const payload: Payload = {
      username: user.username,
      userId: user._id,
      role: user.role,
    };
    const token = this.generateJwtToken(payload);
    return { token, user: payload };
  }

  private generateJwtToken(payload: Payload): string {
    return this.jwtService.sign(payload);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    const salt = await bcrypt.genSalt();
    createdUser.password = await bcrypt.hash(createUserDto.password, salt);
    return createdUser.save();
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const existingUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return existingUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
