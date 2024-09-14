import { Link } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { logoImageUri } from "../constants/Images";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.image} source={{ uri: logoImageUri }} />
        <Text style={styles.title}>Wordle</Text>
        <Text style={styles.text}>Get 6 changes to guess 5-letter word</Text>
      </View>

      <View>
        <Text style={styles.text}>Start a new game</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.text}>Made by Jair Guzman</Text>
        <Link
          style={[styles.text, styles.credits]}
          href={"https://www.youtube.com/@galaxies_dev"}
          asChild
        >
          <Text>With help of Simon Grimm</Text>
        </Link>
      </View>
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
    backgroundColor: "#FFFFFFF",
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
  menu: {},
  text: {
    fontSize: 26,
    textAlign: "center",
    fontFamily: "FrankRuhlLibre_500Medium",
  },
  footer: {},
  credits: {
    color: "blue",
  },
});
