$.ajax({
  url: 'api/get_stores',
  method: "POST",
  data: {},
  success: function (initial_stores_ids) {
    var store_ids = [initial_stores_ids[0].store_ids];

    var init_start_date = moment().subtract(29, 'days');
    var init_end_date = moment();
    var current_start_date = init_start_date;
    var current_end_date = init_end_date;

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
           
    /* DATERANGEPICKER */
    function init_daterangepicker() {

      if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
      console.log('init_daterangepicker');

      var cb = function(start, end, label) {
        //console.log(start.toISOString(), end.toISOString(), label);
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
      };

      var optionSet1 = {
        startDate: init_start_date,
        endDate: init_end_date,
        minDate: '01/01/2012',
        maxDate: '12/31/2019',
        dateLimit: {
          days: 1000000
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
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          'Last 2 Months': [moment().subtract(2, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
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
        //console.log("show event fired");
      });
      $('#reportrange').on('hide.daterangepicker', function() {
        //console.log("hide event fired");
      });
      $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
        //console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
        for (i in charts_data) {
          charts_data[i].post_data.start_date = picker.startDate.format("YYYY-MM-DD HH:mm:ss");
          charts_data[i].post_data.end_date = picker.endDate.format("YYYY-MM-DD HH:mm:ss");
          current_start_date = picker.startDate;
          current_end_date = picker.endDate;
          if (charts_data[i].get_date_from_picker) {
            charts_data[i].start_date = picker.startDate.format(charts_data[i].date_format);
            charts_data[i].end_date = picker.endDate.format(charts_data[i].date_format);
          }
        }
        //console.log(picker.startDate.format("YYYY-MM-DD"),init_start_date.format("YYYY-MM-DD"));
        init_charts(charts_data);
        var data = {
            start_date: picker.startDate.format("YYYY-MM-DD"),
            end_date: picker.endDate.format("YYYY-MM-DD"),
            machine_types: ['Vending', 'Dryer', 'Washer'],
            store_ids: store_ids
        };
        init_machines_usage_data(data);

        var top_banner_data=
        {
          start_date:picker.startDate.format("YYYY-MM-DD "),
          end_date: picker.endDate.format("YYYY-MM-DD "),
          store_ids: store_ids
        }
        var revised_dates=add_estimate_dates(top_banner_data);

        top_banner_data["secondary_start_date"]=revised_dates[0];
        top_banner_data["secondary_end_date"]=revised_dates[1];

        //console.log(top_banner_data);
        cards_dispensed(top_banner_data);
        avg_no_of_turns(top_banner_data);
        total_sales(top_banner_data);
        unique_customers(top_banner_data);
        total_deposited(top_banner_data);
        
      });
      $('#reportrange').on('cancel.daterangepicker', function(ev, picker) {
        //console.log("cancel event fired");
        
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


    var charts_data = {}

    // Sales per day
    charts_data['sales_per_day'] = {
      url: "api/dashboard_main/sales_per_day",
      extra_pre_function: null,
      extra_post_function: null,
      fill_empty_gaps: true,
      gap_unit: "day",
      get_date_from_picker: true,
      start_date: init_start_date.format("YYYY-MM-DD HH:mm:ss"),
      end_date: init_end_date.format("YYYY-MM-DD HH:mm:ss"),
      date_format: "YYYY-MM-DD",
      post_data: {
        start_date: init_start_date.format("YYYY-MM-DD HH:mm:ss"),
        end_date: init_end_date.format("YYYY-MM-DD HH:mm:ss"),
        machine_types: ['Vending', 'Dryer', 'Washer'],
        store_ids: store_ids
      },
      use_points: true,
      settings: {
        type: 'line',
        data: {
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
            data: []
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
            data: []
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
            data: []
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              ticks: {
                autoSkip: true,
                maxTicksLimit: 12,
                maxRotation: 0,
                minRotation: 0,
              }
            }],
            yAxes: [{
              ticks: {
                callback: function(label, index, labels) {
                  return '$' + parseFloat(label).toFixed(2);
                },
                beginAtZero: true
              }
            }]
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                return data.datasets[tooltipItem.datasetIndex].label + ": $" + parseFloat(tooltipItem.yLabel).toFixed(2);
              }
            }
          }
        }
      }
    };

    // // Cash vs. Credit Card
    function cash_vs_credit_postrender(cvc_data) {
      $("#cash_percentage").html(cvc_data[0].value + "%");
      $("#credit_percentage").html(cvc_data[1].value + "%");
      var data = {
          start_date: current_start_date.format("YYYY-MM-DD HH:mm:ss"),
          end_date: current_end_date.format("YYYY-MM-DD HH:mm:ss"),
          store_ids: store_ids
      };

      $.ajax({
        url: 'api/dashboard_main/cash_vs_credit_value',
        method: "POST",
        data: data,
        success: function(response) {
          $("#cash_value").html("$ " + parseFloat(response[0].value).toFixed(2));
          $("#credit_value").html("$ " + parseFloat(response[1].value).toFixed(2));
        }
      });
    };

    charts_data['cash_vs_credit'] = {
      url: "api/dashboard_main/cash_vs_credit",
      extra_pre_function: null,
      extra_post_function: cash_vs_credit_postrender,
      get_date_from_picker: true,
      post_data: {
        start_date: init_start_date.format("YYYY-MM-DD HH:mm:ss"),
        end_date: init_end_date.format("YYYY-MM-DD HH:mm:ss"),
        store_ids: store_ids
      },
      use_points: false,
      settings: {
        type: 'doughnut',
        tooltipFillColor: "rgba(51, 51, 51, 0.55)",
        data: {
          labels: [
            "Cash",
            "Credit Card",
          ],
          datasets: [{
            data: [],
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
    };

    // Sales by model
    charts_data['sales_by_model'] = {
      url: "api/dashboard_main/sales_by_model",
      extra_pre_function: null,
      extra_post_function: null,
      get_date_from_picker: true,
      post_data: {
        start_date: init_start_date.format("YYYY-MM-DD HH:mm:ss"),
        end_date: init_end_date.format("YYYY-MM-DD HH:mm:ss"),
        store_ids: store_ids
      },
      use_points: false,
      settings: {
        type: 'bar',
        data: {
          datasets: [{
            label: 'Sales',
            backgroundColor: "#26B99A",
            data: []
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                callback: function(label, index, labels) {
                  return '$' + parseFloat(label).toFixed(2);
                }
              }
            }]
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                return data.datasets[tooltipItem.datasetIndex].label + ": $" + parseFloat(tooltipItem.yLabel).toFixed(2);
              }
            }
          }
        }
      }
    };

    // Sales per hour
    const time_format = "HH:mm";

    function sales_per_hour_prerender(data) {
      var re_single_num = /^\d$/;
      var re_double_num = /^\d\d$/;
      var re_hour_no_zero = /^\d:\d\d$/;
      var data_length = data.length;
      for (var i = 0; i < data_length; i++) {
        if (String(data[i].x).match(re_single_num))
          data[i].x = "0" + data[i].x + ":00";
        else if (String(data[i].x).match(re_double_num))
          data[i].x = data[i].x + ":00";
        else if (String(data[i].x).match(re_hour_no_zero))
          data[i].x = "0" + data[i].x;
      }
    };

    charts_data['sales_per_hour'] = {
      url: "api/dashboard_main/sales_per_hour",
      extra_pre_function: sales_per_hour_prerender,
      extra_post_function: null,
      fill_empty_gaps: true,
      gap_unit: "hour",
      post_data: {
        start_date: init_start_date.format("YYYY-MM-DD HH:mm:ss"),
        end_date: init_end_date.format("YYYY-MM-DD HH:mm:ss"),
        store_ids: store_ids
      },
      get_date_from_picker: false,
      start_date: "00:00",
      end_date: "23:00",
      date_format: "HH:mm",
      use_points: true,
      settings: {
        type: 'line',
        data: {
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
            data: []
          }],
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    ticks: {
                    },
                    time: {
                      format: time_format,
                      unit: 'hour',
                      unitStepSize: 6,
                      displayFormats: {
                          'hour': time_format
                      },
                    }
                }],
                yAxes: [{
                    ticks: {
                      callback: function(label, index, labels) {
                        return '$' + parseFloat(label).toFixed(2);
                      }
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return data.datasets[tooltipItem.datasetIndex].label + ": $" + parseFloat(tooltipItem.yLabel).toFixed(2);
                    }
                }
            }
        }
      }
    };

    // Sales by store
    charts_data['sales_by_store'] = {
      url: "api/dashboard_main/sales_by_store",
      extra_pre_function: null,
      extra_post_function: null,
      get_date_from_picker: true,
      post_data: {
        start_date: init_start_date.format("YYYY-MM-DD HH:mm:ss"),
        end_date: init_end_date.format("YYYY-MM-DD HH:mm:ss"),
        store_ids: store_ids
      },
      use_points: false,
      settings: {
        type: 'bar',
        data: {
          datasets: [{
            label: 'Sales',
            backgroundColor: "#26B99A",
            data: []
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                callback: function(label, index, labels) {
                  return '$' + parseFloat(label).toFixed(2);
                }
              }
            }]
          },
          tooltips: {
              callbacks: {
                  label: function(tooltipItem, data) {
                      return data.datasets[tooltipItem.datasetIndex].label + ": $" + parseFloat(tooltipItem.yLabel).toFixed(2);
                  }
              }
          }
        }
      }
    };

    function get_machines_usage_data(data, callback) {
      $.ajax({
        url: 'api/dashboard_main/machines_usage',
        method: "POST",
        data: data,
        success: callback
      });
    }

    function init_machines_usage_data(data) {
      get_machines_usage_data(data, function(response) {

        $("#vending_count").html(response[0] + '%');
        $('#vending_count').css('width', response[0] + '%').attr('aria-valuenow', response[0]);

        $("#dryer_count").html(response[1] + '%');
        $('#dryer_count').css('width', response[1] + '%').attr('aria-valuenow', response[1]);

        $("#washer_count").html(response[2] + '%');
        $('#washer_count').css('width', response[2] + '%').attr('aria-valuenow', response[2]);

      });
    }


    function diff_in_days(start_date,end_date)
    {

      var no_of_days =  Math.floor(
          (
            Date.parse(
              end_date.replace(/-/g,'\/')
          ) - Date.parse(
              start_date.replace(/-/g,'\/')
          )               
          ) / 86400000);
      return no_of_days;

    }

    function add_estimate_dates(data)
    {
        var end_date=data.start_date;
        var date=data.end_date;
        var no_of_days = diff_in_days(end_date,date);
        if(no_of_days==0)
        {
          no_of_days=no_of_days+1;
          var x= moment(end_date).subtract(1, 'days').format("YYYY-MM-DD");
          var y=moment(end_date).subtract(1,'days').format("YYYY-MM-DD");
        }
        else{
          var x= moment(end_date).subtract(no_of_days+1, 'days').format("YYYY-MM-DD");
          var y=moment(end_date).subtract(1,'days').format("YYYY-MM-DD");
        }
        
       
        return [x,y];
    }

