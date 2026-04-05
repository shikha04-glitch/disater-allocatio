const API_BASE = "http://127.0.0.1:8000/admin";

// ===== CREATE ROW =====
function createRow(cells) {
    const tr = document.createElement("tr");

    cells.forEach(cell => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
    });

    return tr;
}

// ===== LOAD REQUESTS =====
async function loadRequests() {
    const tableBody = document.querySelector("#pendingRequests tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    try {
        const res = await fetch(`${API_BASE}/requests`);
        const data = await res.json();

        console.log("REQUEST DATA:", data);

        if (!data || data.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='5'>No Requests Found</td></tr>";
            return;
        }

        data.forEach(req => {
            const resource = req.resource || "N/A";
            const quantity = req.quantity || 0;
            const area = req.area || "N/A";
            const requested_by = req.requested_by || "Volunteer";

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${resource}</td>
                <td>${quantity}</td>
                <td>${area}</td>
                <td>${requested_by}</td>
                <td><button onclick="allocatePrompt('${req._id}')">Allocate</button></td>
            `;

            tableBody.appendChild(row);
        });

    } catch (err) {
        console.error("Error loading requests:", err);
    }
}

// ===== LOAD TRACKING =====
async function loadTracking() {
    const tbody = document.querySelector("#trackingTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    try {
        const res = await fetch(`${API_BASE}/tracking`);
        const data = await res.json();

        data.forEach(t => {
            const row = createRow([
                t.resource,
                t.quantity,
                t.sent_to,
                t.status
            ]);

            tbody.appendChild(row);
        });

    } catch (err) {
        console.error("Error loading tracking:", err);
    }
}

// ===== 🔥 FIXED ALLOCATE =====
async function allocateResource(requestId) {

    console.log("Allocating:", requestId);

    try {
        const res = await fetch(`${API_BASE}/allocate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                request_id: requestId
            })
        });

        const data = await res.json();
        console.log(data);

        alert("Allocated ✅");

        // refresh
        loadRequests();
        loadTracking();
        loadOverview();

    } catch (err) {
        console.error(err);
        alert("Allocation failed ❌");
    }
}

// ===== 🔥 THIS WAS MISSING =====
function allocatePrompt(requestId) {
    allocateResource(requestId);
}

// ===== OVERVIEW =====
async function loadOverview() {
    try {
        const req = await fetch(`${API_BASE}/requests`);
        const requests = await req.json();

        const track = await fetch(`${API_BASE}/tracking`);
        const tracking = await track.json();

        const pending = requests.length;
        const delivered = tracking.filter(t => t.status === "Delivered").length;

        document.getElementById("overviewData").innerHTML = `
            Pending Requests: ${pending} <br>
            Delivered: ${delivered}
        `;

    } catch (err) {
        console.error(err);
    }
}

// ===== INIT =====
window.onload = function () {
    loadRequests();
    loadTracking();
    loadOverview();
};