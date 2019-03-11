// Aux functions
function capitalizeFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function get_user_profile() {
  // Get user profile
  $.ajax({
    url:"api/auth/get_user_profile",
    type:"POST",
    data:{},
    success:function(response){
      $("#username_previous_div").html(response['username']);
      
      const p_fields = ['first_name', 'last_name', 'phone', 'address'];
      const img_fields = ['picture'];

      for (i in p_fields) {
        $("#" + p_fields[i] + "_previous_div").html(response[p_fields[i]]);
        $("#" + p_fields[i]).val(response[p_fields[i]]);
      }
      for (j in img_fields) {
        $("#" + img_fields[j] + "_previous_div").html('<img style="width: 20%;" src="' + response[img_fields[j]] + '"/>');
      }
      update_sidebar_user_picture(response['picture']);
      update_topbar_user_picture(response['picture']);

      // Assign user id
      $('input[name=user_id]').val(response['user_id']);
      
    }
  })
}

function get_username() {
  // Get user profile
  $.ajax({
    url:"api/auth/get_username",
    type:"POST",
    data:{},
    success:function(response){
      $("#username_previous_div").html(response['username']);
      
      const p_fields = ['username'];

      for (i in p_fields) {
        $("#" + p_fields[i] + "_previous_div").html(response[p_fields[i]]);
        $("#" + p_fields[i]).val(response[p_fields[i]]);
      }
      update_topbar_username(response['username']);
    }
  })
}

function edit_section_on(elem_type) {
  var previous_section = $('#' + elem_type + '_previous_div');
  var section = $('#' + elem_type + '_div');
  var section_button = $('#' + elem_type + '_form_button_div')
  var section_off_icon = $('#edit_' + elem_type + '_off');
  var section_on_icon = $('#edit_' + elem_type + '_on');
  previous_section.hide();
  section.show();
  section_button.show();
  section.removeClass("hidden");
  section_off_icon.show();
  section_off_icon.removeClass("hidden");
  section_on_icon.hide();
  section_on_icon.addClass("hidden");
}

function edit_section_off(elem_type) {
  var previous_section = $('#' + elem_type + '_previous_div');
  var section = $('#' + elem_type + '_div');
  var section_button = $('#' + elem_type + '_form_button_div');
  var section_off_icon = $('#edit_' + elem_type + '_off');
  var section_on_icon = $('#edit_' + elem_type + '_on');
  section.hide();
  section_button.hide();
  section.addClass("hidden");
  previous_section.show();
  section_off_icon.hide();
  section_off_icon.addClass("hidden");
  section_on_icon.show();
  section_on_icon.removeClass("hidden");
}

function update_user_profile() {
  var file_data = $('#picture').prop('files')[0];
  var form_data = new FormData($('#user_profile_form')[0]);
  form_data.append('picture', file_data);
  $.ajax({
    url:"api/auth/update_user_profile",
    type:"POST",
    data: form_data,
    contentType: false,
    processData: false,
    success: function (response) {
      var notif;
      if (response == "success") {
        get_user_profile();
        edit_section_off("user_profile");
        notif = new PNotify({
          title: 'User profile update',
          text: 'User profile updated successfully.',
          type: 'success',
          styling: 'bootstrap3',
          buttons: {
            closer: false,
            sticker: false
          }
        });
      }
      else {
        notif = new PNotify({
          title: 'User profile update',
          text: 'There was an error updating user profile',
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

function update_username() {
  var form_data = $('#username_form').serialize();
  $.ajax({
    url:"api/auth/update_username",
    type:"POST",
    data: form_data,
    success: function (response) {
      var notif;
      if (response == "success") {
        get_username();
        edit_section_off("username");
        notif = new PNotify({
          title: 'Username update',
          text: 'Username updated successfully.',
          type: 'success',
          styling: 'bootstrap3',
          buttons: {
            closer: false,
            sticker: false
          }
        });
      }
      else {
        notif = new PNotify({
          title: 'Username update',
          text: response,
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
 
function update_password() {
  var form_data = $('#password_form').serialize();
  $.ajax({
    url:"api/auth/update_password",
    type:"POST",
    data: form_data,
    success: function (response) {
      $("input[type=password]").val("");
      var notif;
      if (response == "success") {
        edit_section_off("password");
        notif = new PNotify({
          title: 'Password update',
          text: 'Password updated successfully.',
          type: 'success',
          styling: 'bootstrap3',
          buttons: {
            closer: false,
            sticker: false
          }
        });
      }
      else {
        notif = new PNotify({
          title: 'Password update',
          text: response,
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

$(document).ready(function() {
  get_user_profile();

  const edit_buttons_ids = [
    'username',
    'password',
    'user_profile'
  ];

  $.each(edit_buttons_ids, function (i, elem_type) {
    $('#edit_' + elem_type + '_on').click(function(e) {
      e.preventDefault();
      edit_section_on(elem_type);
    });
    $('#edit_' + elem_type + '_off').click(function(e) {
      e.preventDefault();
      edit_section_off(elem_type);
    });
  });

  $('#user_profiles_form_button').click( function(e) {
    e.preventDefault();
    update_user_profile();
  });
  $('#username_form_button').click( function(e) {
    e.preventDefault();
    update_username();
  })
  $('#password_form_button').click( function(e) {
    e.preventDefault();
    update_password();
  })
})