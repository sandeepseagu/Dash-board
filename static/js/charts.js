function get_chart_data(data, url, extra_function, callback) {
  $.ajax({
    url: url,
    method: "POST",
    data: data,
    success: callback
  });
}

function fill_empty_gaps(data, start_date, end_date, date_format, gap_unit) {
  if (start_date != null && end_date != null && date_format != null) {
    // Parse dates into format
    start_date_str = moment(start_date, date_format).format(date_format);
    end_date_str = moment(end_date, date_format).format(date_format);

    // Fill data extremes
    var start_point = {
      x: start_date_str,
      y: "0"
    }
    var end_point = {
      x: end_date_str,
      y: "0"
    }

    // Transform dates into moment objects
    start_date = moment(start_date, date_format);
    end_date = moment(end_date, date_format);

    if (data[0] && !start_date.isSame(moment(data[0].x, date_format))) 
      data.splice(0, 0, start_point);

    if (data[data.length - 1] && !end_date.isSame(moment(data[data.length - 1].x, date_format)))
      data.splice(data.length, 0, end_point);

    // Fill middle empty gaps
    for (var i = 0; i < data.length; i++) {
      //make sure we are not checking the last date in the labels array
      if (i + 1 < data.length) {
        var date1 = moment(data[i].x, date_format).add(1, gap_unit).format(date_format);
        var date2 = moment(data[i + 1].x, date_format).format(date_format);
        //if the current date +1 is not the same as it's next neighbor we have to add in a new one
        if (date1 != date2) {
          var point = {
            x: date1,
            y: "0"
          };
          data.splice(i + 1, 0, point);
        }
      }

      if (i>365) { // Ugly just-in-case patch
        return;
      }
    }
  }
}

function has_data(array, chart_id) {
  var i = 0;

  for (i in array) {
    if (array[i].length != 0)
      return true;
  }
  return false;
}

var charts = [];

function init_charts(charts_data) {
  if( typeof (Chart) === 'undefined'){ return; }

  Chart.defaults.global.legend = {
      enabled: false
  };

  $.each(charts_data, function (chart_id, chart_settings) {
    get_chart_data(chart_settings.post_data, chart_settings.url, chart_settings.extra_function, function (response) {

      if (has_data(response, chart_id)) {
        // Reset canvas
        $(chart_id).remove();
        $(chart_id + "_container").html('<canvas id="' +  chart_id + '">');
        var canvas = document.getElementById(chart_id);

        chart_settings.settings.data.labels = undefined;

        // Reset before rendering
        // Check if chart already exists. If it does, clean it
        if (charts[chart_id] != null) {
          charts[chart_id].destroy();
        }

        for (i in chart_settings.settings.data.datasets) {
          // Build plot data from api response
          var x_plot_data = [],
              y_plot_data = [],
              plot_data = [];

          x_plot_data[i] = [];
          y_plot_data[i] = [];
          plot_data[i] = [];

          for (res_index in response[i]) {
            var keys = Object.keys(response[i][res_index])
            // x_plot_data[i].push(response[i][res_index][keys[0]]);
            // y_plot_data[i].push(response[i][res_index][keys[1]]);
            plot_data[i].push({x: response[i][res_index][keys[0]], y: response[i][res_index][keys[1]]});
          }

          // Fill empty gaps, if required
          if (chart_settings.fill_empty_gaps) {
            fill_empty_gaps(plot_data[i],
                            chart_settings.start_date,
                            chart_settings.end_date,
                            chart_settings.date_format, 
                            chart_settings.gap_unit
                          );
          }

          // Execute pre render function, if defined
          if (chart_settings.extra_pre_function != null)
            chart_settings.extra_pre_function(plot_data[i]);

          for (data in plot_data[i]) {
            x_plot_data[i].push(plot_data[i][data].x);
            y_plot_data[i].push(plot_data[i][data].y);
          }

          // Set x labels as results' x values
          chart_settings.settings.data.labels = x_plot_data[i];
          
          // Load chart data into settings object
          if (!chart_settings.use_points) {
            chart_settings.settings.data.datasets[i].data = y_plot_data[i];
          }
          else
            chart_settings.settings.data.datasets[i].data = plot_data[i];


        }
        charts[chart_id] = new Chart(canvas.getContext('2d'), chart_settings.settings);

        // Execute post render function, if defined
        if (chart_settings.extra_post_function != null)
          chart_settings.extra_post_function(response[i]);
      }
      else { // Empty data
        $(chart_id).remove();
        $(chart_id + "_container").html('<canvas id="' +  chart_id + '">');

        if (charts[chart_id] != null) {
          charts[chart_id].destroy();
        }
      }
    });

  });
}
