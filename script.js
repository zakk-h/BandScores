const csvData = `Band,Music 2022,Marching 2022,General Effect 2022,Score 2022,Class Placement 2022,Overall Placement 2022,Music 2023,Visual 2023,General Effect 2023,Score 2023,Class Placement 2023,Overall Placement 2023,Music 2024,Visual 2024,General Effect 2024,Score 2024,Class Placement 2024,Overall Placement 2024
East Rutherford,22,22,21,65,4,16,187.5,77.6,78,72.01,3,19,287.75,154.4,315,87.86,1,10
Draughn,25.3,24.7,25,75,1,7,241.75,84,182,75.39,4,17,327.75,126.4,257,85.56,4,12`;

let bandsData = [];

// Parse CSV data
function parseCSV(data) {
  const rows = data.split("\n").map(row => row.split(","));
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const entry = {};
    row.forEach((cell, index) => {
      entry[headers[index].trim()] = cell.trim() || null;
    });
    return entry;
  });
}

// Initialize data and plot
function init() {
  bandsData = parseCSV(csvData);

  const draughnData = bandsData.find(row => row["Band"] === "Draughn");
  const eastRutherfordData = bandsData.find(row => row["Band"] === "East Rutherford");

  const years = ["2022", "2023", "2024"];
  const metrics = ["Music", "Visual", "General Effect", "Score", "Class Placement", "Overall Placement"];

  const datasets = [];

  // Create datasets for each metric and each band
  metrics.forEach(metric => {
    // Draughn data
    const draughnPoints = years.map(year => parseFloat(draughnData[`${metric} ${year}`]));
    datasets.push({
      label: `Draughn - ${metric}`,
      data: draughnPoints,
      borderColor: getRandomColor(),
      fill: false,
      yAxisID: metric,
    });

    // East Rutherford data
    const eastRutherfordPoints = years.map(year => parseFloat(eastRutherfordData[`${metric} ${year}`]));
    datasets.push({
      label: `East Rutherford - ${metric}`,
      data: eastRutherfordPoints,
      borderColor: getRandomColor(),
      fill: false,
      yAxisID: metric,
    });
  });

  renderChart(years, datasets, metrics);
}

// Render chart with multiple Y-axes using Chart.js
function renderChart(labels, datasets, metrics) {
  const ctx = document.getElementById("myChart").getContext("2d");

  // Define multiple Y-axes, one for each metric
  const yAxes = metrics.map((metric, index) => ({
    id: metric,
    type: 'linear',
    position: index % 2 === 0 ? 'left' : 'right', // Alternate axis position for better readability
    scaleLabel: {
      display: true,
      labelString: metric,
    },
    ticks: {
      beginAtZero: false,
    },
    grid: {
      drawOnChartArea: false // Prevent overlapping grid lines
    }
  }));

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "Year" }
        },
        y: yAxes,
      },
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  });
}

// Utility function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

window.onload = init;
