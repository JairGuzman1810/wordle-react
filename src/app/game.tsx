/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import Keyboard from "../components/Keyboard";
import SettingsModal from "../components/SettingsModal";
import { Colors, GRAY, GREEN, YELLOW } from "../constants/Colors";
import { words, wordsSPA } from "../utils/answerWords";
import { allWords, allWordsSPA } from "../utils/guessWords";
import { storage } from "../utils/storage";

const ROWS = 6; // Number of rows in the game (attempts)
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

  // Get the state for Spanish mode
  const [isSpanish] = useMMKVBoolean("spanish-mode", storage);

  // Track which letters have been guessed correctly (green), misplaced (yellow), or not in the word (gray)
  const [greenLetters, setGreenLetters] = useState<string[]>([]);
  const [yellowLetters, setYellowLetters] = useState<string[]>([]);
  const [grayLetters, setGrayLetters] = useState<string[]>([]);

  const settingsModalRef = useRef<BottomSheetModal>(null);
  const handleShowSettingsModal = () => settingsModalRef.current?.present();
  // Randomly select the target word from the list of possible words
  const [word, setWord] = useState(
    (isSpanish ? wordsSPA : words)[
      Math.floor(Math.random() * (isSpanish ? wordsSPA.length : words.length))
    ]
  );

  const wordLetters = word.split(""); // Convert the target word into an array of individual letters

  // State to track the background color of each cell (green, yellow, gray, or transparent)
  const [cellColors, setCellColors] = useState<string[][]>(
    new Array(ROWS).fill("").map(() => new Array(COLUMNS).fill("transparent"))
  );

  const [cellBorders, setCellBorders] = useState<string[][]>(
    new Array(ROWS).fill("").map(() => new Array(COLUMNS).fill(Theme.gray))
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

  useEffect(() => {
    // Reset the game state
    setRows(new Array(ROWS).fill("").map(() => new Array(COLUMNS).fill("")));
    setCurRow(0);
    setCurCol(0);
    setGreenLetters([]);
    setYellowLetters([]);
    setGrayLetters([]);
    setCellColors(
      new Array(ROWS).fill("").map(() => new Array(COLUMNS).fill("transparent"))
    );
    setCellBorders(
      new Array(ROWS).fill("").map(() => new Array(COLUMNS).fill(Theme.gray))
    );

    cellBackground.forEach((row, rowIndex) => {
      row.forEach((_, cellIndex) => {
        // Reset each cell background to "transparent"
        cellBackground[rowIndex][cellIndex].value = withTiming("transparent", {
          duration: 300,
        });

        // Reset each cell border to the default color (e.g., Theme.gray)
        cellBorder[rowIndex][cellIndex].value = withTiming(Theme.gray, {
          duration: 300,
        });
      });
    });

    // Select a new word based on the language
    const newWord = (isSpanish ? wordsSPA : words)[
      Math.floor(Math.random() * (isSpanish ? wordsSPA : words).length)
    ];
    setWord(newWord);
  }, [isSpanish]);

  // Helper function to convert the color grid into a string of emoji representations
  const convertToEmojiGrid = (
    cellColors: string[][],
    curRow: number
  ): string[] => {
    const emojiMap: { [key: string]: string } = {
      [GRAY]: "⬜", // Gray emoji
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
      checkWord();
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

    console.log(`Current Word: ${currentWord}`); // Debugging log

    if (currentWord.length < word.length) {
      console.log("Shaking row for short word"); // Debugging log
      shakeRow();
      return;
    }

    // Use the appropriate word list based on the Spanish mode
    const validWords = isSpanish ? allWordsSPA : allWords;

    if (!validWords.includes(currentWord)) {
      console.log("Shaking row for invalid word"); // Debugging log
      shakeRow();
      return;
    }

    flipRow();

    const newGreenLetters: string[] = [];
    const newYellowLetters: string[] = [];
    const newGrayLetters: string[] = [];
    const newColors = [...cellColors.map((row) => [...row])]; // Copy current colors
    const newBorders = [...cellBorders.map((row) => [...row])]; // Copy current borders

    // Frequency map for the target word
    const targetLetterFreq: { [key: string]: number } = {};

    wordLetters.forEach((letter) => {
      targetLetterFreq[letter] = (targetLetterFreq[letter] || 0) + 1; // Count the occurrences of each letter in the target word
    });

    // First pass: Mark all letters that are correct and in the correct position (green)
    rows[curRow].forEach((letter, index) => {
      if (letter === wordLetters[index]) {
        newColors[curRow][index] = GREEN; // Set cell color to green
        newBorders[curRow][index] = GREEN; // Set border color to green
        newGreenLetters.push(letter); // Add letter to green letters
        targetLetterFreq[letter]--; // Decrement frequency of that letter in the target word
      }
    });

    // Second pass: Mark yellow (correct letters in wrong positions) and gray (incorrect letters)
    rows[curRow].forEach((letter, index) => {
      if (newColors[curRow][index] === GREEN) return; // Skip already marked green letters

      if (targetLetterFreq[letter]) {
        newColors[curRow][index] = YELLOW; // Set cell color to yellow
        newBorders[curRow][index] = YELLOW; // Set border color to yellow
        newYellowLetters.push(letter); // Add letter to yellow letters
        targetLetterFreq[letter]--; // Decrement frequency of that letter
      } else {
        newColors[curRow][index] = GRAY; // Set cell color to gray (letter not in the word)
        newBorders[curRow][index] = GRAY; // Set border color to gray
        newGrayLetters.push(letter);
      }
    });

    // Update the state with the new colors and guessed letters
    setCellColors(newColors);
    setCellBorders(newBorders); // Make sure to set the new borders state
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

  // Calculate cell size based on screen width and height
  const cellSize = Math.min((width - 40) / COLUMNS, height * 0.085);

  //Animations
  //SHAKE
  const offsetShakes = Array.from({ length: ROWS }, () => useSharedValue(0));

  const rowStyles = Array.from({ length: ROWS }, (_, index) =>
    useAnimatedStyle(() => {
      return {
        transform: [{ translateX: offsetShakes[index].value }],
      };
    })
  );

  const shakeRow = () => {
    const TIME = 80;
    const OFFSET = 10;

    offsetShakes[curRow].value = withSequence(
      withTiming(-OFFSET, { duration: TIME / 2 }),
      withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
      withTiming(0, { duration: TIME / 2 })
    );
  };

  //FLIP
  const tileRotates = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(0))
  );

  const cellBackground = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue("transparent"))
  );

  const cellBorder = Array.from({ length: ROWS }, () =>
    Array.from({ length: 5 }, () => useSharedValue(Theme.gray))
  );

  // Example of how to use interpolateColor
  const tileStyles = Array.from({ length: ROWS }, (_, index) => {
    return Array.from({ length: COLUMNS }, (_, tileIndex) =>
      useAnimatedStyle(() => {
        // Map animated value to colors
        const isCurrentRow = index === curRow;
        const isPreviousColumnInCurrentRow =
          index === curRow && tileIndex < curCol;
        return {
          transform: [{ rotateX: `${tileRotates[index][tileIndex].value}deg` }],
          backgroundColor: cellBackground[index][tileIndex].value,
          borderColor:
            isCurrentRow && isPreviousColumnInCurrentRow
              ? Theme.text // Use a different color for previous cells
              : cellBorder[index][tileIndex].value,
        };
      })
    );
  });

  const flipRow = () => {
    const TIME = 300;
    const OFFSET = 90;

    tileRotates[curRow].forEach((value, index) => {
      value.value = withDelay(
        index * 100,
        withSequence(
          withTiming(OFFSET, { duration: TIME }, () => {}),
          withTiming(0, { duration: TIME })
        )
      );
    });
  };

  useEffect(() => {
    if (curRow === 0) return;

    const currentRow = curRow - 1; // Adjusting for zero-based index

    rows[currentRow].forEach((cell, cellIndex) => {
      // Update cell background with delay
      cellBackground[currentRow][cellIndex].value = withDelay(
        cellIndex * 180, // Delay based on cell index
        withTiming(cellColors[currentRow][cellIndex]) // Use the color from state
      );

      // Update cell border with delay
      cellBorder[currentRow][cellIndex].value = withDelay(
        cellIndex * 180, // Delay based on cell index
        withTiming(cellBorders[currentRow][cellIndex]) // Use the border color from state
      );
    });
  }, [curRow]);

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
              <TouchableOpacity onPress={handleShowSettingsModal}>
                <Ionicons name="settings-sharp" size={28} color={Theme.text} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.gameField}>
        {rows.map((row, rowIndex) => (
          <Animated.View
            style={[styles.gameFieldRow, rowStyles[rowIndex]]}
            key={`row-${rowIndex}`}
          >
            {row.map((cell, cellIndex) => (
              <Animated.View
                entering={ZoomIn.delay(50 * cellIndex)}
                key={`cell-${rowIndex}-${cellIndex}`}
              >
                <Animated.View
                  style={[
                    styles.cell,
                    {
                      width: cellSize,
                      height: cellSize,
                    },
                    tileStyles[rowIndex][cellIndex],
                  ]}
                >
                  <Animated.Text
                    style={[
                      styles.cellText,
                      {
                        color: curRow > rowIndex ? "#fff" : Theme.text,
                      },
                    ]}
                  >
                    {cell}
                  </Animated.Text>
                </Animated.View>
              </Animated.View>
            ))}
          </Animated.View>
        ))}
      </View>
      <Keyboard
        onKeyPressed={addKey}
        greenLetters={greenLetters}
        yellowLetters={yellowLetters}
        grayLetters={grayLetters}
      />
      <SettingsModal bottomSheetRef={settingsModalRef} />
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
    width: 62,
    height: 62,
  },
  cellText: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
