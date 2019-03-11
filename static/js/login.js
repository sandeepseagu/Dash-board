function login(sitekey) {
  const login_form = $('#login_form');
  $.ajax({
    url: "api/auth/login_process",
    type:"POST",
    data: login_form.serialize(),
    success: function(response) {
      get_recaptcha(sitekey);
      var notif;
      if (response['status'] == "success") {
        location.href = response['redirect_url'];
      }
      else {
        notif = new PNotify({
          title: 'Login error',
          text: response['error_msg'],
          type: 'error',
          styling: 'bootstrap3',
          buttons: {
              closer: false,
              sticker: false
          }
        });
        notif.get().click(function() {
          notif.remove();
        });
      }
    }
  });
}

function get_recaptcha(sitekey) {
  grecaptcha.ready(function() {
    grecaptcha.execute(sitekey, {action: 'validate_captcha'}).then(function(token) {
      document.getElementById('g-recaptcha-response').value = token;
    });
  });
}

$(document).ready( function() {
  const sitekey = '6LfBXY8UAAAAAANyoX5NBT4FmmumnWxHn6t2N4Q0';
  get_recaptcha(sitekey);

  $('#login_button').click( function(e) {
    e.preventDefault();
    login(sitekey);
    
  })
});