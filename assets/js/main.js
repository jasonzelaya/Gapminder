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


// Axes
// Axis generators
var bottomAxis = d3.axisBottom(xLogScale)
    .tickValues([500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000])
    .tickFormat(d3.format(""));

var leftAxis = d3.axisLeft(yLinearScale);

// Create x-axis
var xAxis = chart.append("g")
    .classed("x axis", true)
    // Shift x-axis to bottom of chart
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

// Create y-axis
var yAxis = chart.append("g")
    .classed("y axis", true)
    .call(leftAxis);


// Labels
var xAxisLabel = chart.append("text")
    .classed("x label", true)
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom / 2)
    .attr("font-size", margin.top)
    .text("Income");

 var yAxisLabel = chart.append("text")
    .classed("y label", true)
    .attr("text-anchor", "middle")
    .attr("x", -height / 2)
    .attr("y", -margin.left / 2)
    .attr("transform", "rotate(-90)")
    .attr("font-size", margin.right)
    .text("Life Expectancy (Years)");

// Year label to update with the slider
var timeLabel = chart.append("text")
    .classed("time label", true)
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height / 1.39)
    .attr("font-family", "Titillium Web")
    .attr("font-size", 250)
    .attr("opacity", 0.2)
    .text("1800");

// Label in bottom right corner to provide greater detail for the income value
var incomeLabel = chart.append("text")
    .classed("income label", true)
    .attr("text-anchor", "right")
    .attr("x", width / 2 + 63)
    .attr("y", height - 3)
    .attr("font-size", 10)
    .attr("opacity", 0.5)
    .text("per person (GDP/capita, PPP$ inflation-adjusted)")



// Update function
function update(data){
  // Domains do not rely on data

  // Transition
  var t = d3.transition().duration(100);

  // Current dropdown selection/value
  var regionSelect = $("#region-select").val();

  // Filter value displayed based on dropdown selection
  var filteredData = data.filter(function(d){
    if (regionSelect === "All") {
      return true;
    }else{
      return d.region === regionSelect;
    }
  })


  // Update pattern
  // Data join
  var circles = chart.selectAll("circle")
      // Bind data and track by country rather than by index
      .data(filteredData, function(d){
        return d.country
      });


  // Remove previous elements that are not in the updated data
  circles.exit().remove()

  // Enter new elements for virtual elements
  circles.enter()
    // Append a circle for every virtual element
    .append("circle")
    .attr("fill", d => colorScale(d.region))
    .attr("stroke", "black")
    // Show tooltip when mouse on bubble
    // .on("mouseover", tip.show)
    // Hide tooltip when mouse not on bubble
    // .on("mouseout", tip.hide)
    // Update existing elements in DOM and construct new elements
    .merge(circles)
    // Transition circles to starting position when page loads or reloads
    .transition(t)
      .attr("cx", d => xLogScale(d.income))
      .attr("cy", d => yLinearScale(d.life_expectancy))
      .attr("r", d => bubbleScale(d.population))

  // Axes do not rely on data

}









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


  // update()

  // Handle errors
}).catch(function(error){
    console.log(error)
  })
