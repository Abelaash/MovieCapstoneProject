import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NavBar = ({ navigation, activeScreen }) => {
  const getIconStyle = (screenName) => {
    return activeScreen === screenName ? { color: "#fff" } : { color: "#aaa" };
  };

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Dashboard")}
        style={styles.navItem}
      >
        <Ionicons name="home-outline" size={28} style={getIconStyle("Dashboard")} />
        <Text style={[styles.navLabel, activeScreen === "Dashboard" && styles.activeLabel]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Search")}
        style={styles.navItem}
      >
        <Ionicons name="search-outline" size={28} style={getIconStyle("Search")} />
        <Text style={[styles.navLabel, activeScreen === "Search" && styles.activeLabel]}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("AIChat")}
        style={styles.navItem}
      >
        <Ionicons name="robot-outline" size={28} style={getIconStyle("AIChat")} />
        <Text style={[styles.navLabel, activeScreen === "AIChat" && styles.activeLabel]}>AI Chat</Text>
      </TouchableOpacity>

      {/* New Settings Icon */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Settings")}
        style={styles.navItem}
      >
        <Ionicons name="settings-outline" size={28} style={getIconStyle("Settings")} />
        <Text style={[styles.navLabel, activeScreen === "Settings" && styles.activeLabel]}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  activeLabel: {
    color: "#f0f0f0", // Active state color for labels
    fontWeight: "bold", // Makes the active label stand out
  },
});

export default NavBar;
