// ===== FETCH AND SHOW REQUESTS =====
async function fetchRequests() {
    const res = await fetch("http://127.0.0.1:8000/admin/requests");
    const data = await res.json();
    const tbody = document.querySelector("#requestTable tbody");
    tbody.innerHTML = "";
    data.forEach(req => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${req.resource}</td>
            <td>${req.quantity}</td>
            <td>${req.requested_by}</td>
            <td>${req.area}</td>
            <td>
                <button onclick="allocate('${req._id}')">Allocate</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== FETCH RESOURCES =====
async function fetchResources() {
    const res = await fetch("http://127.0.0.1:8000/resources");
    const data = await res.json();
    const tbody = document.querySelector("#resourceTable tbody");
    tbody.innerHTML = "";
    data.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${r.name}</td>
            <td>${r.quantity}</td>
            <td>${r.location}</td>
            <td>${r.status}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== ALLOCATE RESOURCE =====
async function allocate(request_id) {
    // Here we select first available resource (simple logic)
    const res = await fetch("http://127.0.0.1:8000/resources");
    const resources = await res.json();
    const available = resources.find(r => r.quantity > 0);
    if (!available) return alert("No available resources");

    const response = await fetch(`http://127.0.0.1:8000/admin/allocate/${request_id}/${available._id}`, {
        method: "POST"
    });
    const data = await response.json();
    alert(data.message);

    fetchRequests();
    fetchResources();
    fetchTracking();
}

// ===== FETCH TRACKING =====
async function fetchTracking() {
    const res = await fetch("http://127.0.0.1:8000/admin/tracking");
    const data = await res.json();
    const tbody = document.querySelector("#trackingTable tbody");
    tbody.innerHTML = "";
    data.forEach(t => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${t.resource}</td>
            <td>${t.sent_to}</td>
            <td>${t.status}</td>
            <td>
                <button onclick="updateTracking('${t._id}')">Delivered</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== UPDATE TRACKING =====
async function updateTracking(tracking_id) {
    const res = await fetch(`http://127.0.0.1:8000/admin/tracking/update/${tracking_id}?status=Delivered`, {
        method: "POST"
    });
    const data = await res.json();
    alert(data.message);
    fetchTracking();
}

// ===== FETCH DISASTERS =====
async function fetchDisasters() {
    const res = await fetch("http://127.0.0.1:8000/admin/disasters");
    const data = await res.json();
    const tbody = document.querySelector("#disasterTable tbody");
    tbody.innerHTML = "";
    data.forEach(d => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${d.type}</td>
            <td>${d.location}</td>
            <td>${d.severity}</td>
            <td>${d.description}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== INITIAL FETCH =====
fetchRequests();
fetchResources();
fetchTracking();
fetchDisasters();