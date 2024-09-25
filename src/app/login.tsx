import { useOAuth } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { ThemedText } from "../components/ThemedText";
import { Colors } from "../constants/Colors";
import { defaultStyles } from "../constants/Styles";

enum Strategy {
  Google = "oauth_google",
  Apple = "oauth_apple",
  Facebook = "oauth_facebook",
}

const LoginScreen = () => {
  const colorScheme = useColorScheme();
  const Theme = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const { startOAuthFlow: googleAuth } = useOAuth({
    strategy: Strategy.Google,
  });
  const { startOAuthFlow: appleAuth } = useOAuth({
    strategy: Strategy.Apple,
  });
  const { startOAuthFlow: facebookAuth } = useOAuth({
    strategy: Strategy.Facebook,
  });

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      [Strategy.Facebook]: facebookAuth,
      [Strategy.Apple]: appleAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        if (Platform.OS === "ios") router.back();
      }
    } catch (error) {
      console.log("Error starting 0Auth flow", error);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <ThemedText style={styles.header}>Login in or create account</ThemedText>
      <ThemedText style={[styles.subText, { color: Theme.descriptionText }]}>
        By continuing, you agree to the Terms of Sales, Terms of Service, and
        Privacy Policy
      </ThemedText>
      <ThemedText style={styles.inputLabel}>Email</ThemedText>
      <TextInput
        style={[
          styles.input,
          { borderColor: Theme.textInput, color: Theme.text },
        ]}
        placeholder="Email"
        placeholderTextColor={"#808080"}
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={[defaultStyles.btn, { backgroundColor: Theme.text }]}
      >
        <ThemedText
          style={[defaultStyles.btnText, { color: Theme.background }]}
        >
          Continue
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.separatorView}>
        <View style={[styles.separatorLine, { borderColor: Theme.text }]} />
        <ThemedText
          style={[styles.separatorText, { color: Theme.descriptionText }]}
        >
          or
        </ThemedText>
        <View style={[styles.separatorLine, { borderColor: Theme.text }]} />
      </View>
      <View style={{ gap: 20 }}>
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.circleButton,
              { backgroundColor: Theme.bottomModal, borderColor: Theme.text },
            ]}
            onPress={() => onSelectAuth(Strategy.Google)}
          >
            <Ionicons name="logo-google" size={24} color={Theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.circleButton,
              { backgroundColor: Theme.bottomModal, borderColor: Theme.text },
            ]}
            onPress={() => onSelectAuth(Strategy.Facebook)}
          >
            <Ionicons name="logo-facebook" size={24} color={Theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.circleButton,
              { backgroundColor: Theme.bottomModal, borderColor: Theme.text },
            ]}
            onPress={() => onSelectAuth(Strategy.Apple)}
          >
            <Ionicons name="logo-apple" size={24} color={Theme.text} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 30,
    paddingBottom: 20,
    textAlign: "center",
  },
  subText: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 30,
  },
  inputLabel: {
    paddingBottom: 5,
    fontWeight: 500,
  },
  input: {
    height: 50,
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  separatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  separatorText: {
    fontSize: 16,
  },
  separatorLine: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  circleButton: {
    width: 60, // Ajusta el tamaño según lo que necesites
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000", // Puedes ajustar el color de borde según el tema
  },
});
