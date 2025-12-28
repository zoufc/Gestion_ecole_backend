import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import logger from 'src/utils/logger';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { CreateParentAccountDto } from './dto/create-parent-account.dto';
import { Parent } from './interfaces/parent.interface';
import { Student } from '../student/interfaces/student.interface';
import { User } from '../user/interfaces/user.interface';
import { Role } from 'src/utils/enums/roles.enum';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel('Parent') private parentModel: Model<Parent>,
    @InjectModel('Student') private studentModel: Model<Student>,
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async create(createParentDto: CreateParentDto) {
    try {
      logger.info('---PARENT.SERVICE.CREATE INIT---');
      const parent = await this.parentModel.create(createParentDto);
      logger.info('---PARENT.SERVICE.CREATE SUCCESS---');
      return parent;
    } catch (error) {
      logger.error(`---PARENT.SERVICE.CREATE ERROR--- ${error.message}`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      // Use aggregation to count students for each parent
      const pipeline = [
        {
          $lookup: {
            from: 'students',
            localField: '_id',
            foreignField: 'parent',
            as: 'students',
          },
        },
        {
          $addFields: {
            studentsCount: { $size: '$students' },
          },
        },
        {
          $project: {
            students: 0, // Remove students array, keep only count
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            userId: {
              $cond: {
                if: { $ne: ['$user', null] },
                then: '$user',
                else: '$userId',
              },
            },
          },
        },
        {
          $project: {
            user: 0,
          },
        },
        { $skip: skip },
        { $limit: limit },
      ];

      const [data, totalResult] = await Promise.all([
        this.parentModel.aggregate(pipeline).exec(),
        this.parentModel.countDocuments(),
      ]);

      return {
        data,
        meta: {
          page,
          limit,
          total: totalResult,
          totalPages: Math.ceil(totalResult / limit),
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const pipeline = [
        { $match: { _id: new Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'students',
            localField: '_id',
            foreignField: 'parent',
            as: 'students',
          },
        },
        {
          $addFields: {
            studentsCount: { $size: '$students' },
          },
        },
        {
          $project: {
            students: 0,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            userId: {
              $cond: {
                if: { $ne: ['$user', null] },
                then: '$user',
                else: '$userId',
              },
            },
          },
        },
        {
          $project: {
            user: 0,
          },
        },
      ];

      const parents = await this.parentModel.aggregate(pipeline).exec();
      const parent = parents[0];

      if (!parent) {
        throw new HttpException('Parent not found', HttpStatus.NOT_FOUND);
      }

      return parent;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateParentDto: UpdateParentDto) {
    try {
      logger.info('---PARENT.SERVICE.UPDATE INIT---');
      const parent = await this.parentModel.findById(id);
      if (!parent) {
        throw new HttpException('Parent not found', HttpStatus.NOT_FOUND);
      }

      // Handle platformAccess update
      if (updateParentDto.platformAccess !== undefined) {
        if (updateParentDto.platformAccess) {
          // Grant access: create or activate user
          if (parent.userId) {
            // User exists, activate it
            await this.userModel.findByIdAndUpdate(parent.userId, {
              active: true,
              updated_at: new Date(),
            });
            logger.info('---PARENT.SERVICE.USER_ACTIVATED---');
          } else {
            // User doesn't exist, create it
            // Check if user with same email or phoneNumber already exists
            const searchCriteria: any[] = [{ phoneNumber: parent.phoneNumber }];
            if (parent.email) {
              searchCriteria.push({ email: parent.email });
            }
            const existingUser = await this.userModel.findOne({
              $or: searchCriteria,
            });

            if (existingUser) {
              // Link existing user to parent
              await this.parentModel.findByIdAndUpdate(id, {
                userId: existingUser._id,
                updated_at: new Date(),
              });
              await this.userModel.findByIdAndUpdate(existingUser._id, {
                active: true,
                updated_at: new Date(),
              });
              logger.info('---PARENT.SERVICE.USER_LINKED_AND_ACTIVATED---');
            } else {
              // Create new user
              // Email is optional, use parent email if available
              const userData: any = {
                firstname: parent.firstName,
                lastname: parent.lastName,
                phoneNumber: parent.phoneNumber,
                password: parent.phoneNumber, // Default password, user should change it
                role: Role.Parent,
                active: true,
              };

              // Add email only if parent has one
              if (parent.email) {
                userData.email = parent.email;
              }

              try {
                // Use phoneNumber as default password (will be hashed by pre-save hook)
                const newUser = await this.userModel.create(userData);

                // Link user to parent
                await this.parentModel.findByIdAndUpdate(id, {
                  userId: newUser._id,
                  updated_at: new Date(),
                });
                logger.info('---PARENT.SERVICE.USER_CREATED_AND_LINKED---');
              } catch (userError) {
                // If email or phoneNumber already exists, try to find and link existing user
                if (userError.code === 11000) {
                  const searchCriteria: any[] = [
                    { phoneNumber: parent.phoneNumber },
                  ];
                  if (parent.email) {
                    searchCriteria.push({ email: parent.email });
                  }
                  const existingUser = await this.userModel.findOne({
                    $or: searchCriteria,
                  });
                  if (existingUser) {
                    await this.parentModel.findByIdAndUpdate(id, {
                      userId: existingUser._id,
                      updated_at: new Date(),
                    });
                    await this.userModel.findByIdAndUpdate(existingUser._id, {
                      active: true,
                      updated_at: new Date(),
                    });
                    logger.info('---PARENT.SERVICE.USER_LINKED_AND_ACTIVATED_FROM_CREATE---');
                  } else {
                    throw userError;
                  }
                } else {
                  throw userError;
                }
              }
            }
          }
        } else {
          // Revoke access: deactivate user
          if (parent.userId) {
            await this.userModel.findByIdAndUpdate(parent.userId, {
              active: false,
              updated_at: new Date(),
            });
            logger.info('---PARENT.SERVICE.USER_DEACTIVATED---');
          }
        }
      }

      // Update parent fields including platformAccess
      const updatedParent = await this.parentModel.findByIdAndUpdate(
        id,
        { ...updateParentDto, updated_at: new Date() },
        { new: true },
      );

      logger.info('---PARENT.SERVICE.UPDATE SUCCESS---');
      return updatedParent;
    } catch (error) {
      logger.error(`---PARENT.SERVICE.UPDATE ERROR--- ${error.message}`);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const parent = await this.parentModel.findByIdAndDelete(id);
      if (!parent) {
        throw new HttpException('Parent not found', HttpStatus.NOT_FOUND);
      }
      return parent;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createAccount(id: string, createAccountDto: CreateParentAccountDto) {
    try {
      logger.info('---PARENT.SERVICE.CREATE_ACCOUNT INIT---');
      const parent = await this.parentModel.findById(id);
      if (!parent) {
        throw new HttpException('Parent not found', HttpStatus.NOT_FOUND);
      }

      // If parent already has a userId, just activate platformAccess
      if (parent.userId) {
        await this.userModel.findByIdAndUpdate(parent.userId, {
          active: true,
          updated_at: new Date(),
        });
        await this.parentModel.findByIdAndUpdate(id, {
          platformAccess: true,
          updated_at: new Date(),
        });
        const updatedParent = await this.parentModel.findById(id);
        logger.info('---PARENT.SERVICE.PLATFORM_ACCESS_ACTIVATED---');
        return updatedParent;
      }

      // Validate that at least one field is provided
      if (!createAccountDto.email && !createAccountDto.phoneNumber) {
        throw new HttpException(
          'Email or phone number is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Use provided email or phoneNumber, or fallback to parent's data
      const userEmail = createAccountDto.email || parent.email;
      const userPhoneNumber = createAccountDto.phoneNumber || parent.phoneNumber;

      // Check if user with same email or phoneNumber already exists
      const searchCriteria: any[] = [{ phoneNumber: userPhoneNumber }];
      if (userEmail) {
        searchCriteria.push({ email: userEmail });
      }
      const existingUser = await this.userModel.findOne({
        $or: searchCriteria,
      });

      if (existingUser) {
        // User already exists: just activate it and link to parent
        await this.userModel.findByIdAndUpdate(existingUser._id, {
          active: true,
          updated_at: new Date(),
        });
        
        // Link existing user to parent and enable platform access
        await this.parentModel.findByIdAndUpdate(id, {
          userId: existingUser._id,
          platformAccess: true,
          updated_at: new Date(),
        });
        logger.info('---PARENT.SERVICE.USER_LINKED_AND_ACTIVATED---');
      } else {
        // Create new user only if it doesn't exist
        const userData: any = {
          firstname: parent.firstName,
          lastname: parent.lastName,
          phoneNumber: userPhoneNumber,
          password: userPhoneNumber, // Default password, user should change it
          role: Role.Parent,
          active: true,
        };

        // Add email only if available
        if (userEmail) {
          userData.email = userEmail;
        }

        const newUser = await this.userModel.create(userData);

        // Link user to parent and enable platform access
        await this.parentModel.findByIdAndUpdate(id, {
          userId: newUser._id,
          platformAccess: true,
          updated_at: new Date(),
        });
        logger.info('---PARENT.SERVICE.USER_CREATED_AND_LINKED---');
      }

      // Return updated parent
      const updatedParent = await this.parentModel.findById(id);
      logger.info('---PARENT.SERVICE.CREATE_ACCOUNT SUCCESS---');
      return updatedParent;
    } catch (error) {
      logger.error(
        `---PARENT.SERVICE.CREATE_ACCOUNT ERROR--- ${error.message}`,
      );
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}

