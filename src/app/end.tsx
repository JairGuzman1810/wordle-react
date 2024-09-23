import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const EndScreen = () => {
  const { win, word, gameField } = useLocalSearchParams<{
    win: string;
    word: string;
    gameField?: string;
  }>();

  return (
    <View>
      <Text>EndScreen</Text>
    </View>
  );
};

export default EndScreen;

const styles = StyleSheet.create({});
