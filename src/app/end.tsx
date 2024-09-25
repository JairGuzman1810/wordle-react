import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedText } from "../components/ThemedText";
import { Colors } from "../constants/Colors";
import { FIRESTORE_DB } from "../utils/firebaseConfig";

// Define the explicit type for userScore
type UserScore = {
  played: number;
  wins: number;
  lastGame: "win" | "loss";
  currentStreak: number;
};

const EndScreen = () => {
  const colorScheme = useColorScheme(); // Detect if light or dark mode is active
  const [isLoading, setIsLoading] = useState(true);
  const Theme = Colors[colorScheme ?? "light"]; // Set colors based on the current theme
  const { win, word, gameField } = useLocalSearchParams<{
    win: string;
    word: string;
    gameField?: string;
  }>();
  const router = useRouter(); // Used to navigate between screens
  const [userScore, setUserScore] = useState<UserScore>({
    played: 0,
    wins: 0,
    lastGame: "loss",
    currentStreak: 0,
  });
  const { user } = useUser();

  const updateHighScore = useCallback(async () => {
    if (!user) return; // Check if user is logged in and if the score has already been updated

    try {
      const docRef = doc(FIRESTORE_DB, `highscore/${user.id}`);
      const docSnap = await getDoc(docRef);

      let newScore: UserScore = {
        played: 1,
        wins: win === "true" ? 1 : 0,
        lastGame: win === "true" ? "win" : "loss",
        currentStreak: win === "true" ? 1 : 0,
      };

      if (docSnap.exists()) {
        const data = docSnap.data() as UserScore;

        newScore = {
          played: data.played + 1,
          wins: win === "true" ? data.wins + 1 : data.wins,
          lastGame: win === "true" ? "win" : "loss",
          currentStreak:
            win === "true" && data.lastGame === "win"
              ? data.currentStreak + 1
              : win === "true"
                ? 1
                : 0,
        };
      }

      await setDoc(docRef, newScore);
      setUserScore(newScore);
      setIsLoading(false);
    } catch (error) {
      console.error("Error updating high score: ", error);
    }
  }, [user, win]);

  useEffect(() => {
    if (user) {
      updateHighScore();
    } else {
      setIsLoading(false);
    }
  }, [updateHighScore, user]);

  const navigateRoot = () => {
    router.dismissAll();
    router.replace("/");
  };

  const shareGame = async () => {
    // Parse the game field JSON string to an array
    const game = JSON.parse(gameField!);
    const attempts = game.length; // Number of rows (attempts) used in the game
    const totalRounds = 6; // Total rounds allowed in the game

    // Create the text message with proper formatting, avoiding extra spaces
    const textBody = [
      "Wordle Game Results:", // Title of the message
      game.map((row: string) => row).join("\n"), // Add each game row with a newline
      `Attempts: ${attempts}/${totalRounds}`, // Show the number of attempts out of total
      "Think you can do better?", // Challenge to the recipient
    ].join("\n\n"); // Join the message parts with double newlines for clarity

    try {
      // Use the Share API to share the plain text content
      await Share.share({
        message: textBody, // The message to be shared
      });
    } catch (error) {
      console.error("Error sharing the game: ", error); // Log if an error occurs
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size={"large"} color={Theme.gray} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={navigateRoot}>
              <Ionicons name="close" size={30} color={Theme.gray} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.header}>
        {win === "true" ? (
          <View style={styles.winContainer}>
            <View style={styles.winContent}>
              <Ionicons name="star" size={50} color="white" />
            </View>
          </View>
        ) : (
          <Image style={styles.image} source={require("@images/logo.png")} />
        )}
        <ThemedText style={styles.title}>
          {win === "true" ? "Congratulations" : "Thanks for playing today!"}
        </ThemedText>

        {win !== "true" && (
          <View style={styles.guessedWordContainer}>
            <ThemedText style={styles.guessedWordLabel}>
              The word was:
            </ThemedText>
            <ThemedText style={styles.guessedWord}>{word}</ThemedText>
          </View>
        )}

        <SignedOut>
          <ThemedText style={styles.text}>
            Want to see your stats and streaks?
          </ThemedText>

          <Link
            asChild
            href={"/login"}
            style={[styles.btn, { backgroundColor: Theme.playBtn }]}
          >
            <TouchableOpacity>
              <Text style={styles.btnText}>Create a free account</Text>
            </TouchableOpacity>
          </Link>

          <Link href={"/login"} asChild>
            <TouchableOpacity>
              <ThemedText style={styles.textLink}>
                Already Register? Log In
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </SignedOut>

        <SignedIn>
          <ThemedText style={styles.text}>Statistics</ThemedText>
          <View style={styles.stats}>
            <View>
              <ThemedText style={styles.score}>{userScore.played}</ThemedText>
              <ThemedText>Played</ThemedText>
            </View>
            <View>
              <ThemedText style={styles.score}>{userScore.wins}</ThemedText>
              <ThemedText>Wins</ThemedText>
            </View>
            <View>
              <ThemedText style={styles.score}>
                {userScore.currentStreak}
              </ThemedText>
              <ThemedText style={{ textAlign: "center" }}>
                Current{"\n"}Streak
              </ThemedText>
            </View>
          </View>
        </SignedIn>

        <View
          style={{
            height: StyleSheet.hairlineWidth,
            width: "100%",
            backgroundColor: Theme.gray,
          }}
        />

        <TouchableOpacity style={styles.iconBtn} onPress={shareGame}>
          <ThemedText style={styles.iconText}>Share</ThemedText>
          <Ionicons name="share-social" size={24} color={"#fff"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EndScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  winContainer: {
    backgroundColor: "#a1b899",
    height: 100,
    width: 100,
    borderRadius: 16,
  },
  winContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#4b7d3c",
    margin: 15,
  },
  image: {
    height: 100,
    width: 100,
    backgroundColor: "#fff",
    borderRadius: 11,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    fontFamily: "FrankRuhlLibre_800ExtraBold",
  },
  text: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "FrankRuhlLibre_500Medium",
  },
  guessedWordContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#fbe7e0",
    borderWidth: 2,
    borderColor: "#ff6347",
    alignItems: "center",
    justifyContent: "center",
  },
  guessedWordLabel: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#444", // Color neutro para el texto explicativo
  },
  guessedWord: {
    fontSize: 30, // Fuente más grande para la palabra
    fontWeight: "bold", // Negritas
    color: "#ff6347", // Color llamativo
    textTransform: "uppercase", // Mayúsculas
    marginTop: 10,
  },
  btn: {
    justifyContent: "center",
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1,
    width: "100%",
    maxHeight: 200,
  },
  btnText: {
    padding: 14,
    fontSize: 15,
    fontWeight: "semibold",
    color: "#fff",
  },
  textLink: {
    textDecorationLine: "underline",
    fontSize: 16,
    paddingVertical: 15,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 10,
    width: "100%",
    marginBottom: 15,
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  iconBtn: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.green,
    borderRadius: 30,
    width: "70%",
    paddingVertical: 10,
  },
  iconText: {
    fontSize: 15,
    fontWeight: "semibold",
    color: "#fff",
    marginHorizontal: 10,
  },
});
