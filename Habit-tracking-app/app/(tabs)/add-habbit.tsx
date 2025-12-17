import { DATABASE_ID, databases, HABBIT_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { ID } from "appwrite";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, SegmentedButtons, TextInput, useTheme } from "react-native-paper";
const FREQUENCIES = ["daily", "weekly", "monthly"];
type Frequency = (typeof FREQUENCIES)[number];
export default function AddHabbitScreen() {
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const theme = useTheme();

  const handleSubmit = async () => {
    if (!user) return;
    // Here you would typically send the new habit data to your backend or database
    try {
      await databases.createDocument(
         DATABASE_ID,
         HABBIT_COLLECTION_ID,
         ID.unique(),
       {
        title,
        description,
        frequency,
        user_id: user.$id,
        streak_count: 0,
        last_completed: "",
        // created_at: new Date().toISOString(),

      }
    );
      // navigate back to root and replace so index re-fetches
      router.replace("/");
    } catch (err) {
  console.log("Appwrite error:", err);
  if (err instanceof Error) {
    setError(err.message); // real message
  } else {
    setError("There was an error in creating habbit");
  }
}

  
};
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.form}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>Add New Habit</Text>
          <TextInput label="Title" mode="outlined" style={styles.input} value={title} onChangeText={setTitle} />
          <TextInput label="Description" mode="outlined" style={styles.input} value={description} onChangeText={setDescription} />
          <View style={styles.frequencyContainer}>
            <SegmentedButtons
              value={frequency}
              onValueChange={(value) => setFrequency(value as Frequency)}
              buttons={FREQUENCIES.map((freq) => ({
                value: freq,
                label: freq.charAt(0).toUpperCase() + freq.slice(1),
              }))}
            />
          </View>
          <Button mode="contained" style={styles.button} buttonColor={theme.colors.primary} disabled={!title || !description} onPress={handleSubmit}>
            Add Habit
          </Button>
          {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
        </View>
      </View>
      );
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#5e5d5dff",
      textAlign: "center",
      marginBottom: 30,
    },
    input: {
      marginBottom: 20,
      backgroundColor: "#f9f9f9",
    },
    frequencyContainer: {
      marginBottom: 30,
    },
    button: {
      marginTop: 20,
      paddingVertical: 8,
    },
    form: {
      width: '90%',
      padding: 20,
    },
  });
