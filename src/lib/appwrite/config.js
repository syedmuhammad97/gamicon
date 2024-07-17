import {Client, Account, Databases, Storage, Avatars } from 'appwrite'

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTIONS_ID,
    savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTIONS_ID,
    postsCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTIONS_ID,
    bookingsCollectionId: import.meta.env.VITE_APPWRITE_BOOKINGS_COLLECTION_ID,
    //appointmentsCollectionId: import.meta.env.VITE_APPWRITE_APPOINTMENTS_COLLECTIONS_ID,
    //userPointsCollectionId: import.meta.env.VITE_APPWRITE_USERPOINTS_COLLECTIONS_ID,

}

export const client = new Client();

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);