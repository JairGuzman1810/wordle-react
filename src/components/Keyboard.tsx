import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { Colors, GRAY, GREEN, YELLOW } from "../constants/Colors";
import { ThemedText } from "./ThemedText";

type KeyboardProps = {
  onKeyPressed: (key: string) => void;
  greenLetters: string[];
  yellowLetters: string[];
  grayLetters: string[];
};

export const ENTER = "ENTER";
export const BACKSPACE = "BACKSPACE";

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  [ENTER, "z", "x", "c", "v", "b", "n", "m", BACKSPACE],
];

const Keyboard = ({
  onKeyPressed,
  greenLetters,
  yellowLetters,
  grayLetters,
}: KeyboardProps) => {
  const colorScheme = useColorScheme();
  const Theme = Colors[colorScheme ?? "light"];
  const { width, height } = useWindowDimensions();
  const keyWidth = (width - 60) / keys[0].length;
  const keyHeight = Math.min(60, height * 0.07); // 7% de la altura de la pantalla o 60 como máximo

  const isSpecialKey = (key: string) => key === ENTER || key === BACKSPACE;

  const isInLetters = (key: string) =>
    [...greenLetters, ...yellowLetters, ...grayLetters].includes(key);

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((key, keyIndex) => (
            <Pressable
              key={`key-${rowIndex}-${keyIndex}`}
              onPress={() => onKeyPressed(key)}
              style={({ pressed }) => [
                styles.key,
                { width: keyWidth, height: keyHeight },
                isSpecialKey(key) && { width: keyWidth * 1.5 },
                {
                  backgroundColor: greenLetters.includes(key)
                    ? GREEN
                    : yellowLetters.includes(key)
                      ? YELLOW
                      : grayLetters.includes(key)
                        ? GRAY
                        : Theme.key,
                },
                pressed && { backgroundColor: "#868686" },
              ]}
            >
              <ThemedText
                style={[
                  styles.keyText,
                  key === "ENTER" && { fontSize: 12 },
                  isInLetters(key) && { color: "#fff" },
                ]}
              >
                {isSpecialKey(key) ? (
                  key === "ENTER" ? (
                    "ENTER"
                  ) : (
                    <Ionicons
                      name="backspace-outline"
                      size={24}
                      color={Theme.text}
                    />
                  )
                ) : (
                  key
                )}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
};

export default Keyboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    gap: 4,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  key: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  keyText: {
    fontWeight: "bold",
    fontSize: 20,
    textTransform: "uppercase",
  },
});
