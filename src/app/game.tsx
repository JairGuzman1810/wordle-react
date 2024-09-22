import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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
import { allWords } from "../utils/guessWords";

const ROWS = 6;
const COLUMNS = 5;

const GameScreen = () => {
  const { width, height } = useWindowDimensions(); // Obtén las dimensiones de la pantalla
  const colorScheme = useColorScheme();
  const Theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill(new Array(COLUMNS).fill(""))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, _setCurCol] = useState(0);

  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  /*const [word, setWord] = useState<string>(
    words[Math.floor(Math.random() * words.length)]
  );*/
  const [word, setWord] = useState<string>("leche");
  const wordLetters = word.split("");

  const colStateRef = useRef(curCol);
  const setCurCol = (col: number) => {
    colStateRef.current = col;
    _setCurCol(col);
  };

  const addKey = (key: string) => {
    console.log("addKey", key);
    const newRows = [...rows.map((row) => [...row])];

    if (key === "ENTER") {
      checkWord();
    } else if (key === "BACKSPACE") {
      if (colStateRef.current === 0) {
        newRows[curRow][0] = "";
        setRows(newRows);
        return;
      }

      newRows[curRow][colStateRef.current - 1] = "";
      setCurCol(colStateRef.current - 1);
      setRows(newRows);
    } else if (colStateRef.current >= newRows[curRow].length) {
      //EoL, dont add key
      return;
    } else {
      newRows[curRow][colStateRef.current] = key;
      setRows(newRows);
      setCurCol(colStateRef.current + 1);
    }
  };

  const checkWord = () => {
    const currentWord = rows[curRow].join("");

    if (currentWord.length < word.length) {
      //TODO: error
      console.log("Not enough letters");
      return;
    }

    if (!allWords.includes(currentWord)) {
      //TODO: error
      console.log("Not a word");
      //return
    }

    const newGreen: string[] = [];
    const newYellow: string[] = [];
    const newGray: string[] = [];

    currentWord.split("").forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newGreen.push(letter);
      } else if (wordLetters.includes(letter)) {
        newYellow.push(letter);
      } else {
        newGray.push(letter);
      }

      setGreenLetters([...greenLetters, ...newGreen]);
      setYellowLetters([...yellowLetters, ...newYellow]);
      setGrayLetters([...grayLetters, ...newGray]);

      setTimeout(() => {
        if (currentWord === word) {
          console.log("Word found");
          //TODO SHOW END SCREEN
        } else if (curRow + 1 >= rows.length) {
          console.log("Game over");
          //TODO SHOW END SCREEN
        }
      }, 0);

      setCurRow(curRow + 1);
      setCurCol(0);
    });
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
