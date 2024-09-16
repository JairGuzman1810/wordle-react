import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors"; // Assuming this is the same Colors used in Index.tsx

type SubscribeModalProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
};

const SubscribeModal = ({ bottomSheetRef }: SubscribeModalProps) => {
  const snapPoints = useMemo(() => ["90%"], []);
  const { dismiss } = useBottomSheetModal();
  const { bottom } = useSafeAreaInsets();

  // Get current color scheme (dark or light)
  const colorScheme = useColorScheme();
  const Theme = Colors[colorScheme ?? "light"];

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
        <Text style={[styles.text, { color: Theme.text }]}>
          Subscribe to our newsletter!
        </Text>
      </View>
    </BottomSheetModal>
  );
};

export default SubscribeModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderTopRightRadius: 30,
    borderTopStartRadius: 30,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});
