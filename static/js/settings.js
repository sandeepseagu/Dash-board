// Aux functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function change_card_retrieval(store_id)// change the toogle status when clicked and change in the db
{
  if($("#card_retrieval").val()=="true" || $("#card_retrieval").val()=="on")
  {
    var data={"store_id": store_id, "value": true};
  }
  else if($("#card_retrieval").val()=="false")
  {
    var data={"store_id":store_id, "value": false};
  }

  $.ajax({
    url:"api/settings/switch_card_retrieval_status",
    type:"POST",
    data:data,
    success:function(response){
      var active;
      if (data['value'])
        active = "activated";
      else
        active = "deactivated";

      var notif;
      if (response == "success") {
        notif = new PNotify({
          title: 'Card retrieval',
          text: 'Card retrieval <b>' + active + '</b> successfully.',
          type: 'success',
          styling: 'bootstrap3',
          buttons: {
            closer: false,
            sticker: false
          }
        });
      }
      else if (response == "error") {
        notif = new PNotify({
          title: 'Card retrieval',
          text: 'Card retrieval could not be <b>' + active + '</b>.',
          type: 'error',
          styling: 'bootstrap3',
          buttons: {
            closer: false,
            sticker: false
          }
        });
      }
      notif.get().click(function() {
        notif.remove();
      });
    }
  })
}

function change_registration_message(store_id)// change the toogle status when clicked and change in the db
{
  if($("#registration_message").val()=="true" || $("#registration_message").val()=="on")
  {
    var data={"store_id": store_id, "value": true};
  }
  else if($("#registration_message").val()=="false")
  {
    var data={"store_id":store_id, "value": false};
  }

  var enabled = ($("#registration_message").val() == 'true');

  $("#registration_message_change_button").prop('disabled', !enabled);
  $("#registration_message_text").prop('disabled', !enabled);

  $.ajax({
    url:"api/settings/switch_registration_message_option",
    type:"POST",
    data:data,
    success:function(response){
      var active;
      if (data['value'])
        active = "activated";
      else
        active = "deactivated";

      var notif;
      if (response == "success") {
        notif = new PNotify({
          title: 'Registration message',
          text: 'Registration message <b>' + active + '</b> successfully.',
          type: 'success',
          styling: 'bootstrap3',
          buttons: {
            closer: false,
            sticker: false
          }
        });
      }
      else if (response == "error") {
        notif = new PNotify({
          title: 'Registration message',
          text: 'Registration message could not be <b>' + active + '</b>.',
          type: 'error',
          styling: 'bootstrap3',
          buttons: {
            closer: false,
            sticker: false
          }
        });
      }
      notif.get().click(function() {
        notif.remove();
      });
    }
  })
}

