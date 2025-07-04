import { Will, connectToMongoDB, type IWill } from '@/lib/models';
import { generateId } from '@/utils';

export class WillService {
  static async createWill(userId: string, initialData?: {
    stateCompliance?: string;
  }): Promise<IWill> {
    await connectToMongoDB();

    const will = new Will({
      userId,
      stateCompliance: initialData?.stateCompliance || 'CA',
      status: 'draft',
      sections: {
        children: [],
        executors: [],
        guardians: [],
        realProperty: [],
        personalProperty: [],
        specificGifts: [],
        pets: [],
        arrangements: [],
        digitalExecutors: []
      },
      documents: {},
      photos: [],
      chatHistory: [],
      progress: {
        completedSections: [],
        currentSection: 'personal-info',
        percentComplete: 0
      },
      version: 1
    });

    await will.save();
    return will;
  }

  static async getWillById(willId: string, userId?: string): Promise<IWill | null> {
    await connectToMongoDB();
    
    const filter: any = { _id: willId };
    if (userId) {
      filter.userId = userId;
    }
    
    return await Will.findOne(filter).populate('userId', 'profile email');
  }

  static async getWillsByUserId(userId: string): Promise<IWill[]> {
    await connectToMongoDB();
    
    return await Will.find({ userId })
      .sort({ updatedAt: -1 })
      .populate('userId', 'profile email');
  }

