const socket = io("http://192.168.0.30:3000", {
  query: {
    host: "true",
  },
});

export default socket;