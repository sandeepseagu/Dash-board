$(document).ready(function() {

  function get_users() {
    return $.ajax({
        url: "api/auth/get_managed_users",
        type: "POST",
        data: {},
        success: function(response) {
          for (i in response) {
            $("#users").append('<option value="' + response[i].user_id + '">' + response[i].username + '</option>');
          }
        }
    });
  }

  function unselect_checkboxes() {
    $.each($('.store_checkbox'), function(index, checkbox) {
      $(checkbox).prop('checked', false);
    });
  }

  function render_logged_user_stores() {
    return $.ajax({
        url: "api/auth/get_user_stores",
        type: "POST",
        data: {},
        success: function(response) {
          for (i in response) {
            $("#stores").append('<li class="li-break"><label class="store_checkbox center-checkbox" style="width:160px;"><input id="checkbox_' + response[i].store_id + '" class="store_checkbox" type="checkbox" name="stores[]" value="' + response[i].store_id + '"> ' + response[i].store_name + '</label></li>');
          }
        }
    });
  }

  function get_user_stores(user_id) {
    $.ajax({
      url: "api/auth/get_user_stores",
      type: "POST",
      data: {user_id: user_id},
      success: function(response) {
        unselect_checkboxes();
        for (i in response) {
          var store_id = response[i].store_id;
          $("#checkbox_" + store_id).prop('checked', true);
        }
      }
    });
  }

  function assign_stores() {
    $.ajax({
      url: "api/auth/get_user_stores",
      type: "POST",
      data: {user_id: user_id},
      success: function(response) {
        unselect_checkboxes();
        for (i in response) {
          var store_id = response[i].store_id;
          $("#checkbox_" + store_id).prop('checked', true);
        }
      }
    });
  }


  $('#users').on('change', function() {
    get_user_stores($(this).val());
  });

  const ajax1 = get_users();
  const ajax2 = render_logged_user_stores();

  $.when(ajax1, ajax2).done(function (users_response, stores_response) { // When both ajax calls are done
    get_user_stores($('#users').val());
  });

  $("#assign_stores_button").click( function() {
    $.ajax({
        url: "api/auth/assign_stores_user",
        type: "POST",
        data: $('#assign_stores_form').serialize(),
        success: function(response) {
          var notif;
          if (response['status'] == "success") {
            notif = new PNotify({
              title: "Assign stores",
              text: "Stores assigned successfully",
              type: 'success',
              styling: 'bootstrap3',
              buttons: {
                  closer: false,
                  sticker: false
              }
            });
          }
          else {
            var msg = "There was an error assigning stores";
            if ('msg' in response)
              msg = response['msg'];
            
            notif = new PNotify({
              title: "Assign stores",
              text: msg,
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
  })
});
