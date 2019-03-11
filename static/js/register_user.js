// Aux functions
function capitalizeFirstLetter(string) {
    string = string.toLowerCase();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function get_roles() {
  $.ajax({
    url: "api/auth/get_roles",
    type: "POST",
    data: {},
    success: function(response) {
      for (i in response) {
        $("#role").append('<option value="' + response[i]['role'] + '">Level ' + response[i]['level'] + '</option>');
      }
    }
  });
}

function get_stores() {
  $.ajax({
    url: "api/get_all_stores",
    type: "POST",
    data: {},
    success: function(response) {
      for (i in response) {
        $("#stores").append('<li class="li-break"><label class="center-checkbox" style="width:160px;"><input class="store_checkbox" type="checkbox" name="stores[]" value="' + response[i].store_id + '"> ' + response[i].store_name + '</label></li>');
      }
    }
  });
}

function register() {
  var file_data = $('#picture').prop('files')[0];
  var form_data = new FormData($('#registration_form')[0]);
  form_data.append('picture', file_data);
  $.ajax({
    url: "api/auth/registration",
    type: "POST",
    data: form_data,
    contentType: false,
    processData: false,
    success: function(response) {
      var notif;
      if (response == "success") {
        notif = new PNotify({
          title: 'User registration',
          text: 'User registered successfully.',
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
          title: 'User registration',
          text: String(response),
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
function init_SmartWizard() {
  
  if( typeof ($.fn.smartWizard) === 'undefined'){ return; }
  console.log('init_SmartWizard');
  
  $('#wizard').smartWizard({
    keyNavigation: false,
    enableFinishButton: false,
    labelFinish:'Register',
    onFinish: function() {
      register();
    }
  });

  $('.buttonNext').addClass('btn btn-success');
  $('.buttonPrevious').addClass('btn btn-primary');
  $('.buttonFinish').addClass('btn btn-default');
  
};

$('#role').on('change', function(e) {
  var valueSelected = this.value;

  if (valueSelected == 'ADMIN') {
    $("#stores").hide();
    $("#stores_label").hide();
    $.each($(".store_checkbox"), function(i, checkbox) {
      checkbox.checked = false;
    });
  }
  else {
    $("#stores").show();
    $("#stores_label").show();
  }
});

$(document).ready(function() {
  get_roles();
  get_stores();
  init_SmartWizard();
})