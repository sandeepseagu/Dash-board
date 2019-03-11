function bool_to_str(bool) {
  if (bool)
    return "Yes";
  else
    return "No";
}

function get_transactions(datatable) {
  $.ajax({
    url:"api/transactions/get_transactions",
    type:"POST",
    data: $("#transactions_log_form").serialize(),
    success:function(response){
      datatable.clear();
      for (i in response) {
        response[i].price = "$ " + response[i].price;
        response[i].is_credit = bool_to_str(response[i].is_credit);
        datatable.row.add(Object.values(response[i]));
      }
      datatable.draw();
    }
  });
}

function init_DataTables() {
  console.log('run_datatables');
  
  if( typeof ($.fn.DataTable) === 'undefined'){ return; }
  console.log('init_DataTables');
  
  var handleDataTableButtons = function() {
    if ($("#datatable-buttons").length) {
    $("#datatable-buttons").DataTable({
      dom: "Blfrtip",
      buttons: [
      {
        extend: "copy",
        className: "btn-sm"
      },
      {
        extend: "csv",
        className: "btn-sm"
      },
      {
        extend: "excel",
        className: "btn-sm"
      },
      {
        extend: "pdfHtml5",
        className: "btn-sm"
      },
      {
        extend: "print",
        className: "btn-sm"
      },
      ],
      responsive: true
    });
    }
  };

  TableManageButtons = function() {
    "use strict";
    return {
      init: function() {
        handleDataTableButtons();
      }
    };
  }();

  $('#datatable-keytable').DataTable({
    keys: true
  });

  var transactions_datatable = $('#datatable-responsive').DataTable({
    "oLanguage": {
      "sSearch": "Search"
    },
    "sPaginationType": "full_numbers",
    buttons: [
        "csv"
    ],
    order: [[ 0, "desc" ]]
  });

  const now = moment(new Date());
  const month_ago = moment(new Date()).subtract(1, 'month');

  $("#datepicker_from").datepicker({
    showOn: "focus",
    dateFormat: 'yy-mm-dd',
    defaultDate: month_ago.toDate(),
    "onSelect": function(date) {
      minDateFilter = new Date(date).getTime();
      transactions_datatable.draw();
    }
  }).keyup(function() {
    minDateFilter = new Date(this.value).getTime();
    transactions_datatable.draw();
  });
  $("#datepicker_from").val(month_ago.format("YYYY-MM-DD"))

  $("#datepicker_to").datepicker({
    showOn: "focus",
    dateFormat: 'yy-mm-dd',
    defaultDate: now.toDate(),
    "onSelect": function(date) {
      maxDateFilter = new Date(date).getTime();
      transactions_datatable.draw();
    }
  }).keyup(function() {
    maxDateFilter = new Date(this.value).getTime();
    transactions_datatable.draw();
  });
  $("#datepicker_to").val(now.format("YYYY-MM-DD"))


  // Date range filter
  minDateFilter = "";
  maxDateFilter = "";

  $.fn.dataTableExt.afnFiltering.push(
    function(oSettings, aData, iDataIndex) {
      if (typeof aData._date == 'undefined') {
        aData._date = new Date(aData[0]).getTime();
      }

      if (minDateFilter && !isNaN(minDateFilter)) {
        if (aData._date < minDateFilter) {
          return false;
        }
      }

      if (maxDateFilter && !isNaN(maxDateFilter)) {
        if (aData._date > maxDateFilter) {
          return false;
        }
      }

      return true;
    }
  );

  $('#datatable-fixed-header').DataTable({
    fixedHeader: true
  });

  var $datatable = $('#datatable-checkbox');

  $datatable.dataTable({
    'order': [[ 1, 'asc' ]],
    'columnDefs': [
    { orderable: false, targets: [0] }
    ]
  });
  $datatable.on('draw.dt', function() {
    $('checkbox input').iCheck({
    checkboxClass: 'icheckbox_flat-green'
    });
  });

  TableManageButtons.init();

  return transactions_datatable;
};

$(document).ready(function() {
  var datatable = init_DataTables();
  get_transactions(datatable);

  $("#transactions_log_button").click(function(e) {
    get_transactions(datatable);
  });
});