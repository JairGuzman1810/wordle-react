import { Colors } from "@constants/Colors";
import { gamesImageUri } from "@constants/Images";
import { defaultStyles } from "@constants/Styles";
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
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <ThemedText style={styles.containerHeadline}>
            Unlimited Play.{"\n"}Try free for 7 days.
          </ThemedText>
          <Image source={{ uri: gamesImageUri }} style={styles.image} />
          <View style={styles.benefitsContainer}>
            <MarkedList counterRenderer={disc} lineStyle={styles.benefitList}>
              {BENEFITS.map((value, index) => (
                <ThemedText
                  style={[styles.benefitText, { color: Theme.descriptionText }]}
                  key={index}
                >
                  {value}
                </ThemedText>
              ))}
            </MarkedList>
          </View>
          <ThemedText
            style={[styles.disclaimerText, { color: Theme.descriptionText }]}
          >
            If you subscribe to The New York Times via this app, payment for
            your subscription will be automatically charged to your Apple ID
            account upon your confirmation of purchase with Apple. Your Apple ID
            account will be automatically charged for renewal at the applicable
            rate shown to you at the time of subscription every calendar month
            (for monthly subscriptions) or every year (for annual subscriptions)
            within 24-hours prior to the start of your next billing period. For
            special introductory offers, you will be automatically charged the
            applicable introductory rate shown to you at the time of
            subscription for the stated introductory period and the standard
            rate rate shown to you at the time of subscription thereafter. You
            will be charged in advance. Subscriptions continue automatically
            until you cancel. Cancellation takes effect at the end of your
            current billing period. You can manage and cancel subscriptions in
            your account settings on the App Store. To cancel, please turn off
            auto-renew at lead; 24-hours before the end of your current billing
            period from your iTunes account settings.
          </ThemedText>
        </BottomSheetScrollView>
      </View>
      <View
        style={[
          styles.footer,
          { paddingBottom: bottom, backgroundColor: Theme.bottomModal },
        ]}
      >
        <TouchableOpacity style={defaultStyles.btn}>
          <Text style={defaultStyles.btnText}>Try 7 days free</Text>
        </TouchableOpacity>
        <ThemedText
          style={[styles.footerText, { color: Theme.descriptionText }]}
        >
          2,99 €/month after 7-day trial. Cancel anytime.
        </ThemedText>
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
  },
  disclaimerText: {
    fontSize: 12,
    fontWeight: "bold",
    marginHorizontal: 30,
    lineHeight: 18,
    marginBottom: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4, // Negative value to move the shadow to the top
    },
    shadowOpacity: 0.3, // Slightly higher for more prominence
    shadowRadius: 5, // Wider shadow
    elevation: 30, // Higher elevation for Android
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    paddingTop: 10,
  },
});
