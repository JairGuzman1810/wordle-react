import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { allWords } from "../utils/guessWords";

const ROWS = 1; // Number of rows in the game (attempts)
const COLUMNS = 5; // Number of columns (letters in the word)

const GameScreen = () => {
  const { width, height } = useWindowDimensions(); // Get screen dimensions for responsive design
  const colorScheme = useColorScheme(); // Detect if light or dark mode is active
  const Theme = Colors[colorScheme ?? "light"]; // Set colors based on the current theme
  const router = useRouter(); // Used to navigate between screens

  // State to track the letters in each row (player's guesses)
  const [rows, setRows] = useState<string[][]>(
    new Array(ROWS).fill("").map(() => new Array(COLUMNS).fill("")) // Create a 2D array for the grid, initially empty
  );
  const [curRow, setCurRow] = useState(0); // Track the current row (which attempt the player is on)
  const [curCol, setCurCol] = useState(0); // Track the current column (which letter is being typed)

  // Track which letters have been guessed correctly (green), misplaced (yellow), or not in the word (gray)
  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  // Randomly select the target word from the list of possible words
  const [word] = useState("banal");
  const wordLetters = word.split(""); // Convert the target word into an array of individual letters

  // State to track the background color of each cell (green, yellow, gray, or transparent)
  const [cellColors, setCellColors] = useState<string[][]>(
    new Array(ROWS).fill("").map(() => new Array(COLUMNS).fill("transparent"))
  );

  // Track the result of the game (win or lose), initially null
  const [gameResult, setGameResult] = useState<null | { win: boolean }>(null);

  // When the gameResult is updated (player wins or loses), navigate to the "end" screen
  useEffect(() => {
    if (gameResult) {
      const emojiGrid = convertToEmojiGrid(cellColors, curRow); // Convert the color grid into emojis for the final screen
      const gameField = JSON.stringify(emojiGrid); // Serialize the emoji grid into a string for the URL
      const encodedWord = encodeURIComponent(word); // Encode the word for safe URL usage

      // Navigate to the "end" screen, passing the win/lose state, word, and gameField as URL parameters
      router.replace(
        `/end?win=${gameResult.win}&word=${encodedWord}&gameField=${gameField}`
      );
    }
  }, [gameResult, cellColors, router, word, curRow]); // Including all necessary dependencies

  // Helper function to convert the color grid into a string of emoji representations
  const convertToEmojiGrid = (
    cellColors: string[][],
    curRow: number
  ): string[] => {
    const emojiMap: { [key: string]: string } = {
      [GRAY]: "⬛", // Gray emoji
      [YELLOW]: "🟨", // Yellow emoji
      [GREEN]: "🟩", // Green emoji
    };

    // Map over the cellColors and convert only rows up to curRow (inclusive)
    return cellColors
      .slice(0, curRow)
      .map((row) => row.map((color) => emojiMap[color] || "⬛").join(""));
  };

  // Function to handle keyboard input
  const addKey = (key: string) => {
    const newRows = rows.map((row) => [...row]); // Create a copy of the current rows

    if (key === "ENTER") {
      if (curCol === COLUMNS) {
        checkWord(); // If the player pressed "ENTER" and the row is complete, check the word
      }
    } else if (key === "BACKSPACE") {
      if (curCol > 0) {
        // Remove the last typed letter if backspace is pressed
        newRows[curRow][curCol - 1] = "";
        setRows(newRows);
        setCurCol(curCol - 1);
      }
    } else if (curCol < COLUMNS) {
      // Add the typed letter to the current column
      newRows[curRow][curCol] = key;
      setRows(newRows);
      setCurCol(curCol + 1);
    }
  };

  // Function to check if the word entered is correct, and update the colors accordingly
  const checkWord = () => {
    const currentWord = rows[curRow].join(""); // Get the word formed in the current row

    if (currentWord.length < word.length) {
      console.log("Not enough letters");
      return;
    }

    if (!allWords.includes(currentWord)) {
      console.log("Not a word"); // Check if the entered word is valid
      return;
    }

    const newGreenLetters: string[] = [];
    const newYellowLetters: string[] = [];
    const newGrayLetters: string[] = [];
    const newColors = [...cellColors.map((row) => [...row])]; // Copy current colors

    // Frequency map for the target word
    const targetLetterFreq: { [key: string]: number } = {};

    wordLetters.forEach((letter) => {
      targetLetterFreq[letter] = (targetLetterFreq[letter] || 0) + 1; // Count the occurrences of each letter in the target word
    });

    // First pass: Mark all letters that are correct and in the correct position (green)
    rows[curRow].forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newColors[curRow][index] = GREEN; // Set cell color to green
        newGreenLetters.push(letter); // Add letter to green letters
        targetLetterFreq[letter]--; // Decrement frequency of that letter in the target word
      }
    });

    // Second pass: Mark yellow (correct letters in wrong positions) and gray (incorrect letters)
    rows[curRow].forEach((letter, index) => {
      if (newColors[curRow][index] === GREEN) return; // Skip already marked green letters

      if (targetLetterFreq[letter]) {
        newColors[curRow][index] = YELLOW; // Set cell color to yellow
        newYellowLetters.push(letter); // Add letter to yellow letters
        targetLetterFreq[letter]--; // Decrement frequency of that letter
      } else {
        newColors[curRow][index] = GRAY; // Set cell color to gray (letter not in the word)
        newGrayLetters.push(letter);
      }
    });

    // Update the state with the new colors and guessed letters
    setCellColors(newColors);
    setGreenLetters([...greenLetters, ...newGreenLetters]);
    setYellowLetters([...yellowLetters, ...newYellowLetters]);
    setGrayLetters([...grayLetters, ...newGrayLetters]);

    if (currentWord === word) {
      setTimeout(() => setGameResult({ win: true }), 1500); // If the player wins, set the result to "win" after a delay
    } else if (curRow + 1 === ROWS) {
      setTimeout(() => setGameResult({ win: false }), 1500); // If it's the last row and the word is wrong, set the result to "lose"
    }

    setCurRow(curRow + 1); // Move to the next row (next attempt)
    setCurCol(0); // Reset column to the beginning
  };

  // Function to get the background color of a cell based on its position
  const getCellColor = (rowIndex: number, cellIndex: number) => {
    return cellColors[rowIndex][cellIndex] || "transparent"; // Return the cell color or transparent if not colored yet
  };

  // Calculate cell size based on screen width and height
  const cellSize = Math.min((width - 40) / COLUMNS, height * 0.085);

  // Function to get the border color of a cell
  const getBorderColor = (rowIndex: number, cellIndex: number) => {
    if (curRow > rowIndex) {
      return getCellColor(rowIndex, cellIndex); // If the row is completed, use the cell color
    }
    return Theme.gray; // Otherwise, use gray as the border color
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
