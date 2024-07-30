// Build the metadata panel
function buildMetadata(sample) {
	d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

		// get the metadata field
		let metadata = data.metadata;

		// Filter the metadata for the object with the desired sample number
		let sampleMetadata = metadata.filter(sampleObj => sampleObj.id == sample);

		// Use d3 to select the panel with id of `#sample-metadata`
		let panel = d3.select("#sample-metadata");

		// Use `.html("") to clear any existing metadata
		d3.select("#sample-metadata").html("");

		// Inside a loop, you will need to use d3 to append new
		// tags for each key-value in the filtered metadata.
		for (const [key, value] of Object.entries(sampleMetadata[0])) {
			panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
		}
	});
}

// function to build both charts
function buildCharts(sample) {
	d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    	// Get the samples field
		let samples = data.samples;

		// Filter the samples for the object with the desired sample number
		let sampleData = samples.filter(sampleObj => sampleObj.id == sample);

		// Get the otu_ids, otu_labels, and sample_values
		let otuIDs = sampleData[0].otu_ids;
		let otuLabels = sampleData[0].otu_labels;
		let sampleValues = sampleData[0].sample_values;

		// Build a Bubble Chart
		let bubbleTrace = {
			x: otuIDs,
			y: sampleValues,
			text: otuLabels,
			mode: "markers",
			marker: {
				size: sampleValues,
				color: otuIDs
			}
		};
		let bubbleData = [bubbleTrace];
		let bubbleLayout = {
			title: "Bacteria Cultures Per Sample",
			showlegend: false,
			hovermode: "closest",
			xaxis: {title: "OTU ID"},
			yaxis: {title: "Number of Bacteria"}
		};

		// Render the Bubble Chart
		Plotly.newPlot("bubble", bubbleData, bubbleLayout);

		// For the Bar Chart, map the otu_ids to a list of strings for your yticks
		let yTicks = otuIDs.map(id => `OTU ${id}`);

		// Build a Bar Chart
		// Don't forget to slice and reverse the input data appropriately
		let barTrace = {
			y: yTicks.slice(0, 10).reverse(),
			x: sampleValues.slice(0, 10).reverse(),
			text: otuLabels.slice(0, 10).reverse(),
			type: "bar",
			orientation: "h"
		};
		let barData = [barTrace];
		let barLayout = {
			title: "Top 10 Bacteria Cultures Found",
			margin: { t: 30, l: 100, b: 150, r: 50 },
			xaxis: {title: "Number of Bacteria Found"}
		};

		// Render the Bar Chart
		Plotly.newPlot("bar", barData, barLayout);
	});
}

// Function to run on page load
function init() {
	d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

		// Get the names field
		let names = data.names;

		// Use d3 to select the dropdown with id of `#selDataset`
		let dropdown = d3.select("#selDataset");

		// Use the list of sample names to populate the select options
		// Hint: Inside a loop, you will need to use d3 to append a new
		// option for each sample name.
		for (i = 0; i < names.length; i++) {
			dropdown.append("option").text(names[i]).property("value", names[i]);
		}

		// Get the first sample from the list
		let firstSample = names[0];

		// Build charts and metadata panel with the first sample
		buildCharts(firstSample);
		buildMetadata(firstSample);
	});
}

// Function for event listener
function optionChanged(newSample) {
	// Build charts and metadata panel each time a new sample is selected
	buildCharts(newSample);
	buildMetadata(newSample);
}

// Initialize the dashboard
init();
