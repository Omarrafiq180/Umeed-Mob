// ===== SWITCH HERE =====
// true  = mock data (the app runs without the backend API)
// false = real API (once the backend API is ready)
export const USE_MOCK = true;

// localhost does not work on a phone/emulator. Use your laptop's IP address
// (Windows: run `ipconfig` in a terminal and read the IPv4 Address) or the deployed URL.
// For the Android emulator use your laptop's IP or http://10.0.2.2:5000/api
export const API_URL = "http://192.168.1.5:5000/api";