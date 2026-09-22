/**
 * Gaming Event Ticketing and Registration Platform
 * Frontend JavaScript Controller
 */

// Dynamic API URL: uses window.API_BASE_URL, localStorage, localhost for local dev, or relative '/api' for Vercel rewrites
const API_URL = (typeof window !== "undefined" && window.API_BASE_URL)
  || (typeof window !== "undefined" && localStorage.getItem("API_URL"))
  || (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://localhost:8080/api"
      : "/api");

/* ===================================================
   AUTHENTICATION & LOCAL STORAGE HELPERS
   =================================================== */

function getLoggedInUser() {
  const userJson = localStorage.getItem("gaming_user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (e) {
    localStorage.removeItem("gaming_user");
    return null;
  }
}

function setLoggedInUser(user) {
  localStorage.setItem("gaming_user", JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("gaming_user");
  showToast("You have been logged out.", "info");
  setTimeout(() => {
    window.location.href = "login.html";
  }, 600);
}

function requireAuth(redirectUrl = window.location.pathname) {
  const user = getLoggedInUser();
  if (!user) {
    showToast("Please log in to continue.", "error");
    setTimeout(() => {
      window.location.href = `login.html?redirect=${encodeURIComponent(redirectUrl)}`;
    }, 800);
    return null;
  }
  return user;
}

function requireAdmin() {
  const user = requireAuth();
  if (!user) return null;
  if (user.role !== "ADMIN") {
    showToast("Access Denied: Admins only!", "error");
    setTimeout(() => {
      window.location.href = "events.html";
    }, 800);
    return null;
  }
  return user;
}

/* ===================================================
   TOAST NOTIFICATION SYSTEM
   =================================================== */

function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ===================================================
   NAVBAR DYNAMIC RENDERING
   =================================================== */

function setupNavbar() {
  const user = getLoggedInUser();
  const navLinksContainer = document.getElementById("nav-links");
  const navAuthContainer = document.getElementById("nav-auth-section");

  if (!navLinksContainer || !navAuthContainer) return;

  // Build dynamic navigation links
  let linksHtml = `
    <li><a href="index.html" class="nav-link">Home</a></li>
    <li><a href="events.html" class="nav-link">Events</a></li>
  `;

  if (user) {
    if (user.role === "ADMIN") {
      linksHtml += `<li><a href="admin.html" class="nav-link">Admin Console</a></li>`;
    } else {
      linksHtml += `<li><a href="my-bookings.html" class="nav-link">My Bookings</a></li>`;
    }

    navAuthContainer.innerHTML = `
      <div class="user-badge">
        <span>🎮 ${escapeHtml(user.name)}</span>
        <span class="role-tag ${user.role === 'ADMIN' ? 'admin' : ''}">${user.role}</span>
      </div>
      <button onclick="logout()" class="btn btn-secondary btn-sm">Logout</button>
    `;
  } else {
    navAuthContainer.innerHTML = `
      <a href="login.html" class="btn btn-secondary btn-sm">Login</a>
      <a href="register.html" class="btn btn-primary btn-sm">Register</a>
    `;
  }

  navLinksContainer.innerHTML = linksHtml;

  // Highlight active link
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ===================================================
   REGISTRATION PAGE HANDLER
   =================================================== */

async function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value;
  const role = document.getElementById("reg-role").value;

  if (!name || !email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    showToast("Registration successful! Logging you in...", "success");
    setLoggedInUser({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    });

    setTimeout(() => {
      window.location.href = data.role === "ADMIN" ? "admin.html" : "events.html";
    }, 1000);
  } catch (err) {
    showToast(err.message, "error");
  }
}

/* ===================================================
   LOGIN PAGE HANDLER
   =================================================== */

let otpEmail = "";
let resendTimer = null;

// STEP 1: email + password  ->  server emails an OTP
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    showToast("Please enter both email and password", "error");
    return;
  }

  const btn = document.getElementById("login-btn");
  btn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid credentials");
    }

    if (data.otpRequired) {
      showOtpStep(data.email || email, data.message, data.resendSeconds);
    } else {
      finishLogin(data); // (fallback if server has OTP turned off)
    }
  } catch (err) {
    showToast(err.message, "error");
  } finally {
    btn.disabled = false;
  }
}

function showOtpStep(email, message, resendSeconds) {
  otpEmail = email;
  document.getElementById("login-form").style.display = "none";
  document.getElementById("otp-form").style.display = "block";
  document.getElementById("otp-info").textContent = message || "Enter the 6-digit code we emailed you.";
  const otpInput = document.getElementById("login-otp");
  otpInput.value = "";
  otpInput.focus();
  startResendCountdown(resendSeconds || 30);
  showToast("OTP sent! Check your email.", "success");
}

