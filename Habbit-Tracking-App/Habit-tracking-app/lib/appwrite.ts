import { Account, Client , Databases } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "")

export const appwriteClient = client; 

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!;
export const HABBIT_COLLECTION_ID = process.env.EXPO_PUBLIC_HABBIT_COLLECTION_ID!
