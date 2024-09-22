import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import {
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_900Black,
  useFonts,
} from "@expo-google-fonts/frank-ruhl-libre";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { tokenCache } from "@utils/cache";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import {
  Image,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Colors } from "../constants/Colors";
import { nytLogoImageDarkUri, nytLogoImageUri } from "../constants/Images";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const Theme = Colors[colorScheme ?? "light"];
  const [loaded, error] = useFonts({
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_900Black,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="game"
                  options={{
                    headerBackTitle: "Wordle",
                    headerTitle: Platform.OS === "ios" ? "" : "Wordle",
                    headerBackTitleStyle: {
                      fontFamily: "FrankRuhlLibre_800ExtraBold",
                      fontSize: 26,
                    },
                    headerTitleStyle:
                      Platform.OS === "ios"
                        ? undefined
                        : {
                            fontFamily: "FrankRuhlLibre_800ExtraBold",
                            fontSize: 26,
                          },
                  }}
                />
                <Stack.Screen
                  name="login"
                  options={{
                    presentation: "modal",
                    headerShadowVisible: true,
                    headerTitleAlign: "center",
                    headerTitle: () => (
                      <Image
                        resizeMode="contain"
                        style={{
                          width: 150,
                          height: 50,
                        }}
                        source={{
                          uri:
                            colorScheme === "dark"
                              ? nytLogoImageDarkUri
                              : nytLogoImageUri,
                        }}
                      />
                    ),
                    headerBackVisible: false,
                    headerLeft: () => (
                      <TouchableOpacity onPress={() => router.dismiss()}>
                        <Ionicons
                          name="close"
                          size={26}
                          color={Theme.closeModal}
                        />
                      </TouchableOpacity>
                    ),
                  }}
                />
                <Stack.Screen
                  name="oauth-native-callback"
                  options={{ headerShown: false }}
                />
              </Stack>
            </BottomSheetModalProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
