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
import { Colors, GRAY, GREEN, YELLOW } from "../constants/Colors";
import { words } from "../utils/answerWords";
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

  const [word] = useState(words[Math.floor(Math.random() * words.length)]);
  const wordLetters = word.split("");

  // State to track cell colors
  const [cellColors, setCellColors] = useState<string[][]>(
    new Array(ROWS).fill(new Array(COLUMNS).fill("transparent"))
  );

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
      console.log("Not enough letters");
      return;
    }

    if (!allWords.includes(currentWord)) {
      console.log("Not a word");
      return;
    }

    const newGreen: string[] = [];
    const newYellow: string[] = [];
    const newGray: string[] = [];
    const newColors = [...cellColors.map((row) => [...row])]; // Copy current colors

    // Frequency map for the target word
    const targetLetterFreq: { [key: string]: number } = {};
    wordLetters.forEach((letter) => {
      targetLetterFreq[letter] = (targetLetterFreq[letter] || 0) + 1;
    });

    // Frequency map for the guessed word
    const guessLetterFreq: { [key: string]: number } = {};
    currentWord.split("").forEach((letter) => {
      guessLetterFreq[letter] = (guessLetterFreq[letter] || 0) + 1;
    });

    // First pass for green (correct positions)
    currentWord.split("").forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newColors[curRow][index] = GREEN; // Store color for this cell
        newGreen.push(letter);
        targetLetterFreq[letter]--; // Decrease count for green letters
        guessLetterFreq[letter]--; // Decrease count for the guessed word letter
      }
    });

    // Second pass for yellow and gray (wrong positions)
    currentWord.split("").forEach((letter, index) => {
      if (newColors[curRow][index] === GREEN) return; // Skip already marked green

      if (targetLetterFreq[letter] > 0 && guessLetterFreq[letter] > 0) {
        newColors[curRow][index] = YELLOW; // Store color for this cell
        newYellow.push(letter);
        targetLetterFreq[letter]--; // Decrease count for yellow letters
        guessLetterFreq[letter]--; // Decrease count for the guessed word letter
      } else {
        newColors[curRow][index] = GRAY; // Store color for this cell
        newGray.push(letter);
      }
    });

    setGreenLetters([...greenLetters, ...newGreen]);
    setYellowLetters([...yellowLetters, ...newYellow]);
    setGrayLetters([...grayLetters, ...newGray]);

    // Update the colors for the current row
    setCellColors(newColors);

    setTimeout(() => {
      if (currentWord === word) {
        console.log("Word found");
        // TODO: show end screen
      } else if (curRow + 1 >= rows.length) {
        console.log("Game over");
        // TODO: show end screen
      }
    }, 1500);

    setCurRow(curRow + 1);
    setCurCol(0);
  };

  const getCellColor = (rowIndex: number, cellIndex: number) => {
    // Return the color stored for this cell
    return cellColors[rowIndex][cellIndex] || "transparent";
  };

  const cellSize = Math.min((width - 40) / COLUMNS, height * 0.085);

  const getBorderColor = (rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex) {
      return getCellColor(rowIndex, cellIndex);
    }

    return Theme.gray;
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
        {rows.map((row, rowIndex) => (
          <View style={styles.gameFieldRow} key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <View
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                  },
                  {
                    backgroundColor: getCellColor(rowIndex, cellIndex),
                    borderColor: getBorderColor(rowIndex, cellIndex),
                  },
                ]}
                key={`cell-${rowIndex}-${cellIndex}`}
              >
                <ThemedText
                  style={[
                    styles.cellText,
                    { color: curRow > rowIndex ? "#fff" : Theme.text },
                  ]}
                >
                  {cell}
                </ThemedText>
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
    borderRadius: 10,
  },
  cellText: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
