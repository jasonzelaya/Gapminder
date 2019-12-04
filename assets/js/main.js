// Chart dimensions
var margin = {left: 100, right: 20, top: 20, bottom: 100},
    width = 750 - margin.left - margin.right, // 630
    height = 550 - margin.top - margin.bottom; // 430

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


// Tooltip
var tip = d3.tip().attr('class', 'd3-tip')
    .html(function(d) {
        var text = "<strong>Country:</strong> <span style='color:red'>" + d.country + "</span><br>";
        text += "<strong>Region:</strong> <span style='color:red;text-transform:capitalize'>" + d.region + "</span><br>";
        text += "<strong>Life Expectancy:</strong> <span style='color:red'>" + d3.format(".2f")(d.life_expectancy) + "</span><br>";
        text += "<strong>Income:</strong> <span style='color:red'>" + d3.format("$,.0f")(d.income) + "</span><br>";
        text += "<strong>Population:</strong> <span style='color:red'>" + d3.format(",.0f")(d.population) + "</span><br>";
        return text;
    });
chart.call(tip);


// Timer
var time = 0;
var selected;
// Interval function
var interval;


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


// Gridlines on chart
var gridlinesBottom = d3.axisBottom(xLogScale)
  .tickFormat("")
  .tickValues([500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000])
  .tickSize(-height);

var gridlinesLeft = d3.axisLeft(yLinearScale)
  .tickFormat("")
  .tickSize(-width);

// Create gridlines
var xGridlines = chart.append("g")
  .attr("class", "x bubble gridline")
  .attr("opacity", 0.5)
  .attr("transform", `translate(0, ${height})`)
  .call(gridlinesBottom);

var yGridLines = chart.append("g")
  .attr("class", "y bubble gridline")
  .attr("opacity", 0.5)
  .call(gridlinesLeft)


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
    .attr("x", width / 1.5 - 6)
    .attr("y", height - 3)
    .attr("font-size", 10)
    .attr("opacity", 0.5)
    .text("per person (GDP/capita, PPP$ inflation-adjusted)")


// Legend
var legend = chart.append("g")
  .classed("ordinal legend", true)
  .attr("transform", `translate(${width - 70}, ${height - 85})`)

var legendOrdinal = d3.legendColor()
  .shape("path", d3.symbol().type(d3.symbolSquare).size(75)())
  .shapePadding(1)
  .scale(colorScale);

var bubbleLegend = chart.select(".ordinal.legend")
  .classed("bubbles legend", true)
  .attr("font-size", 14)
  .call(legendOrdinal);


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
    .on("mouseover", tip.show)
    // Hide tooltip when mouse not on bubble
    .on("mouseout", tip.hide)
    // Update existing elements in DOM and construct new elements
    .merge(circles)
    // Transition circles to starting position when page loads or reloads
    .transition(t)
      .attr("cx", d => xLogScale(d.income))
      .attr("cy", d => yLinearScale(d.life_expectancy))
      .attr("r", d => bubbleScale(d.population))


    // Update timeLabel
    timeLabel.text(+(time + 1800))

    // Slider label and time label always match
    $("#slider-year-label")[0].innerHTML = +(time + 1800)

    // Slide slider relative to the time value
    $("#slider").slider("value", +(time + 1800))

  // Axes do not rely on data
}


// Reset timer and update visualization
function step(){
  time = (time < restructuredData.length - 1) ? time+1 : 0

  update(restructuredData[time])
}

// Interactive controls
$("#play-btn").click(function(){
  var button = $(this)
  if (button.text() === "Play"){
    button.text("Pause")
    interval = setInterval(step, 100)
  }else{
    button.text("Play")
    clearInterval(interval)
  }
});

// Reset timer and update chart
$("#reset-btn").click(function(){
  time = 0;
  update(restructuredData[0])
});

// Update visualization when dropdown value changes
$("#region-select").change(function(){
  update(restructuredData[time])
});

// jQuery UI slider
$("#slider").slider({
  // Max range
  max: 2018,
  // Min range
  min: 1800,
  // Increments of 1
  step: 1,
  // Event handler
  slide: function(event, ui){
    // Change the value of the timer to the date the slider was moved to
    time = ui.value - 1800;
    // Enable changing the value of the timer when the visualization is paused
    update(restructuredData[time]);
  }
});


// Load data
d3.csv("assets/data/all_data_cleaned.csv").then(function(data){

  // Format the data
  data.forEach(function(d){
    d.income = +d.income;
    d.life_expectancy = +d.life_expectancy;
    d.population = +d.population;
    d.year = +d.year;
  });

  // Nest data by year
  var nestedData = d3.nest()
    .key(d => d.year)
    .entries(data);

  // Remove the object keys
  restructuredData = nestedData.map(d => d.values)

    // console.log(data); // Array of objects
    // console.log(nestedData); // Array of objects grouped by year
    console.log(restructuredData) // Array of arrays. Nested arrays are comprised of objects

  update(restructuredData[0]);

  // Min/max values for scale domains
  // console.log(d3.extent(data, d => d.income))  // 247, 178,000
  // console.log(d3.extent(data, d => d.life_expectancy))  // 1, 84.2
  // console.log(d3.extent(data, d => d.population))  // 2130, 1,420,000,000


  // Handle errors
}).catch(function(error){
    console.log(error)
  })
