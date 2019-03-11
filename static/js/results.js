
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

        $('#datatable').dataTable();

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

         
         $("#transactions_heading").html("Recent Transactions")
         $.ajax({
              url:"api/get_transactions",
              type:"POST",
              data:{"card_id":card_id},
              success:function(response){
                $(".card_id").html("<h1> Card ID:"+card_id+"  "+"<small>Current Balance:"+response[1][0].balance+"</small></h1>");
                $("#last_transactions").html(response[0]);
                
                //console.log(response);
              }
        })
      }


  
 
  var php_var = globalVariable.test;
  //console.log(globalVariable.test,php_var);
  $(document).ready( function() 
  {

    



    
    //console.log(php_var);
    $.ajax({
      url:"api/results",
      type:"POST",
      data:{"query":php_var},
      success:function(response)
      {
       
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




            