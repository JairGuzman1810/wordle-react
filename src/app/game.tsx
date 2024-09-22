import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import Keyboard from "../components/Keyboard";
import { ThemedText } from "../components/ThemedText";
import { Colors } from "../constants/Colors";

const ROWS = 6;
const COLUMNS = 5;

const GameScreen = () => {
  const { width, height } = useWindowDimensions(); // Obtén las dimensiones de la pantalla
  const colorScheme = useColorScheme();
  const Theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(COLUMNS).fill("a"))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>(["a"]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayetters] = useState<string[]>(["c"]);

  const addKey = (key: string) => {
    console.log("addKey", key);
  };

  const cellSize = Math.min((width - 40) / COLUMNS, height * 0.085);

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
              <View
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    borderColor: Theme.text,
                  },
                ]}
                key={`cell-${rowIdex}-${cellIndex}`}
              >
                <ThemedText style={styles.cellText}>{cell}</ThemedText>
              </View>
            ))}
          </View>
        ))}
      </View>
      <Keyboard
        onKeyPressed={addKey}
        greenLetters={greenLetters}
        yellowLetters={yellowLetters}
        grayLetters={grayLetters}
      />
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
