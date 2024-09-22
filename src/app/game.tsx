import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Keyboard from "../components/Keyboard";
import { Colors } from "../constants/Colors";

const ROWS = 6;
const COLUMNS = 5;

const GameScreen = () => {
  const colorScheme = useColorScheme();
  const Theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(COLUMNS).fill(""))
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
      <Text>game</Text>
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
});
