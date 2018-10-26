function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

  
    var PANEL = d3.select("#sample-metadata");
    // Clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    // Reference to Panel element for sample metadata
    d3.json(`/metadata/${sample}`).then(function(data){
      console.log(data)
      Object.entries(data).forEach(
        function([key,value]){
          console.log(key, value)
          PANEL.append("p").text(key + ": " +value)
        }
      )
    })

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(success1)

  // @TODO: Build a Bubble Chart using the sample data

function success1(data){
  var trace1 = {
    x: data["otu_ids"],
    y: data["sample_values"],
    text: data["otu_labels"],
    mode: 'markers',
    marker: {
      size: data["sample_values"],
      color: data["otu_ids"],
    }
  };

  var data = [trace1];

  var layout = {
    title: 'Germs in the sample',
    showlegend: false
  };

  Plotly.newPlot("bubble", data, layout);
}

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    d3.json(`/samples/${sample}`).then(success2)
    function success2(data){
      var plot_data = [{
        values:data["sample_values"].slice(0,10),
        labels:data["otu_ids"].slice(0,10),
        hovertext: data["otu_labels"].slice(0, 10),
        hoverinfo: 'hovertext',
        type: "pie"
      }]
      var layout = {"title" : "Top 10 Operational Taxonomic Units <br> (OTU) found in this sample"}
      Plotly.newPlot("pie", plot_data, layout)
    }


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
