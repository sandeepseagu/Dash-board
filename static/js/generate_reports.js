






function init_daterangepicker() {

            if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
            console.log('init_daterangepicker');
        
            var cb = function(start, end, label) {
              //console.log(start.toISOString(), end.toISOString(), label);
              $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            };

            var optionSet1 = {
              startDate: moment().subtract(29, 'days'),
              endDate: moment(),
              minDate: '01/01/2018',
              maxDate: '12/31/2025',
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
              //console.log("show event fired");
            });
            $('#reportrange').on('hide.daterangepicker', function() {
              //console.log("hide event fired");
            });
            $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
              //console.log("apply event fired, start/end dates are " + picker.startDate.format('MM-DD-YYYY') + " to " + picker.endDate.format('MM-DD-YYYY'));
              start_date=picker.startDate.format('YYYY-MM-DD');
              end_date=picker.endDate.format('YYYY-MM-DD');
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


    function excel_function()
    {

      var reporttype=  $("#report_types option:selected").val();
      var store=$("#stores_for_reports").val();
      

      if(reporttype=='CR')
      {
        collection_report_excel(store,start_date,end_date);
      }

      if(reporttype=='SR')
      {
        sales_report_excel(store,start_date,end_date);
      }
      
    }


    function pdf_function()
    {
      var reporttype= $("#report_types option:selected").val();
      var store=$("#stores_for_reports").val();
      console.log(reporttype,store,start_date);

      if (reporttype=='CR') 
      {
        collection_report_pdf(store,start_date,end_date);
      }

      if(reporttype=='SR')
      {
        sales_report_pdf(store,start_date,end_date);
      }


    }



    function sales_report_pdf(store,start_date,end_date)
    {
      var doc = new jsPDF();
      var washers_storage=[];
      var dryer_storage=[];
      var vending_storage=[];
      var washer_data=[];
      var dryer_data=[];
      var vending_data=[];
      var washer_total=[];
      var dryer_total=[];
      var vending_total=[];
      var store_name=[];
      var length=store.length;
      var temp=0.00;
      console.log(typeof temp);
      store_index=0;
      for(var i=0;i<store.length;i++)
      {
        $.ajax({
          url:"api/sales_reports",
          type:"POST",
          data:{"store":store[i],"start_date":start_date,"end_date":end_date},
          success:function(response)
          {
            console.log(response);
            var washers_response=response[1];
            var dryer_response=response[2];
            var vending_response=response[3];
            store_name[store_index]=response[0][0].store_name;
            if (washers_response==''||washers_response!='') 
            {
              if (washers_response=='') 
              {
                washers_storage=[];
                washer_total[store_index]=0;
              }
              for(var j=0;j<washers_response.length;j++)
              {
                washers_storage[j]=[washers_response[j].model,"$"+washers_response[j].sales];
                  //console.log(typeof temp,typeof parseFloat("$"+washers_response[j].sales),parseFloat("$"+washers_response[j].sales));
                temp=temp+parseFloat(washers_response[j].sales);
                //console.log(washers_response[j].sales,parseFloat(washers_response[j].sales),typeof temp,Math.abs(temp).toFixed(2));
                washer_total[store_index]=Math.abs(temp).toFixed(2);
              }
              washer_data[store_index]=washers_storage;
              temp=0.00;
              //console.log(washer_total[store_index],typeof (washer_total[store_index]).toString(),washer_total[store_index].toString());
              if (store_index==0) 
              {
                // defining table in the pdf
                var columns = ["Model","Sales"," "," ",""];
                var data = washer_data[0];
                var header = function (data) 
                {
                    doc.setFontSize(24);
                    doc.text("The Wash House", 70, 10);
                    doc.setFontSize(15);
                    doc.text("Sales_reports",80,15);
                    doc.setFontSize(12);
                    doc.text(moment().format('MM-DD-YYYY'),85,20);
                    doc.text("Store Name: "+store_name[0],15,33);
                     doc.setTextColor(0,0,0);
                    doc.text("Machine Type: Washer",17,40)
                                       
                };
                doc.autoTable(columns, data,{
                    columnStyles: {
                    id: {fillColor: 255},
                    0:{columnWidth:25},
                    1:{columnWidth:20},
                    },margin: {top: 43,left:17},
                    addPageContent: header,
                });
                doc.setFontSize(12);
                doc.text("Total: $"+washer_total[0].toString(),35,doc.autoTableEndPosY() + 5);
              }
            }

           if(dryer_response==''||dryer_response!='')
           {
              if(dryer_response=='')
              {
                dryer_storage=[];
                dryer_total[store_index]=0;
              }
              for(var j=0;j<dryer_response.length;j++)
              {
                dryer_storage[j]=[dryer_response[j].model,"$"+dryer_response[j].sales];
                temp=temp+parseFloat(dryer_response[j].sales);
                dryer_total[store_index]=Math.abs(temp).toFixed(2);;
              }
              dryer_data[store_index]=dryer_storage;
              temp=0.00;
              if (store_index==0) 
              {
                // defining table in the pdf
                var columns = ["Model","Sales"," "," ",""];
                var data = dryer_data[0];
                //doc.text(store_name[0],15,33);
                var header=function(data)
                {
                    doc.setFontSize(12);
                    doc.setTextColor(0,0,0);
                    doc.text("Machine Type: Dryer",17,doc.autoTableEndPosY() + 15); 
                }
                doc.autoTable(columns, data,{
                    columnStyles: {
                    id: {fillColor: 255},
                    0:{columnWidth:25},
                    1:{columnWidth:20},
                    },margin: {top: doc.autoTableEndPosY() + 18,left:17},
                    addPageContent: header,
                });
                doc.text("Total: $"+dryer_total[0].toString(),35,doc.autoTableEndPosY() + 5);
              }
            } 

            if(vending_response==''|| vending_response!='')
            {
              if(vending_response=='')
              {
                vending_storage=[];
                vending_total[store_index]=0;
              }
              for(var j=0;j<vending_response.length;j++)
              {
                vending_storage[j]=[vending_response[j].model,"$"+vending_response[j].sales];
                temp=temp+parseFloat(vending_response[j].sales);
                vending_total[store_index]=Math.abs(temp).toFixed(2);;
              }
              vending_data[store_index]=vending_storage;
              temp=0.00;
              if (store_index==0) 
              {
                // defining table in the pdf
                var columns = ["Model","Sales"," "," ",""];
                var data = vending_data[0];
                //doc.text(store_name[0],15,33);
                var header=function(data)
                {
                    doc.setFontSize(12);
                    doc.setTextColor(0,0,0);
                    doc.text("Machine Type: Vending",17,doc.autoTableEndPosY() + 15); 
                }
                doc.autoTable(columns, data,{
                    columnStyles: {
                    id: {fillColor: 255},
                    0:{columnWidth:25},
                    1:{columnWidth:20},
                    },margin: {top: doc.autoTableEndPosY() + 18,left:17},
                    addPageContent: header,
                });
                doc.text("Total: $"+vending_total[0].toString(),35,doc.autoTableEndPosY() + 5);
              }
            }

            washers_storage=[];
            dryer_storage=[];
            vending_storage=[];
            store_index=store_index+1;
            if (store_index==length) 
            {
              for(var j=1;j<store.length;j++)
              {
                var columns = ["Model","Sales"," "," ",""];
                var data=washer_data[j];
                var header = function (data) 
                {
                    doc.setFontSize(12);
                    doc.setTextColor(0,0,0);
                    doc.text("Store Name: "+store_name[j],15,doc.autoTableEndPosY() + 30);
                    doc.text("Machine Type: Washer",17,doc.autoTableEndPosY() + 37);
                };
                doc.autoTable(columns, data,{
                  columnStyles: {
                  id: {fillColor: 255},
                  0:{columnWidth:25},
                  1:{columnWidth:20},
                  },margin: {top: doc.autoTableEndPosY() + 40,left:17},
                  addPageContent: header,
                  });
                doc.text("Total: $"+washer_total[j].toString(),35,doc.autoTableEndPosY() + 5);


                var columns = ["Model","Sales"," "," ",""];
                var data = dryer_data[j];
                //doc.text(store_name[0],15,33);
                var header=function(data)
                {
                  doc.setFontSize(12);
                  doc.setTextColor(0,0,0);
                  doc.text("Machine Type: Dryer",17,doc.autoTableEndPosY() + 15); 
                }
                doc.autoTable(columns, data,{
                  columnStyles: {
                  id: {fillColor: 255},
                  0:{columnWidth:25},
                  1:{columnWidth:20},
                  },margin: {top: doc.autoTableEndPosY() + 18,left:17},
                  addPageContent: header,
                  });
                doc.text("Total: $"+dryer_total[j].toString(),35,doc.autoTableEndPosY() + 5);


                var columns = ["Model","Sales"," "," ",""];
                var data = vending_data[j];
                //doc.text(store_name[0],15,33);
                var header=function(data)
                {
                  doc.setFontSize(12);
                  doc.setTextColor(0,0,0);
                  doc.text("Machine Type: Vending",17,doc.autoTableEndPosY() + 15); 
                }
                doc.autoTable(columns, data,{
                  columnStyles: {
                  id: {fillColor: 255},
                  0:{columnWidth:25},
                  1:{columnWidth:20},
                  },margin: {top: doc.autoTableEndPosY() + 18,left:17},
                  addPageContent: header,
                  });
                doc.text("Total: $"+vending_total[j].toString(),35,doc.autoTableEndPosY() + 5);
              }
              doc.save("Sales Report "+start_date+"-"+end_date+".pdf");
            }
            
          }
        })
      }
      




    }


    function sales_report_excel(store,start_date,end_date)
    {

      var store_index=0;
      var store_name=[];
      var washers_storage=[];
      var dryer_storage=[];
      var vending_storage=[];
      var washer_total=[];
      var dryer_total=[];
      var vending_total=[];
      var temp=0;
      var rows=2;
      var length=0;
      var excel = $JExcel.new("Calibri light 10 #333333");  
      excel.set( {sheet:0,value:"This is Sheet 1" });
      excel.set({row:0,value: 15  });
      var formatHeader=excel.addStyle({                                     // Format for headers
      border: "none,none,none,none #333333",                            // Border for header
      font: "Calibri 12 #0000AA B"});                                   //Font for headers

      excel.set(0,5,0,"The Wash House",formatHeader);
      excel.set(0,5,1,"Sales Reports",formatHeader);
      excel.set(0,5,undefined,"auto");   
      for(var i=0;i<store.length;i++)
      {
        $.ajax({
          url:"api/sales_reports",
          type:"POST",
          data:{"store":store[i],"start_date":start_date,"end_date":end_date},
          success:function(response)
          {
            console.log(response);
            var washers_response=response[1];
            var dryer_response=response[2];
            var vending_response=response[3];
            store_name[store_index]=response[0][0].store_name;
            if(washers_response==''||washers_response!='')
            {
              if(washers_response=='')
              {
                washers_storage=[];
                washer_total[store_index]=0;
              }
              for(var j=0;j<washers_response.length;j++)
              {
                washers_storage[j]=[washers_response[j].model,"$"+washers_response[j].sales];
                temp=temp+parseFloat(washers_response[j].sales);
                washer_total[store_index]=temp;
              }
              temp=0;
              rows=rows+1;
              //console.log(rows,store_name[store_index]);
              console.log(washer_total[store_index]);
              excel.set(0,0,rows,store_name[store_index],formatHeader);
              rows=rows+1;
              temp=0;
              excel.set(0,0,undefined,"auto");
              excel.set(0,0,rows,"Washer Revenue");
              rows=rows+1;
              var data_labels=['Model','Sales'];
              console.log(washers_storage);
              for(var j=0;j<data_labels.length;j++)
              {
                excel.set(0,j,rows,data_labels[j]);
              }
              rows=rows+1;
              for(var i=0;i<washers_storage.length;i++)// current store iteration
              {
                for(var j=0;j<washers_storage[i].length;j++)// looping all the items of the store
                {
                  //console.log(j,rows);
                  //excel.set(0,j,rows,washers_storage[i][j]);//posting the data on the excel sheet
                  
                  excel.set(0,j,rows,washers_storage[i][j]);
                }
                rows=rows+1;
              }

              excel.set(0,0,rows,"Total:");
              excel.set(0,1,rows,"$"+washer_total[store_index]);
              rows=rows+1;
            }

            if(dryer_response==''||dryer_response!='')
            {
              if(dryer_response=='')
              {
                dryer_storage=[];
                dryer_total[store_index]=0;
              }
              for(var j=0;j<dryer_response.length;j++)
              {
                dryer_storage[j]=[dryer_response[j].model,"$"+dryer_response[j].sales];
                temp=temp+parseFloat(dryer_response[j].sales);
                dryer_total[store_index]=temp;
              }
              temp=0;
              rows=rows+1;
              //console.log(rows,store_name[store_index]);
              //excel.set(0,0,rows,store_name[store_index],formatHeader);
              rows=rows+1;
              temp=0;
              excel.set(0,0,undefined,"auto");
              excel.set(0,0,rows,"Dryer Revenue");
              rows=rows+1;
              var data_labels=['Model','Sales'];
              for(var j=0;j<data_labels.length;j++)
              {
                excel.set(0,j,rows,data_labels[j]);
              }
              //console.log(dryer_storage[0][0]);
              rows=rows+1;
              for(var i=0;i<dryer_storage.length;i++)// current store iteration
              {
                for(var j=0;j<dryer_storage[i].length;j++)// looping all the items of the store
                {
                  //console.log(j,rows);
                  //excel.set(0,j,rows,washers_storage[i][j]);//posting the data on the excel sheet
                  console.log("drying");
                  excel.set(0,j,rows,dryer_storage[i][j]);
                }
                rows=rows+1;
              }
              excel.set(0,0,rows,"Total:");
              excel.set(0,1,rows,"$"+dryer_total[store_index]);
              rows=rows+1;
            }

            if(vending_response==''||vending_response!='')
            {
              if(vending_response=='')
              {
                vending_storage=[];
                vending_total[store_index]=0;
              }
              for(var j=0;j<vending_response.length;j++)
              {
                vending_storage[j]=[vending_response[j].model,"$"+vending_response[j].sales];
                temp=temp+parseFloat(vending_response[j].sales);
                vending_total[store_index]=temp;
              }
              temp=0;
              rows=rows+1;
              //console.log(rows,store_name[store_index]);
              //excel.set(0,0,rows,store_name[store_index],formatHeader);
              rows=rows+1;
              temp=0;
              excel.set(0,0,undefined,"auto");
              excel.set(0,0,rows,"Vending Revenue");
              rows=rows+1;
              var data_labels=['Model','Sales'];
              for(var j=0;j<data_labels.length;j++)
              {
                excel.set(0,j,rows,data_labels[j]);
              }
              rows=rows+1;

              for(var i=0;i<vending_storage.length;i++)// current store iteration
              {
                for(var j=0;j<vending_storage[i].length;j++)// looping all the items of the store
                {
                  //console.log(j,rows);
                  console.log("vending");
                  //excel.set(0,j,rows,washers_storage[i][j]);//posting the data on the excel sheet
                  excel.set(0,j,rows,vending_storage[i][j]);
                }
                rows=rows+1;
              }
              excel.set(0,0,rows,"Total:");
              excel.set(0,1,rows,"$"+vending_total[store_index]);
              rows=rows+1;
            }
            washer_storage=[];
            dryer_storage=[];
            vending_storage=[];
            rows=rows+1;
            length=length+1;//increasing the length of options length
            store_index=store_index+1;
            if(length==store.length)
            {
              excel.generate("Sales Report "+start_date+"-"+end_date+".xlsx");
            }
          }
        })// end of ajax
      }
    }


    function collection_report_pdf(store,start_date,end_date)
    {

      
      var doc = new jsPDF();
      var store_name=[];
      var store_index=0;
      var row=[];
      var store_data=[];
      var stores_length=store.length;
      var store_total=[];
      var temp=0;
               
      for(var i=0;i<store.length;i++)
      {
        $.ajax({
          url:"api/collection_reports",
          type:"POST",
          data:{"store":store[i],"start_date":start_date,"end_date":end_date},
          success:function(response)
          {


            console.log(response);
            var collection_data=response[1];
            store_name[store_index]=response[0][0].store_name;
            console.log(store_name[store_index],store_index);

            if (collection_data==''|| collection_data!='') 
            {
              if(collection_data=='')
              {
                row=[];
                store_total[store_index]=0;

              }
              for(var j=0;j<collection_data.length;j++)
              {
                row[j]=[collection_data[j].date,collection_data[j].store_id,collection_data[j].local_id,collection_data[j].one,collection_data[j].two,
                  collection_data[j].five,collection_data[j].ten,collection_data[j].twenty,collection_data[j].fifty,collection_data[j].hundred,collection_data[j].total];
                temp=temp+parseInt(collection_data[j].total);
                                        
                store_total[store_index]=temp;
              }

              store_data[store_index]=row;
              temp=0;
               

              if(store_index==0)
              {
                  var columns = ["Date","store_id","terminal","1$","2$","5$","10$","20$","50$","100$","total"];
                  var data = store_data[0];

                  var header = function (data) 
                  {
                    doc.setFontSize(20);
                    doc.text("The Wash House", 77, 10);
                    doc.setFontSize(15);
                    doc.text("Collection_reports",83,15);
                    doc.setFontSize(12);
                    doc.text(moment().format('MM-DD-YYYY'),90,20);
                                           
                  };  

                  header();
                  doc.text(store_name[0],15,33);
                  doc.autoTable(columns, data,{
                      columnStyles: {
                          id: {fillColor: 255},
                          0:{columnWidth:25},
                          1:{columnWidth:20},
                          2:{columnWidth:20},
                          3:{columnWidth:12},
                          4:{columnWidth:12},
                          5:{columnWidth:12},
                          6:{columnWidth:12},
                          7:{columnWidth:12},
                          8:{columnWidth:12},
                          9:{columnWidth:12},
                          10:{columnWidth:20},
                      },margin: {top: 35},
                    
                  });
                  doc.text(store_total[0].toString(),165,doc.autoTableEndPosY() + 5); 
              }
                 
              row=[];
              store_index=store_index+1;  
              if (store_index==stores_length)
              {

                for(var i=1;i<store.length;i++)
                {
                    var columns = ["Date","store_id","terminal","1$","2$","5$","10$","20$","50$","100$","total"];
                    var data = store_data[i];
                    doc.text(store_name[i],15,doc.autoTableEndPosY() + 35);
                    doc.autoTable(columns, data,{
                      startY: doc.autoTableEndPosY() + 37,
                      columnStyles: {
                        id: {fillColor: 255},
                        0:{columnWidth:25},
                        1:{columnWidth:20},
                        2:{columnWidth:20},
                        3:{columnWidth:12},
                        4:{columnWidth:12},
                        5:{columnWidth:12},
                        6:{columnWidth:12},
                        7:{columnWidth:12},
                        8:{columnWidth:12},
                        9:{columnWidth:12},
                        10:{columnWidth:20},
                      },margin: {top: 30}
                      
                    });
                     doc.text(store_total[i].toString(),165,doc.autoTableEndPosY() + 5);
                                            
                }
                
                doc.save("Collections Report "+start_date+"-"+end_date+".pdf");
              }   
            }
          }// end success
        })// end ajax
      }//end for loop
    }// end function

    function collection_report_excel(store,start_date,end_date)
    {

      var row=[];
      var temp=0;
      var store_total=[]; 
      var store_name=[]
      var store_index=0;
      var length=0;
      var excel = $JExcel.new("Calibri light 10 #333333");  
      excel.set( {sheet:0,value:"This is Sheet 1" });
      var rows=2;
      excel.set({row:0,value: 15  });
      var formatHeader=excel.addStyle({                                     // Format for headers
            border: "none,none,none,none #333333",                            // Border for header
            font: "Calibri 12 #0000AA B"});
                                               //Font for headers
            excel.set(0,5,0,"The Wash House",formatHeader);
            excel.set(0,5,1,"Collection Reports",formatHeader);
            excel.set(0,5,undefined,"auto");   


      for(var i=0;i<store.length;i++)
      {

        console.log(store[i],store.length,i);
        $.ajax({
         url:"api/collection_reports",
         type:"POST",
         data:{"store":store[i],"start_date":start_date,"end_date":end_date},
         success:function(response)
         {
          store_name[store_index]=response[0][0].store_name;
          var collection_data=response[1];
          if(collection_data==''|| collection_data!='')
          {

            if(collection_data=='')
            {
               row=[];
               store_total[store_index]=0;

            }

            for(var j=0;j<collection_data.length;j++)
            {
              row[j]=[collection_data[j].date,collection_data[j].store_id,collection_data[j].local_id,collection_data[j].one,collection_data[j].two,
                collection_data[j].five,collection_data[j].ten,collection_data[j].twenty,collection_data[j].fifty,collection_data[j].hundred,collection_data[j].total];
              temp=temp+parseInt(collection_data[j].total);
              store_total[store_index]=temp;
            }
            
            temp=0// make temp=0 to store total for next store
            rows=rows+1;
            excel.set(0,0,rows,store_name[store_index],formatHeader);// store name
            rows=rows+1;
            
            var data_labels=['Date','Store Id','Terminal Id','1$','2$','5$','10$','20$','50$','100$','Total'];
            for(var j=0;j<data_labels.length;j++)
            {
                excel.set(0,j,rows,data_labels[j]);

            }
                                    
            excel.set(0,0,undefined,"auto");// increase width of first column
            rows=rows+1;
            
            for(var i=0;i<row.length;i++)// current store iteration
            {
                for(var j=0;j<row[i].length;j++)// looping all the items of the store
                {
                                           
                    excel.set(0,j,rows,row[i][j]);//posting the data on the excel sheet
                }
                rows=rows+1;
                                        
            }
            excel.set(0,9,rows,"Total:");
            excel.set(0,10,rows,"$"+store_total[store_index]);                          
            rows=rows+1;
            length=length+1;
            store_index=store_index+1;
            console.log(row);
            row=[];
            if(length==store.length)
            {
                console.log(start_date,end_date);
                excel.generate("Collections Report "+start_date+"-"+end_date+".xlsx");
            }
          } 
         }
        })
      }
    }
       

     
    $(document).ready(function() {


      $.ajax({
        url:"api/all_stores",
        type:"GET",
        success:function(response){
            //console.log(response);
            $("#stores_for_reports").html(response);
            }
        })


      var start_date;
      var end_date;
      
      
      $( "#generate_excel" ).click(function() {
        excel_function();
        });

      $("#generate_pdf").click(function(){
        pdf_function();
      });


      init_daterangepicker();

      });