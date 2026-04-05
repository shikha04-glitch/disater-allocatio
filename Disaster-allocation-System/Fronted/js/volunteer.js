// 🎨 URGENCY COLOR
function setUrgencyColor() {
  const select = document.getElementById("urgency");
  const value = select.value;

  if (value === "High") {
    select.style.backgroundColor = "#ef4444";
    select.style.color = "white";
  } else if (value === "Medium") {
    select.style.backgroundColor = "#f59e0b";
    select.style.color = "black";
  } else {
    select.style.backgroundColor = "#22c55e";
    select.style.color = "white";
  }
}

// 🚀 SUBMIT FORM
async function submitAll() {
  const type = document.getElementById("disasterType").value.trim();
  const location = document.getElementById("areaName").value.trim();
  const people = document.getElementById("peopleCount").value.trim();
  const severity = document.getElementById("urgency").value;
  const resource = document.getElementById("resourceType").value.trim();
  const quantity = document.getElementById("resourceQty").value.trim();

  if (!type || !location || !people || !resource || !quantity) {
    alert("Please fill all fields");
    return;
  }

  try {
    // 🔍 GEOCODE LOCATION
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      alert("Location not found on map!");
      return;
    }

    const lat = parseFloat(geoData[0].lat);
    const lng = parseFloat(geoData[0].lon);

    // ✅ POST TO BACKEND
    await fetch("http://127.0.0.1:8000/disaster/disasters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: type,
        location: location,
        severity: severity,
        description: `People affected: ${people}`,
        lat: lat,
        lng: lng
      })
    });

    await fetch("http://127.0.0.1:8000/admin/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resource: resource,
        quantity: parseInt(quantity),
        area: location,
        requested_by: "Volunteer"
      })
    });

    alert("Submitted Successfully ✅");

    // 🧹 CLEAR FORM
    document.getElementById("disasterType").value = "";
    document.getElementById("areaName").value = "";
    document.getElementById("peopleCount").value = "";
    document.getElementById("urgency").value = "Low";
    document.getElementById("resourceType").value = "";
    document.getElementById("resourceQty").value = "";
    setUrgencyColor();

    // 🔄 REFRESH TABLE + MAP
    loadDisasters();
    if (window.updateMapMarker) updateMapMarker(lat, lng, location, type, severity, people);

  } catch (err) {
    console.error("Error submitting:", err);
    alert("Submission failed ❌");
  }
}

// 📊 LOAD TABLE
async function loadDisasters() {
  try {
    const disasterRes = await fetch("http://127.0.0.1:8000/disaster/disaster");
    const disasters = await disasterRes.json();

    const trackingRes = await fetch("http://127.0.0.1:8000/admin/tracking");
    const tracking = await trackingRes.json();

    const tbody = document.getElementById("requestBody");
    tbody.innerHTML = "";

    if (!Array.isArray(disasters)) return;

    disasters.forEach(d => {
      const match = tracking.find(t =>
        t.sent_to?.toLowerCase() === d.location?.toLowerCase()
      );

      let status = "Pending";
      let className = "pending";

      if (match) {
        status = match.status;
        if (status === "Delivered") className = "delivered";
        else className = "transit";
      }

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${d.type}</td>
        <td>${d.location}</td>
        <td>${d.severity}</td>
        <td><span class="status ${className}">${status}</span></td>
      `;

      tbody.appendChild(row);
    });

  } catch (err) {
    console.error("Error loading data:", err);
  }
}

// 🔄 AUTO REFRESH
setInterval(loadDisasters, 5000);

window.onload = function () {
  setUrgencyColor();
  loadDisasters();
};