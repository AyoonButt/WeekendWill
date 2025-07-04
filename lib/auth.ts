import { NextAuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectToDatabase, clientPromise } from './mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          console.log('=== CREDENTIALS AUTH DEBUG ===');
          console.log('Attempting login for email:', credentials.email);
          
          const { db } = await connectToDatabase();
          console.log('Database connected successfully');
          
          const user = await db.collection('users').findOne({
            email: credentials.email.toLowerCase(),
          });

          console.log('User lookup result:', user ? 'User found' : 'No user found');
          
          if (!user) {
            console.log('Authentication failed: No user found');
            throw new Error('No user found with this email');
          }

          console.log('Comparing password...');
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Authentication failed: Invalid password');
            throw new Error('Invalid password');
          }

          console.log('Authentication successful for user:', user.email);
          console.log('=== END CREDENTIALS AUTH DEBUG ===');

          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.profile.firstName} ${user.profile.lastName}`,
            image: user.image,
            role: user.role || 'user',
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        token.role = user.role || 'user';
        token.userId = user.id;

        // Handle OAuth providers
        if (account?.provider === 'google') {
          try {
            const { db } = await connectToDatabase();
            let existingUser = await db.collection('users').findOne({
              email: user.email?.toLowerCase(),
            });

            if (!existingUser) {
              // Create new user for Google OAuth
              const userData = {
                email: user.email?.toLowerCase(),
                profile: {
                  firstName: user.name?.split(' ')[0] || '',
                  lastName: user.name?.split(' ').slice(1).join(' ') || '',
                },
                image: user.image,
                role: 'user',
                subscription: {
                  plan: 'essential',
                  status: 'inactive',
                },
                emailVerified: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              const result = await db.collection('users').insertOne(userData);
              existingUser = { ...userData, _id: result.insertedId };
            }

            token.userId = existingUser._id.toString();
            token.role = existingUser.role || 'user';
            token.email = existingUser.email;
            token.name = user.name;
            token.image = user.image;
          } catch (error) {
            console.error('Error handling Google OAuth user:', error);
            throw new Error('OAuth authentication failed');
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', { user: user.email, provider: account?.provider });
    },
    async signOut({ session, token }) {
      console.log('User signed out:', { user: session?.user?.email });
    },
  },
  debug: process.env.NODE_ENV === 'development',
};