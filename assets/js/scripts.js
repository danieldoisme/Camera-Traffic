function createChart(ctx, label, labels, data, bgColor, borderColor) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  createChart(
    document.getElementById("trafficFlow").getContext("2d"),
    "Traffic Flow",
    ["0s", "5s", "10s"],
    [2, 3, 5],
    "rgba(54, 162, 235, 0.2)",
    "rgba(54, 162, 235, 1)"
  );
  createChart(
    document.getElementById("trafficAnalysis").getContext("2d"),
    "Traffic Analysis",
    ["0s", "5s", "10s"],
    [1, 2, 3],
    "rgba(255, 159, 64, 0.2)",
    "rgba(255, 159, 64, 1)"
  );
  createChart(
    document.getElementById("collisionNearMiss").getContext("2d"),
    "Collision Near Miss",
    ["0s", "5s", "10s"],
    [0, 1, 0],
    "rgba(255, 99, 132, 0.2)",
    "rgba(255, 99, 132, 1)"
  );
  createChart(
    document.getElementById("collisionAnalysis").getContext("2d"),
    "Collision Analysis",
    ["0s", "5s", "10s"],
    [1, 1, 2],
    "rgba(153, 102, 255, 0.2)",
    "rgba(153, 102, 255, 1)"
  );
});
