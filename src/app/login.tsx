import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
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

  const onSelectAuth = async (strategy: Strategy) => {};
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
});