// Top banner functions
function cards_dispensed(data){

  $.ajax({
    url:"api/dashboard_main/cards_dispensed",
    type:"POST",
    data:data,
    success:function(response){
      
      
      var new_value=response[0];
      var old_value=response[1];
      var change=new_value-old_value;
      var percentage;
      var days=diff_in_days(data.secondary_start_date,data.secondary_end_date)+1;
    
      if(change<0)
      {
        if (new_value==0) 
        {
           percentage=100;
           
        }
        else
        {
          percentage=(change/old_value)*100;
        }
        
        
        
        $("#cards_dispensed").html(response[0]);
        $("#cards_dispense_percentage_change").html('<i class="red"  ><i class="fa fa-sort-desc" ></i>'+Math.abs(percentage).toFixed(2)+'%</i> From Last '+days+' Days');
        
      }
      else if(change>0)
      {
        if(old_value==0)
        {
          percentage=100;
        }
        else{
          percentage=(change/old_value)*100;
        }
        
        $("#cards_dispensed").html(response[0]);
        $("#cards_dispense_percentage_change").html('<i class="green"  ><i class="fa fa-sort-asc" ></i>'+Math.abs(percentage).toFixed(2)+'%</i> From Last '+days+' Days');
        

      }
      else if(change==0)
      {
        $("#cards_dispensed").html(response[0]);
        $("#cards_dispense_percentage_change").html('<i class="green"  ><i class="fa fa-sort-asc"></i>'+0+'%</i> From Last '+days+' Days');
      }
      
      
     
    }
  })
}

