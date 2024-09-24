import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
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
import { logoImageUri } from "../constants/Images";

const EndScreen = () => {
  const colorScheme = useColorScheme(); // Detect if light or dark mode is active

  const Theme = Colors[colorScheme ?? "light"]; // Set colors based on the current theme
  const { win, word, gameField } = useLocalSearchParams<{
    win: string;
    word: string;
    gameField?: string;
  }>();

  const router = useRouter(); // Used to navigate between screens

  const [userScore, setUserScore] = useState<any>({
    played: 42,
    wins: 2,
    currentStreak: 1,
  });

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
          <Image style={styles.image} source={{ uri: logoImageUri }} />
        )}
        <ThemedText style={styles.title}>
          {win === "true" ? "Congratulations" : "Thanks for playing today!"}
        </ThemedText>
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
              <ThemedText>Current Streak</ThemedText>
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
          <ThemedText>Share</ThemedText>
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
    backgroundColor: "#FFF",
    borderRadius: 13,
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
});