function cancelOtp() {
  clearInterval(resendTimer);
  otpEmail = "";
  document.getElementById("otp-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
  document.getElementById("login-password").value = "";
}

function startResendCountdown(seconds) {
  const btn = document.getElementById("resend-btn");
  clearInterval(resendTimer);
  let left = Math.ceil(seconds);
  btn.disabled = true;
  btn.textContent = `Resend OTP (${left}s)`;
  resendTimer = setInterval(() => {
    left--;
    if (left <= 0) {
      clearInterval(resendTimer);
      btn.disabled = false;
      btn.textContent = "Resend OTP";
    } else {
      btn.textContent = `Resend OTP (${left}s)`;
    }
  }, 1000);
}

async function handleResendOtp() {
  if (!otpEmail) return;
  try {
    const response = await fetch(`${API_URL}/users/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: otpEmail })
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.resendSeconds) startResendCountdown(data.resendSeconds);
      throw new Error(data.message || "Could not resend OTP");
    }
    document.getElementById("otp-info").textContent = data.message;
    startResendCountdown(data.resendSeconds || 30);
    showToast("A new OTP has been sent.", "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}

// STEP 2: OTP  ->  logged in (server also emails a "new login" notification)
async function handleVerifyOtp(event) {
  event.preventDefault();
  const otp = document.getElementById("login-otp").value.trim();

  if (!/^\d{6}$/.test(otp)) {
    showToast("Please enter the 6-digit OTP", "error");
    return;
  }

  const btn = document.getElementById("otp-btn");
  btn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/users/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: otpEmail, otp })
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "OTP verification failed");
    }

    clearInterval(resendTimer);
    finishLogin(data);
  } catch (err) {
    showToast(err.message, "error");
    btn.disabled = false;
  }
}

function finishLogin(data) {
  setLoggedInUser({
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role
  });

  showToast(`Welcome back, ${data.name}!`, "success");

  // Check redirect query param
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");

  setTimeout(() => {
    if (redirect) {
      window.location.href = decodeURIComponent(redirect);
    } else if (data.role === "ADMIN") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "events.html";
    }
  }, 900);
}

/* ===================================================
   EVENT LISTINGS (events.html & index.html)
   =================================================== */

async function loadEvents(containerId = "events-grid", limit = 0) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
    ⚡ Loading tournament listings...
  </div>`;

  try {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) throw new Error("Could not load events from server");

    let events = await response.json();
    if (limit > 0) {
      events = events.slice(0, limit);
    }

    if (events.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--text-muted);">
          <h3>No events found</h3>
          <p>Check back later or register as Admin to create tournaments!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = events.map(event => {
      const isSoldOut = event.availableSeats <= 0;
      const isLowSeats = event.availableSeats > 0 && event.availableSeats <= 15;

      return `
        <div class="event-card">
          <div class="event-card-header">
            <span class="game-tag">${escapeHtml(event.game)}</span>
            <h3 class="event-name">${escapeHtml(event.name)}</h3>
          </div>
          <div class="event-card-body">
            <p class="event-desc">${escapeHtml(event.description || "Exciting esports event")}</p>
            <ul class="event-meta-list">
              <li class="event-meta-item">
                <span class="meta-icon">📅</span>
                <span>${escapeHtml(event.date)} at ${escapeHtml(event.time)}</span>
              </li>
              <li class="event-meta-item">
                <span class="meta-icon">📍</span>
                <span>${escapeHtml(event.venue)}</span>
              </li>
              <li class="event-meta-item">
                <span class="meta-icon">🎟️</span>
                <span><strong>${event.availableSeats}</strong> / ${event.totalSeats} seats available</span>
              </li>
            </ul>
          </div>
          <div class="event-card-footer">
            <div class="ticket-price">
              ₹${Number(event.ticketPrice).toFixed(2)} <span>/ ticket</span>
            </div>
            ${
              isSoldOut
                ? `<button class="btn btn-secondary btn-sm" disabled>Sold Out</button>`
                : `<a href="booking.html?eventId=${event.id}" class="btn btn-primary btn-sm">Book Now ⚡</a>`
            }
          </div>
        </div>
      `;
    }).join("");
  } catch (err) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--accent-red);">
        ⚠️ Failed to connect to backend at <code>${API_URL}</code>.
        <br><small>Make sure the Spring Boot server is running on port 8080.</small>
      </div>
    `;
    showToast(err.message, "error");
  }
}

/* ===================================================
   BOOKING PAGE LOGIC (booking.html)
   =================================================== */

let currentEvent = null;

async function initBookingPage() {
  const user = requireAuth();
  if (!user) return;

  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("eventId");

  if (!eventId) {
    showToast("No event selected!", "error");
    setTimeout(() => window.location.href = "events.html", 1000);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/events/${eventId}`);
    if (!response.ok) throw new Error("Event not found");

    currentEvent = await response.json();

    // Populate Event details
    document.getElementById("event-name").textContent = currentEvent.name;
    document.getElementById("event-game").textContent = currentEvent.game;
    document.getElementById("event-desc").textContent = currentEvent.description || "N/A";
    document.getElementById("event-schedule").textContent = `${currentEvent.date} @ ${currentEvent.time}`;
    document.getElementById("event-venue").textContent = currentEvent.venue;
    document.getElementById("event-price").textContent = `₹${Number(currentEvent.ticketPrice).toFixed(2)}`;
    document.getElementById("event-seats").textContent = `${currentEvent.availableSeats} of ${currentEvent.totalSeats} seats`;

    // Populate gamer details
    document.getElementById("user-name").textContent = user.name;
    document.getElementById("user-email").textContent = user.email;

    const ticketsInput = document.getElementById("tickets-count");
    ticketsInput.max = currentEvent.availableSeats;
    ticketsInput.value = 1;

    updateBookingCalculations();

    ticketsInput.addEventListener("input", updateBookingCalculations);

    if (currentEvent.availableSeats <= 0) {
      document.getElementById("confirm-booking-btn").disabled = true;
      document.getElementById("confirm-booking-btn").textContent = "Event Sold Out";
    }
  } catch (err) {
    showToast(err.message, "error");
  }
}

