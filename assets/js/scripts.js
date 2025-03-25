// Hàm tạo biểu đồ
function createChart(ctx, type, label, labels, data, bgColor, borderColor) {
  console.log(`Creating chart: ${label} with data:`, data);
  if (!data || data.length === 0 || data.every(val => val === 0)) {
    console.warn(`No valid data for chart: ${label}`);
    return null;
  }
  return new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: 1,
          fill: type === 'line' ? false : true, // Chỉ fill cho biểu đồ cột
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

// Hàm lấy dữ liệu từ API và cập nhật FE
function loadData() {
  console.log("Fetching data from http://localhost:3000/vehicles...");
  fetch('http://localhost:3000/vehicles')
    .then(res => {
      console.log("Fetch response status:", res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      console.log("Data received:", data);

      // Nếu không có dữ liệu, hiển thị "No data"
      if (!data || data.length === 0) {
        console.warn("No data received from API");
        document.getElementById('motorbikeCount').textContent = "No data";
        document.getElementById('carCount').textContent = "No data";
        document.getElementById('busCount').textContent = "No data";
        document.getElementById('truckCount').textContent = "No data";
        return;
      }

      // Sắp xếp dữ liệu theo id giảm dần và lấy bản ghi mới nhất
      const sortedData = data.sort((a, b) => b.id - a.id);
      const latestRecord = sortedData[0];
      console.log("Latest record:", latestRecord);

      // Kiểm tra key trong latestRecord
      console.log("Keys in latestRecord:", Object.keys(latestRecord));

      // Cập nhật card với bản ghi mới nhất
      console.log("Updating cards with latest record...");
      document.getElementById('motorbikeCount').textContent = latestRecord.motobike || 0;
      document.getElementById('carCount').textContent = latestRecord.car || 0;
      document.getElementById('busCount').textContent = latestRecord.bus || 0;
      document.getElementById('truckCount').textContent = latestRecord.truck || 0;

      // Chuẩn bị dữ liệu cho các biểu đồ (lấy 10 bản ghi mới nhất)
      const recentData = sortedData.slice(0, 10); // Lấy 10 bản ghi mới nhất
      const labels = recentData.map(record => `Record ${record.id}`);
      const motorbikeData = recentData.map(record => parseInt(record.motobike || 0));
      const carData = recentData.map(record => parseInt(record.car || 0));
      const busData = recentData.map(record => parseInt(record.bus || 0));
      const truckData = recentData.map(record => parseInt(record.truck || 0));

      console.log("Chart data:", { motorbikeData, carData, busData, truckData });

      // Cập nhật biểu đồ Traffic Flow (chỉ hiển thị Motorbike)
      console.log("Updating Traffic Flow chart (Motorbike)...");
      if (window.trafficFlowChart) window.trafficFlowChart.destroy();
      const trafficFlowCtx = document.getElementById('trafficFlow');
      if (trafficFlowCtx) {
        window.trafficFlowChart = createChart(
          trafficFlowCtx.getContext('2d'),
          'line',
          'Motorbike',
          labels,
          motorbikeData,
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 99, 132, 1)'
        );
      } else {
        console.error("Canvas element 'trafficFlow' not found");
      }

      // Cập nhật biểu đồ Traffic Analysis (chỉ hiển thị Car)
      console.log("Updating Traffic Analysis chart (Car)...");
      if (window.trafficAnalysisChart) window.trafficAnalysisChart.destroy();
      const trafficAnalysisCtx = document.getElementById('trafficAnalysis');
      if (trafficAnalysisCtx) {
        window.trafficAnalysisChart = createChart(
          trafficAnalysisCtx.getContext('2d'),
          'bar',
          'Car',
          labels,
          carData,
          'rgba(54, 162, 235, 0.2)',
          'rgba(54, 162, 235, 1)'
        );
      } else {
        console.error("Canvas element 'trafficAnalysis' not found");
      }

      // Cập nhật biểu đồ Collision Near Miss (chỉ hiển thị Bus)
      console.log("Updating Collision Near Miss chart (Bus)...");
      if (window.collisionNearMissChart) window.collisionNearMissChart.destroy();
      const collisionNearMissCtx = document.getElementById('collisionNearMiss');
      if (collisionNearMissCtx) {
        window.collisionNearMissChart = createChart(
          collisionNearMissCtx.getContext('2d'),
          'line',
          'Bus',
          labels,
          busData,
          'rgba(75, 192, 192, 0.2)',
          'rgba(75, 192, 192, 1)'
        );
      } else {
        console.error("Canvas element 'collisionNearMiss' not found");
      }

      // Cập nhật biểu đồ Collision Analysis (chỉ hiển thị Truck)
      console.log("Updating Collision Analysis chart (Truck)...");
      if (window.collisionAnalysisChart) window.collisionAnalysisChart.destroy();
      const collisionAnalysisCtx = document.getElementById('collisionAnalysis');
      if (collisionAnalysisCtx) {
        window.collisionAnalysisChart = createChart(
          collisionAnalysisCtx.getContext('2d'),
          'bar',
          'Truck',
          labels,
          truckData,
          'rgba(153, 102, 255, 0.2)',
          'rgba(153, 102, 255, 1)'
        );
      } else {
        console.error("Canvas element 'collisionAnalysis' not found");
      }
    })
    .catch(err => {
      console.error('Lỗi khi lấy dữ liệu:', err);
      // Hiển thị "Error" nếu có lỗi
      document.getElementById('motorbikeCount').textContent = "Error";
      document.getElementById('carCount').textContent = "Error";
      document.getElementById('busCount').textContent = "Error";
      document.getElementById('truckCount').textContent = "Error";
    });
}

// document.addEventListener('DOMContentLoaded', function () {
//   console.log("DOM fully loaded, calling loadData...");
//   // Gọi loadData khi trang được tải
//   loadData();
//   // Tự động làm mới dữ liệu mỗi 5 giây
//   setInterval(() => {
//     console.log("setInterval triggered, calling loadData...");
//     loadData();
//   }, 5000);

//   // Webcam access
//   console.log("Accessing webcam...");
//   const video = document.getElementById('cameraFeed');
//   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     navigator.mediaDevices
//       .getUserMedia({ video: true })
//       .then(function (stream) {
//         console.log("Webcam stream obtained");
//         video.srcObject = stream;
//         video.play();
//       })
//       .catch(function (error) {
//         console.error('Error accessing webcam:', error);
//       });
//   } else {
//     console.error('getUserMedia not supported');
//   }
// });

document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM fully loaded, calling loadData...");
  loadData();
  setInterval(() => {
    console.log("setInterval triggered, calling loadData...");
    loadData();
  }, 5000);

  // Stream video từ Flask backend
  console.log("Accessing video stream from Flask backend...");
  const videoContainer = document.querySelector('.stream');
  if (videoContainer) {
    const img = document.createElement('img');
    img.src = 'http://localhost:5000/video_feed';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '8px';
    videoContainer.innerHTML = ''; // Xóa nội dung cũ
    videoContainer.appendChild(img);
  } else {
    console.error("Element '.stream' not found");
  }
});