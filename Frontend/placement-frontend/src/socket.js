// src/socket.js
import { io } from "socket.io-client";
const socket = io("http://localhost:5009"); // or your deployed backend
export default socket;
