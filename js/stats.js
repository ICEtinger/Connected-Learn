// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Questions');
  data.addColumn('number', 'Slices');
  data.addRows([
    ['Correct', global.correct],
    ['Incorrect', global.incorrect],
    ['Skipped', global.skipped]
  ]);

  // Set chart options
  var options = {'title':'How Much Pizza I Ate Last Night',
                 'width':500,
                 'height':500};

  // Instantiate and draw our chart, passing in some options.
  var my_div = document.getElementById('chart_div');
  var my_chart = new google.visualization.PieChart(chart_div);

  google.visualization.events.addListener(my_chart, 'ready', function () {
    my_div.innerHTML = '<img src="' + my_chart.getImageURI() + '">';
  });

  my_chart.draw(data);
}