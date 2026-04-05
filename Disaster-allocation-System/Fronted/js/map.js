// Initialize map
const map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load existing disasters
async function loadDisasters() {
  try {
    const response = await fetch("http://127.0.0.1:8000/disaster/disaster");
    const data = await response.json();

    data.forEach(d => {
      if (d.lat && d.lng) {
        let color = "green";
        if (d.severity === "High") color = "red";
        else if (d.severity === "Medium") color = "orange";

        const marker = L.circleMarker([d.lat, d.lng], {
          radius: 8,
          color: color,
          fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`
          <b>${d.type}</b><br>
          📍 ${d.location}<br>
          ⚠️ Severity: ${d.severity}<br>
          👥 ${d.description}
        `);
      }
    });

  } catch (err) {
    console.error("Map error:", err);
  }
}

window.onload = loadDisasters;

// Back button logic
function setBackButton() {
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role");

  const backBtn = document.getElementById("backBtn");

  if (role === "admin") {
    backBtn.href = "admin-dashboard.html";
    backBtn.textContent = "⬅ Back to Admin";
  } else if (role === "volunteer") {
    backBtn.href = "volunteer-dashboard.html";
    backBtn.textContent = "⬅ Back to Volunteer";
  } else {
    backBtn.href = "home.html";
    backBtn.textContent = "⬅ Back Home";
  }
}

setBackButton();

// Dynamic marker for volunteer submit
function updateMapMarker(lat, lng, location, type, severity, people) {
  let color = "green";
  if (severity === "High") color = "red";
  else if (severity === "Medium") color = "orange";

  const marker = L.circleMarker([lat, lng], {
    radius: 8,
    color: color,
    fillOpacity: 0.8
  }).addTo(map);

  marker.bindPopup(`
    <b>${type}</b><br>
    📍 ${location}<br>
    ⚠️ Severity: ${severity}<br>
    👥 People affected: ${people}
  `).openPopup();

  map.setView([lat, lng], 12);
}

window.updateMapMarker = updateMapMarker;