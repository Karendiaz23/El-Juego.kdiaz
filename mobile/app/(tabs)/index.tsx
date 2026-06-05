import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useKeepAwake } from "expo-keep-awake";

import { CameraView, useCameraPermissions } from "expo-camera";

export default function App() {
  useKeepAwake();

  const [ip, setIp] = useState("192.168.0.30:3000");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  const onQrScanned = ({ data }: { data: string }) => {
    let limpiaIp = data
      .replace("http://", "")
      .replace("https://", "");

    setIp(limpiaIp);
    setScanning(false);
  };

  const connectToServer = () => {
    if (socket) {
      socket.disconnect();
    }
  
    console.log("Intentando conectar a:", `http://${ip}`);
  
    const newSocket = io(`http://${ip}`, {
      transports: ["websocket"],
      forceNew: true,
      timeout: 10000,
    });
  
    newSocket.on("connect", () => {
      console.log("✅ CONECTADO");
  
      Alert.alert(
        "Conectado",
        "El celular se conectó correctamente al servidor."
      );
  
      setConnected(true);
    });
  
    newSocket.on("disconnect", () => {
      console.log("❌ DESCONECTADO");
      setConnected(false);
    });
  
    newSocket.on("connect_error", (err) => {
      console.log("🔥 ERROR COMPLETO");
      console.log(JSON.stringify(err));
  
      Alert.alert(
        "ERROR",
        JSON.stringify(err)
      );
  
      setConnected(false);
    });
  
    setSocket(newSocket);
  };

   

 

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

    setTimeout(() => {
      socket.emit("keyup", { key: "jump" });
    }, 50);
  };

  if (!permission) return <View />;

  if (scanning && permission.granted) {
    return (
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={onQrScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.cameraOverlay}>
          <Text style={styles.scanText}>
            Escaneando QR...
          </Text>

          <Pressable
            style={styles.cancelButton}
            onPress={() => setScanning(false)}
          >
            <Text style={{ color: "white" }}>
              Cancelar
            </Text>
          </Pressable>
        </View>
      </CameraView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GAMEPAD</Text>

      <View
        style={[
          styles.led,
          {
            backgroundColor: connected
              ? "#2ecc71"
              : "#e74c3c",
          },
        ]}
      />

      <Text style={styles.status}>
        {connected
          ? "CONECTADO"
          : "DESCONECTADO"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="192.168.0.30:3000"
        placeholderTextColor="#999"
        value={ip}
        onChangeText={setIp}
      />

      <Pressable
        style={styles.scanButton}
        onPress={() => setScanning(true)}
      >
        <Text style={styles.connectText}>
          ESCANEAR QR
        </Text>
      </Pressable>

      <Pressable
        style={styles.connectButton}
        onPress={connectToServer}
      >
        <Text style={styles.connectText}>
          CONECTAR
        </Text>
      </Pressable>

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

      <Pressable
        style={styles.jump}
        onPress={jump}
      >
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

  scanButton: {
    backgroundColor: "#f39c12",
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

  cameraOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  scanText: {
    color: "white",
    fontSize: 20,
    marginBottom: 20,
  },

  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
  },
});