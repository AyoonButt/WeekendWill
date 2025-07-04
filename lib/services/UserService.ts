import { User, Will, connectToMongoDB, type IUser, type IWill } from '@/lib/models';
import bcrypt from 'bcryptjs';
import { generateId } from '@/utils';

export class UserService {
  static async createUser(userData: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    sponsorCode?: string;
  }): Promise<IUser> {
    await connectToMongoDB();

    const { email, password, firstName, lastName, sponsorCode } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      hashedPassword,
      sponsorCode,
      profile: {
        firstName,
        lastName,
      },
      subscription: {
        plan: 'essential',
        status: 'inactive',
      },
      role: 'user',
    });

    await user.save();
    return user;
  }

  static async getUserById(userId: string): Promise<IUser | null> {
    await connectToMongoDB();
    return await User.findById(userId).select('-hashedPassword');
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    await connectToMongoDB();
    return await User.findOne({ email: email.toLowerCase() });
  }

  static async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    await connectToMongoDB();
    return await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-hashedPassword');
  }

  static async updatePassword(userId: string, newPassword: string): Promise<boolean> {
    await connectToMongoDB();
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const result = await User.findByIdAndUpdate(
      userId,
      { $set: { hashedPassword } }
    );
    
    return !!result;
  }

  static async verifyPassword(userId: string, password: string): Promise<boolean> {
    await connectToMongoDB();
    
    const user = await User.findById(userId);
    if (!user || !user.hashedPassword) {
      return false;
    }
    
    return await bcrypt.compare(password, user.hashedPassword);
  }

  static async updateSubscription(
    userId: string, 
    subscriptionData: {
      plan?: 'essential' | 'unlimited';
      status?: 'active' | 'cancelled' | 'expired' | 'inactive';
      stripeCustomerId?: string;
      subscriptionId?: string;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
      cancelAtPeriodEnd?: boolean;
    }
  ): Promise<IUser | null> {
    await connectToMongoDB();
    
    return await User.findByIdAndUpdate(
      userId,
      { $set: { subscription: subscriptionData } },
      { new: true, runValidators: true }
    ).select('-hashedPassword');
  }

  static async deleteUser(userId: string): Promise<boolean> {
    await connectToMongoDB();
    
    // Delete user's wills first
    await Will.deleteMany({ userId });
    
    // Delete user
    const result = await User.findByIdAndDelete(userId);
    return !!result;
  }

  static async getUserStats(userId: string): Promise<{
    willsCount: number;
    completedWillsCount: number;
    executedWillsCount: number;
    subscriptionStatus: string;
    joinedDate: Date;
  }> {
    await connectToMongoDB();
    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const willsCount = await Will.countDocuments({ userId });
    const completedWillsCount = await Will.countDocuments({ 
      userId, 
      status: 'completed' 
    });
    const executedWillsCount = await Will.countDocuments({ 
      userId, 
      status: 'executed' 
    });

    return {
      willsCount,
      completedWillsCount,
      executedWillsCount,
      subscriptionStatus: user.subscription.status,
      joinedDate: user.createdAt,
    };
  }

  static async searchUsers(query: {
    email?: string;
    role?: 'user' | 'admin';
    subscriptionStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    users: IUser[];
    total: number;
    page: number;
    pages: number;
  }> {
    await connectToMongoDB();
    
    const { 
      email, 
      role, 
      subscriptionStatus, 
      page = 1, 
      limit = 20 
    } = query;

    const filter: any = {};
    
    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }
    
    if (role) {
      filter.role = role;
    }
    
    if (subscriptionStatus) {
      filter['subscription.status'] = subscriptionStatus;
    }

    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-hashedPassword')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    return {
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}