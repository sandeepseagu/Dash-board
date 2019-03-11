// Panel toolbox
$(document).ready(function() {
    $('.collapse-link').on('click', function() {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');
        
        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function(){
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200); 
            $BOX_PANEL.css('height', 'auto');  
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Progressbar
if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar();
}
// /Progressbar

// iCheck
$(document).ready(function() {
  if ($("input.flat")[0]) {
    $(document).ready(function () {
      $('input.flat').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
      });
    });
  }
});
// /iCheck

function gd(year, month, day) {
  return new Date(year, month - 1, day).getTime();
}

function init_JQVmap(){

  if(typeof (jQuery.fn.vectorMap) === 'undefined'){ return; }
  
  console.log('init_JQVmap');
   
  if ($('#usa_map').length ){
    $('#usa_map').vectorMap({
      map: 'usa_en',
      pins: { "tx" : "\u003cimg src=\"images/map-pin-sm.png\" /\u003e" },
      pinMode: 'content',
      backgroundColor: null,
      color: '#ffffff',
      hoverOpacity: 0.7,
      selectedColor: '#666666',
      enableZoom: true,
      showTooltip: true,
      values: sample_data,
      scaleColors: ['#E6F2F0', '#149B7E'],
      normalizeFunction: 'polynomial'
    });
  }
}; 
       
/* DATERANGEPICKER */
function init_daterangepicker() {

  if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
  console.log('init_daterangepicker');

  var cb = function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  };

  var optionSet1 = {
    startDate: moment().subtract(29, 'days'),
    endDate: moment(),
    minDate: '01/01/2012',
    maxDate: '12/31/2015',
    dateLimit: {
      days: 60
    },
    showDropdowns: true,
    showWeekNumbers: true,
    timePicker: false,
    timePickerIncrement: 1,
    timePicker12Hour: true,
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    opens: 'left',
    buttonClasses: ['btn btn-default'],
    applyClass: 'btn-small btn-primary',
    cancelClass: 'btn-small',
    format: 'MM/DD/YYYY',
    separator: ' to ',
    locale: {
      applyLabel: 'Submit',
      cancelLabel: 'Clear',
      fromLabel: 'From',
      toLabel: 'To',
      customRangeLabel: 'Custom',
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      firstDay: 1
    }
  };
  
  $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
  $('#reportrange').daterangepicker(optionSet1, cb);
  $('#reportrange').on('show.daterangepicker', function() {
    console.log("show event fired");
  });
  $('#reportrange').on('hide.daterangepicker', function() {
    console.log("hide event fired");
  });
  $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
    console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
  });
  $('#reportrange').on('cancel.daterangepicker', function(ev, picker) {
    console.log("cancel event fired");
  });
  $('#options1').click(function() {
    $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
  });
  $('#options2').click(function() {
    $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
  });
  $('#destroy').click(function() {
    $('#reportrange').data('daterangepicker').remove();
  });

}


var charts = {}

////////// TEMP DATA. LATER IT WILL BE GOT FROM THE BACKEND /////////////////
var arr_data21 = [32, 41, 23, 56, 12, 43, 25];
var arr_data22 = [21, 23, 12, 33, 11, 57, 10];
var arr_data23 = [3, 4, 2, 5, 7, 4, 2];
/////////////////////////////////////////////////////////////////////////////

// Sales per day
charts['sales_per_day'] = {
  type: 'line',
  data: {
    labels: [gd(2019, 1, 1), gd(2019, 1, 2), gd(2019, 1, 3), gd(2019, 1, 4), gd(2019, 1, 5), gd(2019, 1, 6), gd(2019, 1, 7)],
    datasets: [{
      label: "Vending",
      lineTension: 0.3,
      backgroundColor: "rgba(64, 255, 64, 0.38)",
      borderColor: "rgba(64, 255, 64, 0.7)",
      pointBorderColor: "rgba(64, 255, 64, 0.7)",
      pointBackgroundColor: "rgba(64, 255, 64, 0.7)",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointBorderWidth: 1,
      data: arr_data23
    },{
      label: "Dryer",
      lineTension: 0.3,
      backgroundColor: "rgba(255, 64, 64, 0.38)",
      borderColor: "rgba(255, 64, 64, 0.7)",
      pointBorderColor: "rgba(255, 64, 64, 0.7)",
      pointBackgroundColor: "rgba(255, 64, 64, 0.7)",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointBorderWidth: 1,
      data: arr_data22
    },{
      label: "Washer",
      lineTension: 0.3,
      backgroundColor: "rgba(64, 64, 255, 0.38)",
      borderColor: "rgba(64, 64, 255, 0.38)",
      pointBorderColor: "rgba(64, 64, 255, 0.7)",
      pointBackgroundColor: "rgba(64, 64, 255, 0.7)",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointBorderWidth: 1,
      data: arr_data21
    }],
  },
  options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
          xAxes: [{
            type: "time",
            time: {
              unit: "day"
            }
          }],
          yAxes: [{
              ticks: {
                callback: function(label, index, labels) {
                  return '$' + label;
                }
              }
          }]
      },
      tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                  return data.datasets[tooltipItem.datasetIndex].label + ": $" + tooltipItem.yLabel;
              }
          }
      }
  }
}

