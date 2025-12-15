import { DATABASE_ID, HABBIT_COLLECTION_ID, databases } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.type";
import { Query } from "appwrite";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Index() {
  const { signOut, user , email } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };
  const [habits , setHabits] = useState<Habit[]>()

  useEffect(()=>{
    fetchHabits();
  },[user]);
  const fetchHabits = async () =>{
    try{
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABBIT_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      console.log(response.documents);
      // Map DefaultDocument[] to Habit[] with all required fields
      const habits: Habit[] = response.documents.map((doc: any) => ({
        $id: doc.$id,
        $createdAt: doc.$createdAt,
        $updatedAt: doc.$updatedAt,
        $databaseId: doc.$databaseId,
        $collectionId: doc.$collectionId,
        $permissions: doc.$permissions,
        $sequence: doc.$sequence,
        user_id: doc.user_id,
        title: doc.title,
        description: doc.description,
        frequency: doc.frequency,
        streak_count: doc.streak_count,
        last_completed: doc.last_completed,
      }));
      setHabits(habits);
    }catch(error){
      console.error(error);
    }
  }
  return (
    <View style={styles.view}>
      <Text>Welcome, {email || "User"}!</Text>
      <Button mode="contained" onPress={handleLogout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
  },
  button: {
    marginTop: 20,
  },
  navButton:{
    width:100,
    height:20,
    borderRadius: 10,
    backgroundColor: "cyan",
    textAlign: "center",
  }
})