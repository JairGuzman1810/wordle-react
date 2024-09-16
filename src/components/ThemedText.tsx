import { Colors } from "@constants/Colors";
import { Text, useColorScheme, type TextProps } from "react-native";

export function ThemedText({ style, children, ...rest }: TextProps) {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"].text;

  return (
    <Text style={[{ color }, style]} {...rest}>
      {children}
    </Text>
  );
}
