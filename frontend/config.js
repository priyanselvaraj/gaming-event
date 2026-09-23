// Configuration for Gaming Event Platform
// Uses localhost when running locally, and your live Render backend when deployed to Vercel:
window.API_BASE_URL = (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
  ? "http://localhost:8080/api"
  : "https://gaming-event.onrender.com/api";

