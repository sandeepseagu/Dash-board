
    /* DATA TABLES */
      
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

        $('#datatable').dataTable({responsive: true});

        $('#datatable-keytable').DataTable({
          keys: true
        });

        $('#datatable-responsive').DataTable();

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


      var cards_details=function(card_id)
      {

         
         $("#transactions_heading").html("<strong>Recent Transactions</strong>")
         $.ajax({
              url:"api/get_transactions",
              type:"POST",
              data:{"card_id":card_id},
              success:function(response){
                console.log(response[1][0].balance);
                //$(".balance").html(response[1][0].balance);
                $(".card_id").html("<h1> Card ID:"+card_id+"  "+"<small>Current Balance:"+Math.abs(response[1][0].balance).toFixed(2)+"</small></h1>");
                //$(".x_title #balance").html(response[0].balance);
                $("#last_transactions").html(response[0]);
                //console.log(response);
              }
        })
      }



$(document).ready( function() 
{
  $.ajax({
    url:"api/dashboard_main/cards",
    type:"GET",
    success:function(response){
      $("#cards_table").html(response);
      
        init_DataTables();
      
    }
  })


  $(document).on('click','.cards', function(event)
  {   
      event.preventDefault();
      cards_details(this.id);
  });

});


            