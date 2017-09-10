// create a variable called “MOOCdata
var MOOCdata = [];
var diaplayData = [];

// the list of the headers in the input csv file (not including the timestamp)
var headers = ["Big data modelling and analysis",
    "Data generation and capture",
    "Data storage, access and manipulation",
    "Data-driven decision making under uncertainty",
    "Designing for data generation and capture",
    "Making data-driven insights",
    "Monitoring and evaluation",
"Visualising big data models and analysis"
];


// load the data
MOOCdata = d3.csv("MOOC_data.csv", function (error, dataset) {
// check to see if loading the csv file worked
if (error) {
  // if there is an error, print it to the browser console
  console.log(error);
  // exit the function
  return;
}

MOOCdata = dataset;

drawMOOC();
});



function drawMOOC() {
    // let's start by updating the header
    d3.select("h1").text("Where did learners sit on the data wheel?")

    // save the data somewhere covenient, because we need to sort it
    displayData = []

    // for each question in the survey (saved in headers, there was an answer from 1 - 5
    // so let's look at the total number of answer to each question
    for (var i = 0; i < headers.length; i++) {
      temp = [0,0,0,0,0];
//      for (var j = 0; j < MOOCdata.length; i++) {
//        var d = MOOCdata[j];
//        var index = d[headers[i]] - 1;
//        temp[index] += 1;
//      }
      MOOCdata.forEach(function(d) {
              var index = d[headers[i]] - 1;
              temp[index] += 1;
            })

      temp.forEach(function (d) {displayData.push(d)});
    }

    // now that we have sorted our data
    // get the maximum value from the dataset
    // we want this to tbe top of our graph
    var maxNum = d3.max(displayData);


    // clear the existing svg, if there is one that the learner put there already
    d3.selectAll("svg").remove();

    // create margins for our graph
    var margin = {top: 40, bottom: 120, left:100, right: 80};
    // create the dimensions for the svg
    var svgDims = {width: 900 - (margin.left + margin.right), height: 500 - (margin.top - margin.bottom)};

    // create a colour scale using d3's default colour scale tool, we only need 5 colours, but the scale makes 10 or 20.
    dotColour = d3.scale.category10();

    // create a scale for the x-axis
    // this one is ordinal, it only takes specific values, defined by our list of headers
    var x = d3.scale.ordinal()
        .domain(headers)
        .rangePoints([0, svgDims.width]);

    // create the x-axis itself
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");


    // create a scale for the y-axis
    var y = d3.scale.linear()
      .domain([maxNum, 0])
      .range([0, svgDims.height - (margin.top + margin.bottom)]);

    // create the y axis itself
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    // create the svg and append it to the element on the page with an id of "chart"
    var svg = d3.select("#chart").append("svg")
      // set its width and height attributes
        .attr("width", svgDims.width + margin.left + margin.right)
        .attr("height", svgDims.height + margin.top + margin.bottom)
      // append a new group to the svg and position it inside the chart margins
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // append another group for the axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, "+(svgDims.height + margin.top - margin.bottom)+")")
        .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(-30, "+(margin.bottom - margin.top)+")")
      .call(yAxis);
    // rotate the text on the axis
    d3.selectAll(".x text")
      .attr("transform", "rotate(290),translate(5, -10)")
      .style("text-anchor", "end")



    // prepare to draw the circles on the scatterplot, they will have a class called "dot"
    svg.selectAll(".dot")
      // add the data to the circles
      .data(displayData)
      // enter each data element, and append a circle
      .enter().append("circle")
      // describe the circle:
      // class
      .attr("class", "dot")
      // radius
      .attr("r", 5)
      // calculate x position
      .attr("cx", function(d, i) {
        var thisHeaderIndex = i % headers.length;
        var thisHeaderName = headers[thisHeaderIndex];
        return x(thisHeaderName);
      })
      // caclulate circle's y position
      .attr("cy", function (d) {
        return y(d) +(margin.bottom - margin.top);
      })
      // calculate the colour that the circle will be filled
      .attr("fill", function(d, i) {
        var thisGroup = i % 5;
        return dotColour(thisGroup);
      });


    // add a legend to the right hand side
    // first add the rectangles
    svg.selectAll(".legendRect")
      .data([0,1,2,3,4])
      .enter().append("rect")
      // add the boxes to the legend
      .attr("width", 10)
      .attr("height", 10)
      .attr("x", svgDims.width + 45)
      .attr("y", function (d) {
        return 160 - d * 18
      })
      .attr("fill", function(d){
        return dotColour(d);
      });
    // then add the text
    svg.selectAll(".legendText")
      .data([0,1,2,3,4])
      .enter().append("text")
      // add the text to the legend
      .attr("class", "legendText")
      .attr("x", svgDims.width + 30)
      .attr("y", function (d) {
        return 171 - d * 18
      })
      .text(function (d) {
        return d + 1;
      });
    // now add a label to the y axis
    svg.append("text")
      .attr("class", "y axis label")
      .attr("x", 0)
      .attr("y", 0)
      .attr("transform", "rotate(270), translate(-400, -65)")
      .text("Number of learners");
}