function total_deposited(data)
{
  $.ajax({
    url:"api/dashboard_main/total_deposited",
    type:"POST",
    data:data,
    success:function(response){
      console.log(response);
      var new_value=response[0][0].total_deposited;
      var old_value=response[1][0].total_deposited;
      $("#funds_added").html("$"+new_value);
        var change= new_value-old_value;
        var percentage;
        var days=diff_in_days(data.secondary_start_date,data.secondary_end_date)+1;
      if(new_value>0 && old_value>0)
      {
        console.log("hello");
        if(change==0)
        {
          percentage=0;
          $("#funds_added_percentage_change").html('<i class="green"  ><i class="fa fa-sort-asc"></i>'+0.00+'%</i> From Last '+days+' Days');
        }
        else if(change>0)
        {
           percentage=(change/old_value)*100;
           $("#funds_added_percentage_change").html('<i class="green"  ><i class="fa fa-sort-asc"></i>'+Math.abs(percentage).toFixed(2)+'%</i> From Last '+days+' Days');
        }
        else if(change<0)
        {
          percentage=(change/old_value)*100;
          $("#funds_added_percentage_change").html('<i class="desc"  ><i class="fa fa-sort-asc"></i>'+Math.abs(percentage).toFixed(2)+'%</i> From Last '+days+' Days');
        }


      }

      if(new_value==0 && old_value==0 )
      {
        $("#funds_added_percentage_change").html('<i class="green"  ><i class="fa fa-sort-asc"></i>'+0.00+'%</i> From Last '+days+' Days');
      }

      if (new_value==0 && old_value>0) 
      {
        $("#funds_added_percentage_change").html('<i class="desc"  ><i class="fa fa-sort-asc"></i>'+100.00+'%</i> From Last '+days+' Days');
      }
      if (new_value>0 && old_value==0) 
      {
        $("#funds_added_percentage_change").html('<i class="green"  ><i class="fa fa-sort-asc"></i>'+100.00+'%</i> From Last '+days+' Days');
      }



    }
  })
}

