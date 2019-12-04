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


// Load data
d3.csv("assets/data/all_data_cleaned.csv").then(function(data){

  console.log(data)


  // Handle errors
}).catch(function(error){
    console.log(error)
  })