// Sales by model
charts['sales_by_model'] = {
  type: 'bar',
  data: {
    labels: ["T-400", "T-80"],
    datasets: [{
      label: 'Sales',
      backgroundColor: "#26B99A",
      data: [43, 23]
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(label, index, labels) {
            return '$' + label;
          }
        }
      }]
    },
    tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                return data.datasets[tooltipItem.datasetIndex].label + ": $" + tooltipItem.yLabel;
            }
        }
    }
  }
}

// Sales by model
charts['sales_by_model'] = {
  type: 'bar',
  data: {
    labels: ["T-400", "T-80"],
    datasets: [{
      label: 'Sales',
      backgroundColor: "#26B99A",
      data: [43, 23]
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function(label, index, labels) {
            return '$' + label;
          }
        }
      }]
    },
    tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                return data.datasets[tooltipItem.datasetIndex].label + ": $" + tooltipItem.yLabel;
            }
        }
    }
  }
}

// Cash vs. Credit Card
charts['cash_vs_credit'] = {
    type: 'doughnut',
    tooltipFillColor: "rgba(51, 51, 51, 0.55)",
    data: {
        labels: [
            "Cash",
            "Credit Card",
        ],
        datasets: [{
            data: [70, 30],
            backgroundColor: [
                "#3498DB",
                "#E74C3C",
            ],
            hoverBackgroundColor: [
                "#49A9EA",
                "#E95E4F",
            ]
        }]
    },
    options: { 
        legend: false, 
        responsive: false,
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var value = data.datasets[0].data[tooltipItem.index];
                    return data.labels[tooltipItem.index] + ": " + value + '%';
                }
            }
        }
    }
}

// Sales per hour
charts['sales_per_hour'] = {
  type: 'line',
  data: {
    labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00", "00:00"],
    datasets: [{
      label: "Sales",
      lineTension: 0,
      backgroundColor: "rgba(38, 185, 154, 0.31)",
      borderColor: "rgba(38, 185, 154, 0.7)",
      pointBorderColor: "rgba(38, 185, 154, 0.7)",
      pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointBorderWidth: 1,
      data: [31, 74, 6, 39, 20, 85, 7, 34, 21, 32, 14, 53, 47, 7, 52]
    }],
  },
  options: {
      scales: {
          yAxes: [{
              ticks: {
                callback: function(label, index, labels) {
                  return '$' + label;
                }
              }
          }]
      },
      tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                  return data.datasets[tooltipItem.datasetIndex].label + ": $" + tooltipItem.yLabel;
              }
          }
      }
  }
}


// Sales by store
charts['sales_by_store'] = {
  type: 'bar',
  data: {
    labels: ["Country Club", "Bragg", "Cliffdale", "Wake Forest", "Dunn"],
    datasets: [{
      label: 'Sales',
      backgroundColor: "#26B99A",
      data: [92, 76, 71, 52, 32]
    }]
  },

  options: {
    scales: {
      yAxes: [{  
        ticks: {
          beginAtZero: true,
          callback: function(label, index, labels) {
            return '$' + label;
          }
        }
      }]
    },
    tooltips: {
        callbacks: {
            label: function(tooltipItem, data) {
                return data.datasets[tooltipItem.datasetIndex].label + ": $" + tooltipItem.yLabel;
            }
        }
    }
  }
}


function init_charts() {
  if( typeof (Chart) === 'undefined'){ return; }

  Chart.defaults.global.legend = {
      enabled: false
  };

  $.each(charts, function (chart, data) {
    var ctx = document.getElementById(chart);
    var chart = new Chart(ctx, data);
  });
}

$(document).ready(function() {
    init_JQVmap();
    init_daterangepicker();
    init_charts();
}); 
    