$.ajax({
  url: 'api/get_stores',
  method: "POST",
  data: {},
  success: function (stores_ids) {
    var store_id = stores_ids[0].store_id;
    /////////////// Machines prices ///////////////

    // Machines prices
    const machines = ['washer', 'dryer', 'vending'];
    var machines_models = {
      washer: [],
      dryer: [],
      vending: []
    };
    var machines_curr_price = {
      washer: [],
      dryer: [],
      vending: []
    };
    var store_id = "0001";

    function get_stores_name() {
      var data = {store_ids: [store_id]};
      $.ajax({
        url:"api/dashboard_main/get_stores_name",
        type:"POST",
        data: data,
        success:function(response){
          $("#store_name").html(response[0]['store_name']);
        }
      })
    }

    var show_machines_prices = function() {
      // Reset arrays
      machines_models = {
        washer: [],
        dryer: [],
        vending: []
      };
      machines_curr_price = {
        washer: [],
        dryer: [],
        vending: []
      };

      $.each(machines, function(i, machine) {
        $.ajax({
            url:"api/settings/get_machine_price",
            type:"POST",
            data:{"store_id": store_id, "machine": machine},
            success:function(response)
            {
              if (response[0].length) {
                // Fill arrays
                for(var i=0;i<response[0].length;i++)
                {
                  machines_models[machine].push(response[0][i]);
                  machines_curr_price[machine].push(parseFloat(response[1][i]));
                  machines_curr_price[machine][i] = machines_curr_price[machine][i].toFixed(2);
                }
                $("#" + machine + 's_price_submit_btn').show();
                $("#" + machine + "_price_div").html(response[2]);
              }
              else {
                $("#" + machine + 's_price_submit_btn').hide();
                $("#" + machine + "_price_div").html('<p>There are no ' + machine + ' machines registered for this store.</p>');
              }
            }
        });
      });
    }

    // update machines price
    $.each(machines, function(i, machine) {
      $(document).on('click','#' + machine + 's_price_submit_btn', function()
      {
        var machine_entered_values=[];
        var len=machines_models[machine].length;
        for(var i=0; i<len;i++)
        {
            if(document.getElementById(machines_models[machine][i]).value ==='')
            {
                machine_entered_values[i]=machines_curr_price[machine][i];
            }
            else
            {
                if(isNaN(document.getElementById(machines_models[machine][i]).value)  )
                {
                    machine_entered_values[i]=machines_curr_price[machine][i];
                }
                else
                {

                    machine_entered_values[i]= document.getElementById(machines_models[machine][i]).value;
                }

            }

        }
        
        for (var i=0;i<machines_models[machine].length;i++)//updating the prices of washers for each model(by looping through each model of that store)
        {    
            update_machines_price(machine_entered_values[i],machines_models[machine][i]);// calling the ajax function upto no of models washers in that store and model no and entered price by user as arguments
        }

        function update_machines_price(prices, model) {
          $.ajax({
            url: "api/settings/update_machine_price",
            type: "POST",
            data: {"price": prices, "machine": machine, "model": model,"store_id": store_id},
            success: function(data) {
              var notif;
              if (data == "success") {
                notif = new PNotify({
                  title: capitalizeFirstLetter(machine) + 's price',
                  text: capitalizeFirstLetter(machine) + 's model ' + model + ' price successfully changed to <b>' + "$" + parseFloat(prices).toFixed(2) + '</b>.',
                  type: 'success',
                  styling: 'bootstrap3',
                  buttons: {
                    closer: false,
                    sticker: false
                  }
                });
                $("#" + machine + "_" + model + "_price").html("$" + parseFloat(prices).toFixed(2));
              }
              else if (data == "error") {
                notif = new PNotify({
                  title: capitalizeFirstLetter(machine) + 's price',
                  text: 'There was an error changing ' + machine + 's model ' + model + ' price to <b>' + "$" + parseFloat(prices).toFixed(2) + '</b>.',
                  type: 'error',
                  styling: 'bootstrap3',
                  buttons: {
                    closer: false,
                    sticker: false
                  }
                });
              }
              notif.get().click(function() {
                notif.remove();
              });
            }
          });
        }
      });
    });

    /////////////// End Machines prices ///////////////


    /////////////// Machines settings ///////////////
    function has_machines() {
      $.ajax({
        url:"api/settings/has_machines",
        type:"POST",
        data:{"store_id":store_id, "machine_type": "washer"},
        success:function(response)
        {
          if (response) {
            $("#balance_display_time").html("<label>Washer's</label> \
              <input type='text' class='settings_textbox' name='washer' id='Washer_display_time'> \
              <br><br> \
              <button  type='button' class='btn btn-success pull-right' id='change_balance_display_time_btn'>Submit</button>"
            )
          }
          else {
            $("#balance_display_time").html("<p>There are no washers registered in this store.</p>");
          }
        }
      })
    }


    $(document).on('click','#change_balance_display_time_btn', function()
    {
      var display_time = document.getElementById("Washer_display_time").value;
      if(display_time!='' )
      {
        $.ajax({
          url:"api/settings/update_washer's_balance_displaytime",
          type:"POST",
          data:{"display_time":display_time,"store_id": store_id},
          success:function(data)
          {
            var notif;
            if (data == "success") {
              notif = new PNotify({
                title: 'Display time',
                text: 'Washers display time successfully changed to <b>' + display_time + '</b>.',
                type: 'success',
                styling: 'bootstrap3',
                buttons: {
                  closer: false,
                  sticker: false
                }
              });
            }
            else if (data == "error") {
              notif = new PNotify({
                title: 'Display time',
                text: 'There was an error changing washers display time to <b>' + display_time + '</b>.',
                type: 'error',
                styling: 'bootstrap3',
                buttons: {
                  closer: false,
                  sticker: false
                }
              });
            }
            notif.get().click(function() {
              notif.remove();
            });
          }
        })
      }
    });

    var washer_current_runtime=[];
    var show_washer_runtime=function()
    {
      $.ajax({
        url:"api/settings/get_washers_runtime",
        type:"POST",
        data:{"store_id":store_id},
        success:function(response)
        {
          if (response[0].length) {
            for (var i=0;i<response[0].length;i++) 
            {
             washer_current_runtime.push(parseFloat(response[1][i]));
            }
            $("#update_washer_runtime_btn").show();
            $("#washer_runtime_table").html(response[2]);
          }
          else {
            $("#update_washer_runtime_btn").hide();
            $("#washer_runtime_table").html('<p>There are no washer machines registered for this store.</p>');
          }
        }
      });
    }

    $(document).on('click','#update_washer_runtime_btn', function()
    {
      var washer_runtime_entered_values=[];
      var len=machines_models['washer'].length;
      for(var i=0; i<len;i++)
      {
          if(document.getElementById(machines_models['washer'][i]+'Runtime').value==='')
          {
              washer_runtime_entered_values[i]=washer_current_runtime[i];
          }
          else
          {
              washer_runtime_entered_values[i]=document.getElementById(machines_models['washer'][i]+'Runtime').value;
          }       
      }
      for(var i=0;i<machines_models['washer'].length;i++)
      {  
          //updating the runtime of washers for each model(by looping through each model of that store)
          update_washers_runtime(washer_runtime_entered_values[i],machines_models['washer'][i]);// calling the ajax function upto no of models washers in that store and model no and entered runtime by user as arguments
      }
      function update_washers_runtime(runtime,model)
      {
        $.ajax({
          url:"api/settings/update_washers_runtime",
          type:"POST",
          data:{"runtime":runtime,"model":model,"store_id":store_id},
          success:function(data){
            var notif;
            if (data == "success") {
              notif = new PNotify({
                title: 'Washers cycle time',
                text: 'Washers cycle time successfully changed to <b>' + runtime + ' seconds</b>.',
                type: 'success',
                styling: 'bootstrap3',
                buttons: {
                  closer: false,
                  sticker: false
                }
              });

              $("#washer_" + model + "_runtime").html(runtime + " Sec");
            }
            else if (data == "error") {
              notif = new PNotify({
                title: 'Washers cycle time',
                text: 'There was an error changing washers cycle time to <b>' + runtime + ' seconds</b>.',
                type: 'error',
                styling: 'bootstrap3',
                buttons: {
                  closer: false,
                  sticker: false
                }
              });
            }
            notif.get().click(function() {
              notif.remove();
            });
          }
        })
      }
    });


    function getallMachines(data)
    {
        var machines_data = {"store":data};
        $.ajax({
            url:"api/settings/get_allmachines",
            type:"POST",
            data:machines_data,
            success:function(response)
            {
              if (response[0]) {
                $("#machine_list").html(response[1]);
                $("#start_machine-btn").show();
              }
              else {
                $("#machine_list").html("<p>There are no machines registered for this store.</p>");
                $("#start_machine-btn").hide();
              }
            }
        })
    }

    $("#start_machine-btn").click(function()
    {
      var machine_id = document.getElementById("machines_list").value;
      var url="http://localhost/IPS/publicapi/machine_start/"+machine_id+"/"+store_id+"/0000000001";
      var data={"url":url};
      $.ajax({
        url:"api/settings/start_machine",
        type:"POST",
        data:data,
        success:function(response){
          var notif;
          if (response == "success") {
            notif = new PNotify({
              title: 'Machine start',
              text: 'Machine <b>' + machine_id + '</b> started successfully.',
              type: 'success',
              styling: 'bootstrap3',
              buttons: {
                closer: false,
                sticker: false
              }
            });
          }
          else if (response == "error") {
            notif = new PNotify({
              title: 'Washers cycle time',
              text: 'There was an error starting machine <b>' + machine_id + '</b>.',
              type: 'error',
              styling: 'bootstrap3',
              buttons: {
                closer: false,
                sticker: false
              }
            });
          }
          notif.get().click(function() {
            notif.remove();
          });
        }
      })
    })

    /////////////// End Machines settings ///////////////


    /////////////// System settings ///////////////

    // Card retrieval
    function card_reterival_status(switchery_button) { // get current card retevial toogle status from db 
      $.ajax({
        url: "api/settings/current_card_retrieval",
        type: "POST",
        data: {"store_id": store_id},
        success:function(results) {
          if (results[0] != null && results[0] != undefined) {
            if (switchery_button.isDisabled())
              switchery_button.enable();
            if(results[0].value=='false')
            {
              setSwitchery(switchery_button, false);
              $("#card_retrieval").val("false");
            }
            else if(results[0].value=='true')
            {
              setSwitchery(switchery_button, true);
              $("#card_retrieval").val("true");
            }
          }
          else {
            $("#card_retrieval").val("false");
            setSwitchery(switchery_button, false);
            switchery_button.disable();
          }
        }
      });
    }

    // Registration message
    function get_registration_message(switchery_button) {// get current status of registration message toggle
      var data = {"store_id": store_id};
      $.ajax({
        url:"api/settings/current_registration_message",
        type:"POST",
        data:data,
        success:function(results){
          if (results[1][0] != null && results[1][0] != undefined) {
            if (switchery_button.isDisabled())
              switchery_button.enable();
            if(results[1][0].value=='false')
            {
              setSwitchery(switchery_button, false);
              $("#registration_message").val("false");
            }
            else if(results[1][0].value=='true')
            {
              setSwitchery(switchery_button, true);
              $("#registration_message").val("true");
            }

            var enabled = ($("#registration_message").val() == 'true');

            $("#registration_message_change_button").prop('disabled', !enabled);
            $("#registration_message_text").prop('disabled', !enabled);

            $('#registration_message_text').val(results[0][0].value);//populating textarea
          }
          else {
            switchery_button.disable();
            $("#registration_message").val("false");
            $("#registration_message_change_button").prop('disabled', true);
            $("#registration_message_text").val("");
            $("#registration_message_text").prop("disabled", true);
            setSwitchery(switchery_button, false);
          }
        }
      })
    }

    // Edit registration message
    $("#registration_message_change_button").click(function(e){
      e.preventDefault();
      var message=$("#registration_message_text").val();
      var data={"store_id":store_id,"message":message};
      $.ajax({
          url:"api/settings/update_registration_message",
          type:"POST",
          data:data,
          success:function(response){
            var notif;
            if (response == "success") {
              notif = new PNotify({
                title: 'Registration message',
                text: '<b>Registration message</b> changed successfully.',
                type: 'success',
                styling: 'bootstrap3',
                buttons: {
                  closer: false,
                  sticker: false
                }
              });
            }
            else if (response == "error") {
              notif = new PNotify({
                title: 'Registration message',
                text: '<b>Registration message</b> could not be changed.',
                type: 'error',
                styling: 'bootstrap3',
                buttons: {
                  closer: false,
                  sticker: false
                }
              });
            }
            notif.get().click(function() {
              notif.remove();
            });
          }
      })
    })

    // Min credit card value
    function get_minimum_credit_card_value()//getting minimum credit card transaction value
    {
      $.ajax({
        url:"api/settings/current_mincredit_val",
        type:"POST",
        data:{"store_id":store_id},
        success:function(results){
          if (results[0] != null && results[0] != null) {
            $("#minimum_credit_card_value").prop("disabled", false);
            $("#min_credit_card_val").prop("disabled", false);
           $("#minimum_credit_card_value").val(parseFloat(results[0].value).toFixed(2));
          }
          else {
            $("#minimum_credit_card_value").prop("disabled", true);
            $("#min_credit_card_val").prop("disabled", true);
            $("#minimum_credit_card_value").val("");
          }
        }
       })

    }

    $("#min_credit_card_val").click(function(){
      var value=$("#minimum_credit_card_value").val();

      $.ajax({
        url:"api/settings/update_mincredit_val",
        type:"POST",
        data:{"value":value,"store_id":store_id},
        success:function(response){
          var notif;
          if (response == "success") {
            notif = new PNotify({
              title: 'Min credit card value',
              text: 'Minimum credit card value changed successfully to <b>$' + parseFloat(value).toFixed(2) + '</b>.',
              type: 'success',
              styling: 'bootstrap3',
              buttons: {
                closer: false,
                sticker: false
              }
            });
          }
          else if (response == "error") {
            notif = new PNotify({
              title: 'Min credit card value',
              text: 'Minimum credit card value could not be changed to <b>$' + parseFloat(value).toFixed(2) + '</b>.',
              type: 'error',
              styling: 'bootstrap3',
              buttons: {
                closer: false,
                sticker: false
              }
            });
          }
          notif.get().click(function() {
            notif.remove();
          });
        }
      })
    })

    /////////////// End System settings ///////////////

    // Switchery auxiliary
    function setSwitchery(switchElement, checkedBool) {
        if((checkedBool && !switchElement.isChecked()) || (!checkedBool && switchElement.isChecked())) {
            switchElement.setPosition(true);
            switchElement.handleOnchange(true);
        }
    }

    $(document).ready(function() {
      // Switchery
      var switchery_elems = {};
      if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
          switchery_elems[html.id] = new Switchery(html, {
            color: '#26B99A'
          });
        });
      }
      // End Switchery

      function render_settings() {
        get_stores_name();
        show_machines_prices();
        has_machines();
        show_washer_runtime();
        getallMachines(store_id);
        card_reterival_status(switchery_elems['card_retrieval']);
        get_registration_message(switchery_elems['registration_message']);
        get_minimum_credit_card_value();
      }

      $.each(switchery_elems, function(i, elem) {
        $(elem.switcher).click(function(){
          if (!elem.isDisabled()) {
            var current_val = $(elem.element).val();
            if (current_val == "true")
              $(elem.element).val("false");
            else if (current_val == "false")
              $(elem.element).val("true");
            window["change_" + elem.element.id](store_id); // Call function associated to switch change
          }
        });
      });

      render_settings();

      // Stores filter
      $.each($("#stores_filter").children(), function(i, li) {
        $(document).on('click', "#" + li.id, function() {
          store_id = li.getAttribute('store_num');
        })
      });

      get_stores(function(_store_id) {
        store_id = _store_id;
        render_settings();
      });
    })
  }
});