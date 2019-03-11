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

                $('#datatable').dataTable();

                $('#datatable-keytable').DataTable({
                  keys: true
                });

                $('#datatable-responsive-2').DataTable();

                $(function() {
                  var oTable = $('#datatable-responsive').DataTable({
                    "oLanguage": {
                      "sSearch": "Search"
                    },
                    "sPaginationType": "full_numbers",
                    buttons: [
                        "csv"
                    ]
                  });

                  $("#datepicker_from").datepicker({
                    showOn: "focus",
                    "onSelect": function(date) {
                      minDateFilter = new Date(date).getTime();
                      oTable.draw();
                    }
                  }).keyup(function() {
                    minDateFilter = new Date(this.value).getTime();
                    oTable.draw();
                  });

                  $("#datepicker_to").datepicker({
                    showOn: "focus",
                    "onSelect": function(date) {
                      maxDateFilter = new Date(date).getTime();
                      oTable.draw();
                    }
                  }).keyup(function() {
                    maxDateFilter = new Date(this.value).getTime();
                    oTable.draw();
                  });

                });

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

                $('#datatable-scroller').DataTable({
                  ajax: "js/datatables/json/scroller-demo.json",
                  deferRender: true,
                  scrollY: 380,
                  scrollCollapse: true,
                  scroller: true
                });

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
                
            };



$(document).ready(function() {
    init_DataTables();
    
}); 
   