function updateBookingCalculations() {
  if (!currentEvent) return;
  const ticketsInput = document.getElementById("tickets-count");
  let count = parseInt(ticketsInput.value) || 0;

  if (count < 1) count = 1;
  if (count > currentEvent.availableSeats) count = currentEvent.availableSeats;
  ticketsInput.value = count;

  const pricePerTicket = currentEvent.ticketPrice;
  const totalAmount = count * pricePerTicket;

  document.getElementById("summary-tickets").textContent = count;
  document.getElementById("summary-unit-price").textContent = `₹${pricePerTicket.toFixed(2)}`;
  document.getElementById("summary-total-amount").textContent = `₹${totalAmount.toFixed(2)}`;
}

async function handleConfirmBooking(e) {
  e.preventDefault();
  const user = getLoggedInUser();
  if (!user || !currentEvent) return;

  const tickets = parseInt(document.getElementById("tickets-count").value);
  if (!tickets || tickets < 1) {
    showToast("Please enter a valid ticket count", "error");
    return;
  }

  const submitBtn = document.getElementById("confirm-booking-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing Booking...";

  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        eventId: currentEvent.id,
        tickets: tickets
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Booking failed");
    }

    showToast("🎉 Booking Confirmed Successfully!", "success");
    setTimeout(() => {
      window.location.href = "my-bookings.html";
    }, 1200);
  } catch (err) {
    showToast(err.message, "error");
    submitBtn.disabled = false;
    submitBtn.textContent = "Confirm Booking ⚡";
  }
}

/* ===================================================
   MY BOOKINGS PAGE (my-bookings.html)
   =================================================== */

async function loadUserBookings() {
  const user = requireAuth();
  if (!user) return;

  const tableBody = document.getElementById("bookings-table-body");
  if (!tableBody) return;

  tableBody.innerHTML = `
    <tr>
      <td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted);">
        ⚡ Loading your bookings...
      </td>
    </tr>
  `;

  try {
    const response = await fetch(`${API_URL}/bookings/user/${user.id}`);
    if (!response.ok) throw new Error("Failed to load your bookings");

    const bookings = await response.json();

    if (bookings.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
            You have no active bookings yet. <a href="events.html" style="color: var(--accent-cyan);">Browse Events</a>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = bookings.map(b => {
      const isCancelled = b.status === "CANCELLED";
      return `
        <tr>
          <td>#${b.id}</td>
          <td><strong>${escapeHtml(b.eventName)}</strong></td>
          <td>${b.tickets} ticket(s)</td>
          <td><strong style="color: var(--accent-green);">₹${Number(b.totalAmount).toFixed(2)}</strong></td>
          <td>
            <span class="badge ${isCancelled ? 'badge-cancelled' : 'badge-confirmed'}">
              ${b.status}
            </span>
          </td>
          <td>
            ${
              isCancelled
                ? `<button class="btn btn-secondary btn-sm" disabled>Cancelled</button>`
                : `<button onclick="cancelBooking(${b.id})" class="btn btn-danger btn-sm">Cancel Booking</button>`
            }
          </td>
        </tr>
      `;
    }).join("");
  } catch (err) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 30px; color: var(--accent-red);">
          ⚠️ Error: ${err.message}
        </td>
      </tr>
    `;
    showToast(err.message, "error");
  }
}

async function cancelBooking(bookingId) {
  if (!confirm(`Are you sure you want to cancel booking #${bookingId}? Tickets will be returned to the event pool.`)) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to cancel booking");
    }

    showToast(data.message || "Booking cancelled successfully", "success");
    loadUserBookings();
  } catch (err) {
    showToast(err.message, "error");
  }
}

