// Fetch the JSON data and console log it
d3.json('samples.json').then(function(data) {
    console.log(data);
  });

//function for dropdown menu
function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    buildCharts(sampleNames[0]);
    buildMetadata(sampleNames[0]);
})}

init();  

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
    buildGauge(newSample);
}

function buildGauge(sample) {
    d3.json('samples.json').then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var wash = result.wfreq
        var gauge_data = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: wash,
              title: { text: "Belly Button Washing Frequency" },
              type: "indicator",
              mode: "gauge+number+delta",
              gauge: {
                axis: { range: [0, 9] },
                steps: [
                  { range: [0, 1], color: "lightgray" },
                  { range: [1, 2], color: "lightgray" },
                  { range: [2, 3], color: "lightgray" },
                  { range: [3, 4], color: "pink" },
                  { range: [4, 5], color: "pink" },
                  { range: [5, 6], color: "pink" },
                  { range: [6, 7], color: "red" },
                  { range: [7, 8], color: "red" },
                  { range: [8, 9], color: "red" }
                ],
              }
            }
          ];
          
          var gauge_layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
          Plotly.newPlot('gauge', gauge_data, gauge_layout);
        })
    }


function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
      PANEL.html("");
    
      Object.entries(result).forEach(([demographic, dmgValue]) => {
        PANEL.append("h6").text(demographic.toUpperCase() + " : " + dmgValue);



      });
    });
  }
  
  function buildCharts(sample){
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleData => sampleData.id == sample);
        var result = resultArray[0];
        var otuIds = result.otu_ids;
        var otuLabels = result.otu_labels;
        var sampleValues = result.sample_values;
        var filteredData = otuIds.slice(0, 10).map(barChart =>  `OTU ${barChart}`).reverse();
        //Bar Chart
        var trace = {
            x: sampleValues.slice(0, 10).reverse(),
            y: filteredData,
            text: otuLabels.slice(0, 10).reverse(),
            type: "bar",
            orientation: 'h',
            marker: {
              color: 'rgb(142,124,195)'
              }
  
        };
        var data = [trace];
        var layout = {
            title: "Top 10 Belly Button Bacterias",
            xaxis: { title: "OTU Bacteria Counts"}
                    };
        Plotly.newPlot("bar", data, layout);
        
        // Now the Bubble Chart
        var bubbleFilteredData = otuIds.map(bubbleChart => bubbleChart);
        var trace2 = {
          x: bubbleFilteredData,
          y: sampleValues,
          text: otuLabels,
          mode: 'markers',
          marker: {
            size: sampleValues,
            color: otuIds
            }
        };
        var data2 = [trace2];
        
        var layout2 = {
          title: 'OTU Bacteria Counts',
          showlegend: false,
          xaxis: { title: "OTU ID"},
          yaxis: { title: "OTU Counts"}
        };
        Plotly.newPlot('bubble', data2, layout2);

      
   
    });
  } 








