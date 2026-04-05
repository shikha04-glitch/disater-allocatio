async function addNgoResource() {

  const type = document.getElementById("ngoResourceType").value;
  const qty = document.getElementById("ngoResourceQty").value;
  const location = document.getElementById("ngoResourceLocation").value;

  if (!type || !qty || !location) {
    alert("Please fill all fields!");
    return;
  }

  const response = await fetch("http://127.0.0.1:8000/resources", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      resource_type: type,
      quantity: qty,
      location: location
    })
  });

  const data = await response.json();
  console.log(data);

  alert("Resource Added ✅");
}