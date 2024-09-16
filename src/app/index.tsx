import { SignedIn, SignedOut, useClerk } from "@clerk/clerk-expo";
import SubscribeModal from "@components/SubscribeModal";
import { ThemedText } from "@components/ThemedText";
import { Colors } from "@constants/Colors";
import { logoImageUri } from "@constants/Images";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { Link } from "expo-router";
import React, { useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function MenuScreen() {
  const colorScheme = useColorScheme();
  const Theme = Colors[colorScheme ?? "light"];
  const subscribeModalRef = useRef<BottomSheetModal>(null);
  const { signOut } = useClerk();

  const handlePresentModal = () => {
    subscribeModalRef.current?.present();
  };

  return (
    <View style={[styles.container, { backgroundColor: Theme.background }]}>
      <View style={styles.header}>
        <Image style={styles.image} source={{ uri: logoImageUri }} />
        <ThemedText style={styles.title}>Wordle</ThemedText>
        <ThemedText style={styles.text}>
          Get 6 changes to guess 5-letter word
        </ThemedText>
      </View>

      <View style={styles.menu}>
        <Link
          asChild
          href={"/game"}
          style={[styles.button, { backgroundColor: Theme.playBtn }]}
        >
          <TouchableOpacity>
            <Text style={[styles.buttonText, styles.primaryText]}>Play</Text>
          </TouchableOpacity>
        </Link>
        <SignedOut>
          <Link
            asChild
            href={"/login"}
            style={[styles.button, { borderColor: Theme.text }]}
          >
            <TouchableOpacity>
              <ThemedText style={styles.buttonText}>Log in</ThemedText>
            </TouchableOpacity>
          </Link>
        </SignedOut>

        <SignedIn>
          <TouchableOpacity
            style={[styles.button, { borderColor: Theme.text }]}
            onPress={() => signOut()}
          >
            <ThemedText style={styles.buttonText}>Sign out</ThemedText>
          </TouchableOpacity>
        </SignedIn>

        <TouchableOpacity
          style={[styles.button, { borderColor: Theme.text }]}
          onPress={handlePresentModal}
        >
          <ThemedText style={styles.buttonText}>Subscribe</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerDate}>
          {format(new Date(), "MMMM d, yyyy")}
        </ThemedText>
        <ThemedText style={styles.footerText}>No. 1151</ThemedText>
        <ThemedText style={styles.footerText}>Edited by Jair Guzman</ThemedText>
        <Link href={"https://www.youtube.com/@galaxies_dev"} asChild>
          <TouchableOpacity>
            <ThemedText style={[styles.footerText, styles.credits]}>
              With help of Simon Grimm
            </ThemedText>
          </TouchableOpacity>
        </Link>
      </View>

      <SubscribeModal bottomSheetRef={subscribeModalRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 50,
    gap: 40,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: "#FFF",
    borderRadius: 11,
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: "FrankRuhlLibre_800ExtraBold",
  },
  menu: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  button: {
    justifyContent: "center",
    borderRadius: 30,
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 1,
    width: "60%",
    maxHeight: 200,
  },
  buttonText: {
    padding: 14,
    fontSize: 15,
    fontWeight: "semibold",
  },
  primaryText: {
    color: "#fff",
  },
  text: {
    fontSize: 26,
    textAlign: "center",
    fontFamily: "FrankRuhlLibre_500Medium",
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
  footerDate: {
    fontSize: 14,
    fontWeight: "bold",
  },
  credits: {
    color: "blue",
    paddingTop: 10,
    textDecorationLine: "underline",
  },
});
