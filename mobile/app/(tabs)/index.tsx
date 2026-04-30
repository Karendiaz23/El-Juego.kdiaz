import { Text, View, Pressable, StyleSheet } from "react-native";
import { io } from "socket.io-client";

// ✅ IMPORTANTE: URL bien escrita
const socket = io("http://192.168.0.30:3000");

export default function App() {

  // ✅ confirmar conexión
  socket.on("connect", () => {
    console.log("CONECTADO AL SERVER");
  });

  const move = (direction: string) => {
    let movement = { x: 0, y: 0 };

    if (direction === "left") movement.x = -10;
    if (direction === "right") movement.x = 10;
    if (direction === "up") movement.y = -10;

    console.log("ENVIANDO:", movement); // debug

    socket.emit("move", movement);
  };

  return (
    <View style={styles.container}>
      <Text>Control</Text>

      <Pressable style={styles.button} onPress={() => move("left")}>
        <Text style={styles.text}>←</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => move("right")}>
        <Text style={styles.text}>→</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => move("up")}>
        <Text style={styles.text}>↑</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 20,
    margin: 10,
    backgroundColor: "lightblue",
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
  },
});