/* ===================================================
   ADMIN CONSOLE (admin.html)
   =================================================== */

async function initAdminPage() {
  const user = requireAdmin();
  if (!user) return;

  loadAdminEvents();
  loadAdminBookings();
}

async function loadAdminEvents() {
  const tableBody = document.getElementById("admin-events-tbody");
  if (!tableBody) return;

  try {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) throw new Error("Could not load events");

    const events = await response.json();
    document.getElementById("stat-total-events").textContent = events.length;

    if (events.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No events created yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = events.map(e => `
      <tr>
        <td>#${e.id}</td>
        <td><strong>${escapeHtml(e.name)}</strong></td>
        <td><span class="game-tag" style="margin:0;">${escapeHtml(e.game)}</span></td>
        <td>${escapeHtml(e.date)} ${escapeHtml(e.time)}</td>
        <td>₹${Number(e.ticketPrice).toFixed(2)}</td>
        <td>${e.availableSeats} / ${e.totalSeats}</td>
        <td>
          <button onclick="openEditEventModal(${e.id})" class="btn btn-secondary btn-sm" style="margin-right: 6px;">Edit</button>
          <button onclick="deleteEvent(${e.id})" class="btn btn-danger btn-sm">Delete</button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function loadAdminBookings() {
  const tableBody = document.getElementById("admin-bookings-tbody");
  if (!tableBody) return;

  try {
    const response = await fetch(`${API_URL}/bookings`);
    if (!response.ok) throw new Error("Could not load bookings");

    const bookings = await response.json();
    document.getElementById("stat-total-bookings").textContent = bookings.length;

    const totalRevenue = bookings
      .filter(b => b.status === "CONFIRMED")
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    document.getElementById("stat-total-revenue").textContent = `₹${totalRevenue.toFixed(2)}`;

    if (bookings.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No bookings recorded yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = bookings.map(b => `
      <tr>
        <td>#${b.id}</td>
        <td>${escapeHtml(b.userName)} (ID: ${b.userId})</td>
        <td>${escapeHtml(b.eventName)}</td>
        <td>${b.tickets}</td>
        <td>₹${Number(b.totalAmount).toFixed(2)}</td>
        <td>
          <span class="badge ${b.status === 'CONFIRMED' ? 'badge-confirmed' : 'badge-cancelled'}">
            ${b.status}
          </span>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    showToast(err.message, "error");
  }
}

function openAddEventModal() {
  document.getElementById("event-modal-title").textContent = "Add New Gaming Event";
  document.getElementById("event-form").reset();
  document.getElementById("event-id-hidden").value = "";
  document.getElementById("event-modal").classList.add("active");
}

async function openEditEventModal(eventId) {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}`);
    if (!response.ok) throw new Error("Event not found");

    const event = await response.json();
    document.getElementById("event-modal-title").textContent = "Update Gaming Event";
    document.getElementById("event-id-hidden").value = event.id;
    document.getElementById("m-name").value = event.name;
    document.getElementById("m-game").value = event.game;
    document.getElementById("m-description").value = event.description || "";
    document.getElementById("m-date").value = event.date;
    document.getElementById("m-time").value = event.time;
    document.getElementById("m-venue").value = event.venue;
    document.getElementById("m-price").value = event.ticketPrice;
    document.getElementById("m-seats").value = event.totalSeats;

    document.getElementById("event-modal").classList.add("active");
  } catch (err) {
    showToast(err.message, "error");
  }
}

function closeEventModal() {
  document.getElementById("event-modal").classList.remove("active");
}

async function handleSaveEvent(e) {
  e.preventDefault();
  const id = document.getElementById("event-id-hidden").value;

  const payload = {
    name: document.getElementById("m-name").value.trim(),
    game: document.getElementById("m-game").value.trim(),
    description: document.getElementById("m-description").value.trim(),
    date: document.getElementById("m-date").value,
    time: document.getElementById("m-time").value,
    venue: document.getElementById("m-venue").value.trim(),
    ticketPrice: parseFloat(document.getElementById("m-price").value),
    totalSeats: parseInt(document.getElementById("m-seats").value)
  };

  const isUpdate = !!id;
  const url = isUpdate ? `${API_URL}/events/${id}` : `${API_URL}/events`;
  const method = isUpdate ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save event");
    }

    showToast(isUpdate ? "Event updated successfully!" : "New event published!", "success");
    closeEventModal();
    loadAdminEvents();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function deleteEvent(eventId) {
  if (!confirm(`Are you sure you want to delete event #${eventId}? This cannot be undone.`)) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete event");
    }

    showToast("Event deleted successfully", "success");
    loadAdminEvents();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Global auto-init on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  setupNavbar();
});