function avg_no_of_turns(data){
  $.ajax({
    url:"api/dashboard_main/no_of_turns",
    type:"POST",
    data:data,
    success:function(response){
     
    
      var new_turns= response[0];
      var old_turns= response[1];
      var no_of_days = diff_in_days(data.start_date,data.end_date);
      
      no_of_days=no_of_days+1;

      
     
      var new_avg_no_turns=(new_turns/no_of_days).toFixed(2);
      var old_avg_no_turns=(old_turns/no_of_days).toFixed(2);
      
      var change=new_avg_no_turns-old_avg_no_turns
      console.log(new_avg_no_turns,old_avg_no_turns,change);


      if(change==0)
      {

        $("#avg_no_of_turns").html(new_avg_no_turns);
        $("#avg_no_of_turns_percentage_change").html('<i class="green"  ><i class="fa fa-sort-asc" ></i>'+0+'%</i> From Last '+no_of_days+' Days');
      }
      if(change>0)
      {
        if(old_avg_no_turns==0.0)
        {
          var percentage=100;
        }
        else
        {
          var percentage=(change/old_avg_no_turns)*100;
          
        }
        
        $("#avg_no_of_turns").html(new_avg_no_turns);
        $("#avg_no_of_turns_percentage_change").html('<i class="green"  ><i class="fa fa-sort-asc" ></i>'+Math.abs(percentage).toFixed(2)+'%</i> From Last '+no_of_days+' Days');
        
      }
      
      if(change<0)
      {
        if(new_value=0.0)
        {
         var  percentage=100;
        }
        else
        {
          var percentage=(change/old_avg_no_turns)*100;
        }
        
        $("#avg_no_of_turns").html(new_avg_no_turns);
        $("#avg_no_of_turns_percentage_change").html('<i class="red"  ><i class="fa fa-sort-desc" ></i>'+Math.abs(percentage).toFixed(2)+'%</i> From Last '+no_of_days+' Days');
        
      }
    }
  })
}
      

      
function total_sales(data)
{

  $.ajax({
    url:"api/dashboard_main/total_sales",
    type:"POST",
    data:data,
    success:function(response){


      

     console.log(response);

      var new_value=response[0][0].total_sales;
      var old_value=response[1][0].total_sales;


      if(response[0][0].total_sales==null)
      {
        new_value=Number(0).toFixed(2);
      }
      if (response[1][0].total_sales==null)
      {
        old_value=Number(0).toFixed(2);
      }

      var change=new_value-old_value;
      var days=diff_in_days(data.secondary_start_date,data.secondary_end_date)+1;

       if(change>0)
        {
          if(old_value=='0.00')
          {
            var percentage=100;
            $("#total_sales").html("$"+new_value);
            $("#total_sales_percentage_change").show().html('<i class="green"  ><i class="fa fa-sort-asc" ></i>'+percentage.toFixed(2)+'%</i> From Last '+days+' Days');
          }
          else
          {
            var percentage=(Math.abs(change)/old_value)*100;
            $("#total_sales").html("$"+new_value);
            $("#total_sales_percentage_change").show().html('<i class="green"  ><i class="fa fa-sort-asc" ></i>'+percentage.toFixed(2)+'%</i> From Last '+days+' Days');

          }
          
        }

        if(change<0)
        {
          if(new_value=='0.00')
          {
            var percentage=100;
            $("#total_sales").html("$"+new_value);
          $("#total_sales_percentage_change").show().html('<i class="red"  ><i class="fa fa-sort-desc" ></i>'+percentage.toFixed(2)+'%</i> From Last '+days+' Days');
          }
          else
          {

            var percentage=(Math.abs(change)/old_value)*100;
          $("#total_sales").html("$"+new_value);
          $("#total_sales_percentage_change").show().html('<i class="red"  ><i class="fa fa-sort-desc" ></i>'+percentage.toFixed(2)+'%</i> From Last '+days+' Days');

          }
          
        }

        if(change==0)
        {
           $("#total_sales").html("$"+new_value);
           $("#total_sales_percentage_change").show().html('<i class="green"  ><i class="fa fa-sort-asc" ></i>'+0.00+'%</i> From Last '+days+' Days');
        }


    }
  })

}

