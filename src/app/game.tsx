import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Keyboard from "../components/Keyboard";
import { ThemedText } from "../components/ThemedText";
import { Colors } from "../constants/Colors";

const ROWS = 6;
const COLUMNS = 5;

const GameScreen = () => {
  const colorScheme = useColorScheme();
  const Theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(COLUMNS).fill("a"))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayetters] = useState<string[]>([]);

  const addKey = (key: string) => {
    console.log("addKey", key);
    //TODO
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerIcon}>
              <TouchableOpacity>
                <Ionicons
                  name="help-circle-outline"
                  size={28}
                  color={Theme.text}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="podium-outline" size={28} color={Theme.text} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="settings-sharp" size={28} color={Theme.text} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.gameField}>
        {rows.map((row, rowIdex) => (
          <View style={styles.gameFieldRow} key={`row-${rowIdex}`}>
            {row.map((cell, cellIndex) => (
              <View style={styles.cell} key={`cell-${rowIdex}-${cellIndex}`}>
                <ThemedText style={styles.cellText}>{cell}</ThemedText>
              </View>
            ))}
          </View>
        ))}
      </View>
      <Keyboard />
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
  },
  headerIcon: {
    gap: 10,
    flexDirection: "row",
  },
  gameField: {
    alignItems: "center",
    gap: 8,
  },
  gameFieldRow: {
    flexDirection: "row",
    gap: 8,
  },
  cell: {
    width: 62,
    height: 62,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
