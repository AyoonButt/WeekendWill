import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Photo uploader for will documents and personal items
  photoUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .middleware(async ({ req }) => {
      // Authenticate user
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      // Return user data to be available in onUploadComplete
      return {
        userId: session.user.id,
        userEmail: session.user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server after upload
      console.log("Photo upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Save file info to database if needed
      // await savePhotoToDatabase({
      //   userId: metadata.userId,
      //   url: file.url,
      //   name: file.name,
      //   size: file.size,
      // });

      // Return data to the client
      return {
        url: file.url,
        name: file.name,
        size: file.size,
        uploadedBy: metadata.userId,
      };
    }),

  // Document uploader for additional legal documents
  documentUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
    image: {
      maxFileSize: "4MB", 
      maxFileCount: 3,
    },
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      return {
        userId: session.user.id,
        userEmail: session.user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      return {
        url: file.url,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedBy: metadata.userId,
      };
    }),

  // Avatar uploader for user profile pictures
  avatarUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      return {
        userId: session.user.id,
        userEmail: session.user.email,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Update user profile with new avatar
      // await updateUserAvatar(metadata.userId, file.url);

      return {
        url: file.url,
        uploadedBy: metadata.userId,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;