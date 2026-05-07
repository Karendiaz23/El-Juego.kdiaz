import { Text, View, Pressable, StyleSheet } from "react-native";

import { io } from "socket.io-client";

const socket = io("http://10.56.2.38:3000", {
  transports: ["websocket"],
});

export default function App() {
  const move = (direction: string) => {
    let movement = {
      x: 0,
      jump: false,
    };

    if (direction === "left") {
      movement.x = -6;
    }

    if (direction === "right") {
      movement.x = 6;
    }

    if (direction === "jump") {
      movement.jump = true;
    }

    socket.emit("move", movement);
  };

  const stop = () => {
    socket.emit("stop");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CONTROL</Text>

      <View style={styles.row}>
        <Pressable
          style={styles.button}
          onPressIn={() => move("left")}
          onPressOut={stop}
        >
          <Text style={styles.text}>←</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPressIn={() => move("right")}
          onPressOut={stop}
        >
          <Text style={styles.text}>→</Text>
        </Pressable>
      </View>

      <Pressable style={styles.jump} onPress={() => move("jump")}>
        <Text style={styles.text}>↑</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    gap: 25,
  },

  button: {
    width: 110,
    height: 110,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },

  jump: {
    width: 130,
    height: 130,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 70,
  },

  text: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
  },
});
