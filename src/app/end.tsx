import { SignedOut } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
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
});
