import { Colors } from "@constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { storage } from "../utils/storage";
import { ThemedText } from "./ThemedText";

type SettingsModalProps = {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
};

const SettingsModal = ({ bottomSheetRef }: SettingsModalProps) => {
  const snapPoints = useMemo(() => ["50%"], []);
  const { dismiss } = useBottomSheetModal();
  const { bottom } = useSafeAreaInsets();
  const screenIsFocused = useIsFocused();

  const [hard, setHard] = useMMKVBoolean("hard-mode", storage);
  const [dark, setDark] = useMMKVBoolean("dark-mode", storage);
  const [contrast, setContrast] = useMMKVBoolean("contrast-mode", storage);

  const toggleHard = () => setHard(!hard);
  const toggleDark = () => setDark(!dark);
  const toggleContrast = () => setContrast(!contrast);

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
          <ThemedText style={styles.containerHeadline}>SETTINGS</ThemedText>
          <TouchableOpacity onPress={() => dismiss()}>
            <Ionicons name="close" size={28} color={Theme.closeModal} />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            {/* NOT IMPLEMENTED */}
            <ThemedText style={styles.rowTexBig}>Hard Mode</ThemedText>
            <ThemedText
              style={[styles.rowTexSmall, { color: Theme.descriptionText }]}
            >
              Words are longer and harder
            </ThemedText>
          </View>
          <Switch
            onValueChange={toggleHard}
            value={hard}
            trackColor={{ true: Theme.text, false: Theme.gray }}
            thumbColor={Theme.background}
            ios_backgroundColor={Theme.gray}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <ThemedText style={styles.rowTexBig}>Dark Mode</ThemedText>
            <ThemedText
              style={[styles.rowTexSmall, { color: Theme.descriptionText }]}
            >
              Change the app's theme
            </ThemedText>
          </View>
          <Switch
            onValueChange={toggleDark}
            value={dark}
            trackColor={{ true: Theme.text, false: Theme.gray }}
            thumbColor={Theme.background}
            ios_backgroundColor={Theme.gray}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            {/* NOT IMPLEMENTED */}
            <ThemedText style={styles.rowTexBig}>High Contrast Mode</ThemedText>
            <ThemedText
              style={[styles.rowTexSmall, { color: Theme.descriptionText }]}
            >
              Increase contrast for better visibility
            </ThemedText>
          </View>
          <Switch
            onValueChange={toggleContrast}
            value={contrast}
            trackColor={{ true: Theme.text, false: Theme.gray }}
            thumbColor={Theme.background}
            ios_backgroundColor={Theme.gray}
          />
        </View>
      </View>
    </BottomSheetModal>
  );
};

export default SettingsModal;

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
  containerHeadline: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#888",
  },
  rowText: {
    flex: 1,
  },
  rowTexBig: {
    fontSize: 18,
  },
  rowTexSmall: {
    fontSize: 14,
  },
});
