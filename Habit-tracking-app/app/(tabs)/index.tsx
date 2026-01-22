import { client, DATABASE_ID, databases, HABBIT_COLLECTION_ID, HABBIT_COMPLETIONS_COLLECTION_ID, HabitCompletion, RealtimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Query } from "appwrite";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import { ScrollView, Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text, useTheme } from "react-native-paper";

 

export default function Index() {
  const { signOut, user } = useAuth();
  const theme = useTheme();

  // const handleLogout = async () => {
  //   await signOut();
  // };

  const [habits, setHabits] = useState<Habit[]>([]);
  const [completeHabits, setCompleteHabits] = useState<string[]>([]);
  const [allCompletions, setAllCompletions] = useState<HabitCompletion[]>([]);

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({})
  const fetchHabits = useCallback(async () => {
    try {
      const response = await databases.listDocuments<Habit>(
        DATABASE_ID,
        HABBIT_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );

      setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error(error);
    }
  }, [user]);


  const fetchTodayCompletions = useCallback(async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const response = await databases.listDocuments<HabitCompletion>(
        DATABASE_ID,
        HABBIT_COMPLETIONS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? ""),
        Query.greaterThanEqual("completed_at", today.toISOString())
        ]
      );
      const completions = response.documents as HabitCompletion[]
      setCompleteHabits(completions.map(c => c.habit_id));
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  const fetchAllCompletions = useCallback(async () => {
    try {
      const response = await databases.listDocuments<HabitCompletion>(
        DATABASE_ID,
        HABBIT_COMPLETIONS_COLLECTION_ID,
        [Query.equal("user_id", user?.$id ?? "")]
      );
      setAllCompletions(response.documents as HabitCompletion[]);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      let habbitsSubscription: (() => void) | undefined;
      let completionsSubscription: (() => void) | undefined;

      const initSubscriptions = async (retry = true) => {
        try {
          const habbitChannel = `databases.${DATABASE_ID}.collections.${HABBIT_COLLECTION_ID}.documents`;
          habbitsSubscription = client.subscribe(habbitChannel, (response: RealtimeResponse) => {
            // respond to any create/update/delete on habits
            if (response.events.some((e) => e.includes(".documents.") && (e.endsWith(".create") || e.endsWith(".update") || e.endsWith(".delete")))) {
              fetchHabits();
            }
          });

          const completionChannel = `databases.${DATABASE_ID}.collections.${HABBIT_COMPLETIONS_COLLECTION_ID}.documents`;
          completionsSubscription = client.subscribe(completionChannel, (response: RealtimeResponse) => {
            // respond to any completion changes so today's and all completions stay current
            if (response.events.some((e) => e.includes(".documents.") && (e.endsWith(".create") || e.endsWith(".update") || e.endsWith(".delete")))) {
              fetchTodayCompletions();
              fetchAllCompletions();
            }
          });
        } catch (err: any) {
          console.warn('Realtime subscribe failed:', err?.message || err);
          // if it failed due to socket not ready, try one retry after short delay
          if (retry) {
            setTimeout(() => initSubscriptions(false), 1000);
          }
        }
      };

      // ensure we always fetch once on mount even if realtime fails
      initSubscriptions();
      fetchHabits();
      fetchTodayCompletions();
      fetchAllCompletions();

      return () => {
        try { habbitsSubscription && habbitsSubscription(); } catch {}
        try { completionsSubscription && completionsSubscription(); } catch {}
      }
    }
  }, [user, fetchHabits, fetchTodayCompletions, fetchAllCompletions]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchHabits();
        fetchTodayCompletions();
        fetchAllCompletions();
      }
    }, [user, fetchHabits, fetchTodayCompletions, fetchAllCompletions])
  );

  // short polling fallback: try a few times after mount to catch new habits
  useEffect(() => {
    if (!user) return;
    let attempts = 0;
    const maxAttempts = 4;
    const iv = setInterval(() => {
      attempts += 1;
      fetchHabits();
      fetchTodayCompletions();
      fetchAllCompletions();
      if (attempts >= maxAttempts) clearInterval(iv);
    }, 1500);
    return () => clearInterval(iv);
  }, [user, fetchHabits, fetchTodayCompletions, fetchAllCompletions]);
  const handleDeleteHabit = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, HABBIT_COLLECTION_ID, id);
      // remove from local state immediately
      setHabits((prev) => prev.filter((h) => h.$id !== id));
      setCompleteHabits((prev) => prev.filter((hid) => hid !== id));
    } catch (error) {
      console.log(error);
    }
  };


  const handleCompleteHabit = async (id: string) => {
    if (!user || completeHabits?.includes(id)) return;
    const currentDate = new Date().toISOString();
    try {
      const created = await databases.createDocument(DATABASE_ID, HABBIT_COMPLETIONS_COLLECTION_ID, ID.unique(), {
        habit_id: id,
        user_id: user?.$id,
        completed_at: currentDate,
      });

      // optimistic UI update: mark as completed for today
      setCompleteHabits((prev) => Array.from(new Set([...prev, id])));
      // optimistic add to allCompletions so streak calc updates immediately
      setAllCompletions((prev) => [{ ...(created as unknown as HabitCompletion) }, ...prev]);

      const habit = habits?.find((h) => h.$id === id)
      if (!habit) return;

      const updated = await databases.updateDocument(DATABASE_ID, HABBIT_COLLECTION_ID, id, {
        streak_count: habit.streak_count + 1,
        last_completed: currentDate,
      });

      // update local habits state to reflect new streak_count
      setHabits((prev) => prev.map((h) => h.$id === id ? { ...h, streak_count: (h.streak_count || 0) + 1, last_completed: currentDate } : h));

      console.log('Habit completed:', { created, updated });
    } catch (error) {
      console.log('Error completing habit:', error);
    }
  };

  const isHabitCompleted = (habitId: string) => {
    return completeHabits?.includes(habitId);
  };

  // compute current streak for a habit using full completion history
  const getStreakForHabit = (habitId: string) => {
    const habitCompletions = allCompletions
      .filter((c) => c.habit_id === habitId)
      .sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime());

    if (habitCompletions.length === 0) return 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    habitCompletions.forEach((c) => {
      const date = new Date(c.completed_at);
      if (lastDate) {
        const diff = (date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff <= 1.5) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      lastDate = date;
    });

    return currentStreak;
  };

  const renderRightActions = (habitId: string) => (
    <View style={[styles.swipeActionRight, { backgroundColor: theme.colors.primary }]}>
      {isHabitCompleted(habitId) ? (
        <Text style={{ color: "#fff" }}> Completed !</Text>
      ) : (
        <MaterialCommunityIcons name="check-circle-outline" size={32} color="#fff" />
      )}
    </View>
  );

  const renderLeftActions = () => (
    <View style={styles.swipeActionLeft}>
      <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="titleLarge" style={[styles.title, { color: theme.colors.onBackground }]}>Todays Habits</Text>
        </View>
        <View style={styles.headerRight}>
          <Button mode="text" onPress={signOut} icon={"logout"}>
            Sign Out
          </Button>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {habits?.length === 0 ? (
          <View style={styles.emptyState}>
            {" "}
            <Text style={styles.emptyStateText}>
              No Habits yet. Add your first Habit!
            </Text>
          </View>
        ) : (
          habits?.map((item, key) => (
            <Swipeable
              ref={(ref) => {
                swipeableRefs.current[item.$id] = ref;
              }}
              key={item.$id}
              overshootLeft={false}
              overshootRight={false}
              renderLeftActions={renderLeftActions}
              renderRightActions={() => renderRightActions(item.$id)}
              onSwipeableOpen={(direction) => {
                if (direction === "left") {
                  handleDeleteHabit(item.$id);
                } else if (direction === "right") {
                  handleCompleteHabit(item.$id);
                }

                swipeableRefs.current[item.$id]?.close();
              }}
            >
              <Surface
                style={[
                  styles.card,
                  { backgroundColor: theme.colors.surface },
                  isHabitCompleted(item.$id) && styles.cardCompleted,
                ]}
                elevation={2}
              >
                <View style={styles.cardRow}>
                  <View style={[styles.cardAccent, { backgroundColor: theme.colors.primary }]} />
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: theme.colors.onBackground }]}> {item.title}</Text>
                    <Text style={[styles.cardDescription, { color: theme.colors.onSurfaceVariant }]}> 
                      {" "}
                      {item.description}
                    </Text>
                    <View style={styles.cardFooter}>
                      <View style={styles.cardFooterLeft}>
                        <View style={[styles.streakBadge, { backgroundColor: theme.colors.background }]}>
                          <MaterialCommunityIcons name="fire" size={18} color={theme.colors.primary} />
                          <Text style={[styles.streakText, { color: theme.colors.primary }]}>{getStreakForHabit(item.$id)} day streak</Text>
                        </View>
                      </View>
                      <View style={styles.cardFooterRight}>
                        <View style={[styles.frequencyBadge, { backgroundColor: theme.colors.background }]}>
                          <Text style={[styles.frequencyText, { color: theme.colors.onSurfaceVariant }]}> 
                            {item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </Surface>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerRight: {
    marginLeft: 12,
  },
  title: {
    fontWeight: "bold",
    color: "#ffffff",
    fontFamily: "Roboto",
  },

  card: {
    marginBottom: 18,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e6eef8",
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  cardAccent: {
    width: 6,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    marginRight: 12,
  },

  cardCompleted: {
    opacity: 0.6,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#ffffff",
    fontFamily: "Roboto",
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: "#cccccc",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardFooterLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  cardFooterRight: {
    alignItems: "flex-end",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e2e2e",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    marginLeft: 6,
    color: "#4caf50",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: "#2e2e2e",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  frequencyText: {
    color: "#4caf50",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  emptyStateText: {
    color: "#cccccc",
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#d32f2f",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#388e3c",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },
});