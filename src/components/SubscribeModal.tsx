import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import disc from "@jsamr/counter-style/presets/disc";
import MarkedList from "@jsamr/react-native-li";
import { useIsFocused } from "@react-navigation/native";
import { Link } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors"; // Assuming this is the same Colors used in Index.tsx
import { gamesImageUri } from "../constants/Images";
import { ThemedText } from "./ThemedText";

type SubscribeModalProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
};

const BENEFITS = [
  "Enjoy full access to Wordle, Spelling Bee, The Crossword and more.",
  "Play new puzzles every day for concentration or relaxation.",
  "Strengthen your strategy with WordleBot.",
  "Unlock over 10,000 puzzles in our Wordle, Spelling Bee and crossword archives.",
  "Track your stats and streaks on any device.",
];

const SubscribeModal = ({ bottomSheetRef }: SubscribeModalProps) => {
  const snapPoints = useMemo(() => ["90%"], []);
  const { dismiss } = useBottomSheetModal();
  const { bottom } = useSafeAreaInsets();
  const screenIsFocused = useIsFocused();

  // Get current color scheme (dark or light)
  const colorScheme = useColorScheme();
  const Theme = Colors[colorScheme ?? "light"];

  if (!screenIsFocused) {
    dismiss();
  }

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.2}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={dismiss}
        // Apply backdrop color based on theme
      />
    ),
    [dismiss] // Dependency on backdrop color
  );

  return (
    <BottomSheetModal
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      index={0}
      handleComponent={null}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: Theme.bottomModal, paddingBottom: bottom },
        ]}
      >
        <View style={styles.modalButtons}>
          <Link href={"/login"} asChild>
            <TouchableOpacity>
              <ThemedText style={styles.buttonText}>LOG IN</ThemedText>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity onPress={() => dismiss()}>
            <Ionicons name="close" size={28} color={Theme.closeModal} />
          </TouchableOpacity>
        </View>
        <BottomSheetScrollView>
          <ThemedText style={styles.containerHeadline}>
            Unlimited Play.{"\n"}Try free for 7 days.
          </ThemedText>
          <Image source={{ uri: gamesImageUri }} style={styles.image} />
          <View style={styles.benefitsContainer}>
            <MarkedList counterRenderer={disc} lineStyle={styles.benefitList}>
              {BENEFITS.map((value, index) => (
                <ThemedText style={styles.benefitText} key={index}>
                  {value}
                </ThemedText>
              ))}
            </MarkedList>
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheetModal>
  );
};

export default SubscribeModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  containerHeadline: {
    fontSize: 24,
    padding: 20,
    textAlign: "center",
    fontFamily: "FrankRuhlLibre_900Black",
  },
  image: {
    width: "90%",
    height: 40,
    alignSelf: "center",
  },
  benefitsContainer: {
    marginVertical: 20,
  },
  benefitList: {
    paddingHorizontal: 40,
    gap: 10,
    marginVertical: 10,
  },
  benefitText: {
    fontSize: 14,
    flexShrink: 1,
    color: "#4f4f4f",
  },
});
