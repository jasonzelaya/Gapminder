// Chart dimensions
var margin = {left: 100, right: 20, top: 20, bottom: 100},
    width = 800 - margin.left - margin.right, // 680
    height = 600 - margin.top - margin.bottom; // 480

// Canvas
var svg = d3.select("#canvas")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

// Chart area
var chart = svg.append("g")
    // Shift chart area
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("width", width)
    .attr("height", height);


// Scales
// Income
var xLogScale = d3.scaleLog()
    // .base(10)
    .domain([247, 180000])
    // Use full width of chart
    .range([0, width]);

// Life expectancy
var yLinearScale = d3.scaleLinear()
    .domain([0, 90])
    // Invert y-axis
    .range([height, 0]);

// Bubble sizes determined by population
var bubbleScale = d3.scaleLinear()
    .domain([2000, 1420000000])
    .range([5, 50]);

// Bubbles colored based on which region each country is in
var colorScale = d3.scaleOrdinal()
    .domain(["Africa", "America", "Asia", "Europe"])
    // Colors retrieved from world_4region.csv in the raw_data folder
    .range(["#00d5e9", "#7feb00", "#ff5872", "#ffe700"])









// Load data
d3.csv("assets/data/all_data_cleaned.csv").then(function(data){

  // Format the data
  data.forEach(function(d){
    d.income = +d.income;
    d.life_expectancy = +d.life_expectancy;
    d.population = +d.population;
    d.year = +d.year;
  });

  console.log(data)


  // Min/max values for scale domains
  // console.log(d3.extent(data, d => d.income))  // 247, 178,000
  // console.log(d3.extent(data, d => d.life_expectancy))  // 1, 84.2
  // console.log(d3.extent(data, d => d.population))  // 2130, 1,420,000,000

  // Handle errors
}).catch(function(error){
    console.log(error)
  })
