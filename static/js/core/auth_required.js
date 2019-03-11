$(document).ready(function() {
  setInterval(function() {
    $.ajax({
      url: "api/auth/redirect_not_loggedin_ajax",
      method: "POST",
      data: {},
      success: function (response) {
      // Check if logged in
        if (response['not_loggedin']) {
          location.href = response['redirect_url'];
        }
      }
    })
  }, 30000);
});