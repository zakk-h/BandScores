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

// Initialize data and render chart
function init() {
  bandsData = parseCSV(csvData);
  plotData();
}

// Plot data based on selected metric group
function plotData() {
  const selectedMetricGroup = document.getElementById("metricSelect").value;
  const metricsOptions = {
    score_overall: ["Score", "Overall Placement"],
    music_marching_score: ["Music", "Marching", "General Effect", "Score"],
    all: ["Music", "Marching", "General Effect", "Score", "Class Placement", "Overall Placement"]
  };

  const metrics = metricsOptions[selectedMetricGroup];
  const draughnData = bandsData.find(row => row["Band"] === "Draughn");
  const eastRutherfordData = bandsData.find(row => row["Band"] === "East Rutherford");
  const years = ["2022", "2023", "2024"];
  const datasets = [];

  metrics.forEach((metric, index) => {
    if (metric === "Class Placement" || metric === "Overall Placement") {
      // Plot values for each band without computing differences
      const draughnPoints = years.map(year => parseFloat(draughnData[`${metric} ${year}`]));
      const eastRutherfordPoints = years.map(year => parseFloat(eastRutherfordData[`${metric} ${year}`]));

      datasets.push({
        label: `Draughn - ${metric}`,
        data: draughnPoints,
        borderColor: getColor('gold', index),
        fill: false,
        yAxisID: metric,
      });

      datasets.push({
        label: `East Rutherford - ${metric}`,
        data: eastRutherfordPoints,
        borderColor: getColor('red', index),
        fill: false,
        yAxisID: metric,
      });

    } else {
      // Plot the difference (East Rutherford - Draughn)
      const differencePoints = years.map(year => {
        const eastRutherfordValue = parseFloat(eastRutherfordData[`${metric} ${year}`]);
        const draughnValue = parseFloat(draughnData[`${metric} ${year}`]);
        return eastRutherfordValue - draughnValue;
      });

      datasets.push({
        label: `Difference (East Rutherford - Draughn) - ${metric}`,
        data: differencePoints,
        borderColor: getColor('difference', index),
        fill: false,
        yAxisID: metric,
      });
    }
  });

  renderChart(years, datasets, metrics);
}

// Render chart with multiple Y-axes
function renderChart(labels, datasets, metrics) {
  const ctx = document.getElementById("myChart").getContext("2d");

  const yAxes = metrics.map((metric, index) => ({
    id: metric,
    type: 'linear',
    position: index % 2 === 0 ? 'left' : 'right',
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

// Utility function to assign similar colors
function getColor(type, index) {
  if (type === 'red') {
    return `rgba(255, ${50 + index * 40}, ${50 + index * 30}, 0.8)`; // Red shades
  } else if (type === 'gold') {
    return `rgba(${255 - index * 20}, ${215 - index * 10}, ${0 + index * 20}, 0.8)`; // Gold shades
  } else {
    return `rgba(${50 + index * 40}, 50, ${255 - index * 30}, 0.8)`; // Unique color for differences
  }
}

window.onload = init;
