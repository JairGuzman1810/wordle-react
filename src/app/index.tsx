import { format } from "date-fns";
import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { logoImageUri } from "../constants/Images";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.image} source={{ uri: logoImageUri }} />
        <Text style={styles.title}>Wordle</Text>
        <Text style={styles.text}>Get 6 changes to guess 5-letter word</Text>
      </View>

      <View style={styles.menu}>
        <Link
          asChild
          href={"/game"}
          style={[styles.button, { backgroundColor: "#000" }]}
        >
          <TouchableOpacity>
            <Text style={[styles.buttonText, styles.primaryText]}>Play</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Subscribe</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerDate}>
          {format(new Date(), "MMMM d, yyyy")}
        </Text>
        <Text style={styles.footerText}>No. 1151</Text>
        <Text style={styles.footerText}>Edited by Jair Guzman</Text>
        <Link href={"https://www.youtube.com/@galaxies_dev"} asChild>
          <TouchableOpacity>
            <Text style={[styles.footerText, styles.credits]}>
              With help of Simon Grimm
            </Text>
          </TouchableOpacity>
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
    color: "#333",
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