  static async updateWill(willId: string, updateData: Partial<IWill>, userId?: string): Promise<IWill | null> {
    await connectToMongoDB();
    
    const filter: any = { _id: willId };
    if (userId) {
      filter.userId = userId;
    }
    
    return await Will.findOneAndUpdate(
      filter,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  static async updateWillSection(
    willId: string, 
    section: string, 
    sectionData: any, 
    userId?: string
  ): Promise<IWill | null> {
    await connectToMongoDB();
    
    const filter: any = { _id: willId };
    if (userId) {
      filter.userId = userId;
    }
    
    const updatePath = `sections.${section}`;
    
    return await Will.findOneAndUpdate(
      filter,
      { 
        $set: { 
          [updatePath]: sectionData,
          'progress.currentSection': section 
        } 
      },
      { new: true, runValidators: true }
    );
  }

  static async addPerson(
    willId: string, 
    personType: 'executors' | 'guardians', 
    personData: any, 
    userId?: string
  ): Promise<IWill | null> {
    await connectToMongoDB();
    
    const filter: any = { _id: willId };
    if (userId) {
      filter.userId = userId;
    }
    
    const person = {
      id: generateId(),
      ...personData
    };
    
    return await Will.findOneAndUpdate(
      filter,
      { $push: { [`sections.${personType}`]: person } },
      { new: true, runValidators: true }
    );
  }

  static async updatePerson(
    willId: string, 
    personType: 'executors' | 'guardians', 
    personId: string, 
    personData: any, 
    userId?: string
  ): Promise<IWill | null> {
    await connectToMongoDB();
    
    const filter: any = { 
      _id: willId,
      [`sections.${personType}.id`]: personId
    };
    if (userId) {
      filter.userId = userId;
    }
    
    const updateFields: any = {};
    Object.keys(personData).forEach(key => {
      updateFields[`sections.${personType}.$.${key}`] = personData[key];
    });
    
    return await Will.findOneAndUpdate(
      filter,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
  }

  static async removePerson(
    willId: string, 
    personType: 'executors' | 'guardians', 
    personId: string, 
    userId?: string
  ): Promise<IWill | null> {
    await connectToMongoDB();
    
    const filter: any = { _id: willId };
    if (userId) {
      filter.userId = userId;
    }
    
    return await Will.findOneAndUpdate(
      filter,
      { $pull: { [`sections.${personType}`]: { id: personId } } },
      { new: true, runValidators: true }
    );
  }

  static async addAsset(
    willId: string, 
    assetType: 'realProperty' | 'personalProperty', 
    assetData: any, 
    userId?: string
  ): Promise<IWill | null> {
    await connectToMongoDB();
    
    const filter: any = { _id: willId };
    if (userId) {
      filter.userId = userId;
    }
    
    const asset = {
      id: generateId(),
      ...assetData
    };
    
    return await Will.findOneAndUpdate(
      filter,
      { $push: { [`sections.${assetType}`]: asset } },
      { new: true, runValidators: true }
    );
  }

  static async addChatMessage(
    willId: string, 
    message: {
      role: 'user' | 'assistant';
      content: string;
    }, 
    userId?: string
  ): Promise<IWill | null> {
    await connectToMongoDB();
    
    const filter: any = { _id: willId };
    if (userId) {
      filter.userId = userId;
    }
    
    const chatMessage = {
      id: generateId(),
      ...message,
      timestamp: new Date()
    };
    
    return await Will.findOneAndUpdate(
      filter,
      { $push: { chatHistory: chatMessage } },
      { new: true, runValidators: true }
    );
  }

  static async addPhoto(
    willId: string, 
    photoData: {
      url: string;
      caption?: string;
      associatedItems?: string[];
    }, 
    userId?: string
  ): Promise<IWill | null> {
    await connectToMongoDB();
    
    const filter: any = { _id: willId };
    if (userId) {
      filter.userId = userId;
    }
    
    const photo = {
      id: generateId(),
      ...photoData,
      uploadedAt: new Date()
    };
    
    return await Will.findOneAndUpdate(
      filter,
      { $push: { photos: photo } },
      { new: true, runValidators: true }
    );
  }

  static async executeWill(
    willId: string, 
    witnessInfo: {
      witness1: any;
      witness2: any;
      notary?: any;
      executionDate: Date;
      executionLocation: string;
    }, 
    userId?: string
  ): Promise<IWill | null> {
    await connectToMongoDB();
    
    const filter: any = { _id: willId };
    if (userId) {
      filter.userId = userId;
    }
    
    // Check if will can be executed
    const will = await Will.findOne(filter);
    if (!will || !will.canBeExecuted()) {
      throw new Error('Will cannot be executed. Please ensure it is completed.');
    }
    
    return await Will.findOneAndUpdate(
      filter,
      { 
        $set: { 
          status: 'executed',
          executedAt: new Date(),
          witnessInfo
        } 
      },
      { new: true, runValidators: true }
    );
  }

  static async deleteWill(willId: string, userId?: string): Promise<boolean> {
    await connectToMongoDB();
    
    const filter: any = { _id: willId };
    if (userId) {
      filter.userId = userId;
    }
    
    const result = await Will.findOneAndDelete(filter);
    return !!result;
  }

  static async getWillStatistics(): Promise<{
    totalWills: number;
    draftWills: number;
    completedWills: number;
    executedWills: number;
    averageCompletionTime: number;
  }> {
    await connectToMongoDB();
    
    const [
      totalWills,
      draftWills,
      completedWills,
      executedWills
    ] = await Promise.all([
      Will.countDocuments(),
      Will.countDocuments({ status: 'draft' }),
      Will.countDocuments({ status: 'completed' }),
      Will.countDocuments({ status: 'executed' })
    ]);

    // Calculate average completion time (from creation to completion)
    const completedWillsWithTimes = await Will.find({
      status: { $in: ['completed', 'executed'] }
    }).select('createdAt updatedAt');

    let totalCompletionTime = 0;
    completedWillsWithTimes.forEach(will => {
      const timeDiff = will.updatedAt.getTime() - will.createdAt.getTime();
      totalCompletionTime += timeDiff;
    });

    const averageCompletionTime = completedWillsWithTimes.length > 0 
      ? totalCompletionTime / completedWillsWithTimes.length 
      : 0;

    return {
      totalWills,
      draftWills,
      completedWills,
      executedWills,
      averageCompletionTime: Math.round(averageCompletionTime / (1000 * 60 * 60 * 24)) // days
    };
  }

  static async searchWills(query: {
    userId?: string;
    status?: 'draft' | 'completed' | 'executed';
    stateCompliance?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    wills: IWill[];
    total: number;
    page: number;
    pages: number;
  }> {
    await connectToMongoDB();
    
    const { 
      userId, 
      status, 
      stateCompliance, 
      page = 1, 
      limit = 20 
    } = query;

    const filter: any = {};
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (stateCompliance) {
      filter.stateCompliance = stateCompliance;
    }

    const skip = (page - 1) * limit;
    
    const [wills, total] = await Promise.all([
      Will.find(filter)
        .populate('userId', 'profile email')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      Will.countDocuments(filter)
    ]);

    return {
      wills,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}