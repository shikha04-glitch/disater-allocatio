const tracking = [
  { status: "Delivered" },
  { status: "Pending" },
  { status: "Delivered" }
];

function updateChart() {
  const delivered = tracking.filter(t => t.status === "Delivered").length;
  const pending = tracking.filter(t => t.status === "Pending").length;

  const ctx = document.getElementById("resourceChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Delivered", "Pending"],
      datasets: [{
        label: "Resources",
        data: [delivered, pending]
      }]
    }
  });
}

updateChart();

