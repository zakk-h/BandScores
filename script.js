const csvData = `Band,Music 2022,Marching 2022,General Effect 2022,Score 2022,Class Placement 2022,Overall Placement 2022,Music 2023,Visual 2023,General Effect 2023,Score 2023,Class Placement 2023,Overall Placement 2023,Music 2024,Visual 2024,General Effect 2024,Score 2024,Class Placement 2024,Overall Placement 2024
East Rutherford,22,22,21,65,4,16,187.5,77.6,78,72.01,3,19,287.75,154.4,315,87.86,1,10
Draughn,25.3,24.7,25,75,1,7,241.75,84,182,75.39,4,17,327.75,126.4,257,85.56,4,12
East Burke,,,,67.3,2,15,,,85.13,3,10,,,,,,3,7
Patton,,,,84.4,2,2,,,91.67,2,3,,,,,,1,3`;

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

// Initialize bands data and dropdowns
function init() {
  bandsData = parseCSV(csvData);

  // Populate band selection dropdown
  const bandSelect = document.getElementById("bandSelect");
  const uniqueBands = [...new Set(bandsData.map(row => row["Band"]))];
  uniqueBands.forEach(band => {
    const option = document.createElement("option");
    option.value = band;
    option.textContent = band;
    bandSelect.appendChild(option);
  });
}

// Get selected bands and metrics, then plot
function plotData() {
  const selectedBands = Array.from(document.getElementById("bandSelect").selectedOptions).map(opt => opt.value);
  const selectedMetrics = Array.from(document.getElementById("metricSelect").selectedOptions).map(opt => opt.value);

  const years = ["2022", "2023", "2024"];
  const datasets = [];

  selectedBands.forEach(band => {
    const bandData = bandsData.find(row => row["Band"] === band);

    selectedMetrics.forEach(metric => {
      const dataPoints = years.map(year => parseFloat(bandData[`${metric} ${year}`]));
      datasets.push({
        label: `${band} - ${metric}`,
        data: dataPoints,
        borderColor: getRandomColor(),
        fill: false,
      });
    });
  });

  renderChart(years, datasets);
}

// Render chart using Chart.js with dynamic scaling
function renderChart(labels, datasets) {
  const ctx = document.getElementById("chart").getContext("2d");
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
        y: {
          beginAtZero: false,
          title: { display: true, text: "Score" },
          ticks: {
            callback: function(value) { return Number(value).toFixed(2); }
          }
        }
      },
    },
  });
}

// Utility to get a random color for each dataset
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

window.onload = init;
