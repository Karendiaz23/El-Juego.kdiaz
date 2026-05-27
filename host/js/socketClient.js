const socket = io("http://10.56.2.28:3000", {
  query: {
    host: "true",
  },
});

export default socket;