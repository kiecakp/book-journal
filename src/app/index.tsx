import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>📚 Book Diary</Text>

      <View style={styles.header}>
        <Text style={styles.arrow}>←</Text>

        <Text style={styles.month}>SIERPIEŃ 2026</Text>

        <Text style={styles.arrow}>→</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },

  logo: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  arrow: {
    fontSize: 40,
  },

  month: {
    fontSize: 20,
    fontWeight: "700",
  },
});