function total_float(data){
  
  $.ajax({
    url:"api/dashboard_main/total_float",
    type:"POST",
    data:data,
    success:function(response){
      var current_float;
      if (response[0].current_float != null){
        current_float = parseFloat(response[0].current_float).toFixed(2);
        console.log(current_float);
      }
      else 
        current_float = parseFloat(0).toFixed(2);


      $("#float").html("$"+current_float);
      //$("#float").html("$"+current_float.toFixed(2));

     

    }
  })
}

function unique_customers(data){
  $.ajax({
    url:"api/dashboard_main/unique_customers",
    type:"POST",
    data:data,
    success:function(response){
      //console.log(response,"hello");
      var new_value=response[0];
      var old_value=response[1];
      var change=response[0]-response[1];
       var days=diff_in_days(data.secondary_start_date,data.secondary_end_date)+1;
      if(change<0)
      {
        if (new_value==0) 
        {
          percentage=100;
        }
        else
        {
          percentage=(change/old_value)*100;

        }
        $("#unique_customers").html(new_value);
        $("#unique_customers_percentage_change").html('<i class="red"><i class="fa fa-sort-desc"></i>'+Math.abs(percentage).toFixed(2)+'% </i> From Last '+ days+' Days');
      }
      else if (change>0) 
      {
        if (old_value==0) 
        {
          percentage=100;

        }
        else
        {
          percentage=(change/old_value)*100;
        }

        $("#unique_customers").html(new_value);
        $("#unique_customers_percentage_change").html('<i class="green"><i class="fa fa-sort-asc"></i>'+Math.abs(percentage).toFixed(2)+'% </i> From Last '+ days+' Days');

      }
      else if(change==0)
      {
        $("#unique_customers").html(new_value);
        $("#unique_customers_percentage_change").html('<i class="green"><i class="fa fa-sort-asc"></i>'+0.00+'% </i> From Last '+ days+' Days');
      }
      //$("#unique_customers").html(response);
      
    }
  })

}

    function render_dashboard(start_date, end_date) {
      var data = {
          start_date: start_date.format("YYYY-MM-DD HH:mm:ss"),
          end_date: end_date.format("YYYY-MM-DD HH:mm:ss"),
          machine_types: ['Vending', 'Dryer', 'Washer'],
          store_ids: store_ids
      };

      var top_banner_data={
        start_date:start_date.format("YYYY-MM-DD"),
        end_date:end_date.format("YYYY-MM-DD"),
        store_ids: store_ids
      }
      var revised_dates= add_estimate_dates(top_banner_data);
      
      top_banner_data["secondary_start_date"]=revised_dates[0];
      top_banner_data["secondary_end_date"]=revised_dates[1];

      init_charts(charts_data);
      cards_dispensed(top_banner_data);
      avg_no_of_turns(top_banner_data);
      total_sales(top_banner_data);
      total_float(top_banner_data);
      init_machines_usage_data(data);
      unique_customers(top_banner_data);
      total_deposited(top_banner_data);

    }


    // Stores filter
    $(document).ready(function() {
      init_daterangepicker();
      render_dashboard(init_start_date, init_end_date);

      get_stores(function(_store_ids) {
        store_ids = _store_ids;
        for (i in charts_data) {
          charts_data[i].post_data.store_ids = _store_ids;
        };
        render_dashboard(current_start_date, current_end_date);
      });

    });

  }
});