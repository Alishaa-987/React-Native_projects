import { Account, Client , Databases  } from "appwrite";
import { Models } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "")

export const appwriteClient = client; 

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!;
export const HABBIT_COLLECTION_ID = process.env.EXPO_PUBLIC_HABBIT_COLLECTION_ID!
export const HABBIT_COMPLETIONS_COLLECTION_ID = process.env.EXPO_PUBLIC_HABBIT_COMPLETIONS_COLLECTION_ID!

export interface RealtimeResponse {
  events: string[];
  payload: any;
}

export interface Habit extends Models.Document {
  user_id: string;
  title: string;
  description: string;
  frequency: string;
  streak_count: number;
  last_completed: string | null;
  created_at: string;
}

export interface HabitCompletion extends Models.Document {
  habit_id: string;
  user_id: string;
  completed_at: string;
}