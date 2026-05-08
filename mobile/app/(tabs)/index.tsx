import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";

import { useState } from "react";
import { io, Socket } from "socket.io-client";
import { useKeepAwake } from "expo-keep-awake";

export default function App() {
  useKeepAwake();

  const [ip, setIp] = useState("192.168.0.30:3000");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const connectToServer = () => {
    if (connected) return; // 🔒 evita doble conexión

    const newSocket = io(`http://${ip}`, {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Conectado al servidor");
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Desconectado");
      setConnected(false);
    });

    setSocket(newSocket);
  };

  // 🔥 INPUTS TIPO TP2 (keydown / keyup)
  const pressKey = (key: string) => {
    if (!socket || !connected) return;

    socket.emit("keydown", { key });
  };

  const releaseKey = (key: string) => {
    if (!socket || !connected) return;

    socket.emit("keyup", { key });
  };

  const jump = () => {
    if (!socket || !connected) return;

    socket.emit("keydown", { key: "jump" });
    socket.emit("keyup", { key: "jump" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GAMEPAD</Text>

      {/* 🔴🟢 LED CONEXIÓN */}
      <View
        style={[
          styles.led,
          { backgroundColor: connected ? "#2ecc71" : "#e74c3c" },
        ]}
      />

      <Text style={styles.status}>
        {connected ? "CONECTADO" : "DESCONECTADO"}
      </Text>

      {/* IP MANUAL */}
      <TextInput
        style={styles.input}
        placeholder="192.168.0.30:3000"
        placeholderTextColor="#999"
        value={ip}
        onChangeText={setIp}
      />

      <Pressable
        style={[
          styles.connectButton,
          { opacity: connected ? 0.5 : 1 },
        ]}
        onPress={connectToServer}
        disabled={connected}
      >
        <Text style={styles.connectText}>CONECTAR</Text>
      </Pressable>

      {/* CONTROLES */}
      <View style={styles.row}>
        <Pressable
          style={styles.button}
          onPressIn={() => pressKey("left")}
          onPressOut={() => releaseKey("left")}
        >
          <Text style={styles.text}>←</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPressIn={() => pressKey("right")}
          onPressOut={() => releaseKey("right")}
        >
          <Text style={styles.text}>→</Text>
        </Pressable>
      </View>

      {/* SALTO */}
      <Pressable style={styles.jump} onPress={jump}>
        <Text style={styles.text}>A</Text>
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
    gap: 20,
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
  },

  status: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  led: {
    width: 14,
    height: 14,
    borderRadius: 10,
  },

  input: {
    width: "90%",
    backgroundColor: "#222",
    color: "white",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
  },

  connectButton: {
    backgroundColor: "#9b59b6",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
  },

  connectText: {
    color: "white",
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    gap: 20,
  },

  button: {
    width: 100,
    height: 100,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },

  jump: {
    width: 120,
    height: 120,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
  },

  text: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
});