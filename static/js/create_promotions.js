function get_promotions() {
  var data = {
    'store': $('#promo_store').val()
  }
  $.ajax({
    url:"api/promotions/get_promotion",
    type:"POST",
    data:data,
    //dataType:"json",
    success:function(result){
      if (result['added_value']['value'] != null)
        $('#added_value_current').html("<span>Currently: $" + result['added_value']['value'] + " every $" + result['added_value']['trigger_value'] + " added</span>")
      else
        $('#added_value_current').html("<span>There is no active promo for this store yet</span>")
      
      if (result['added_percentage']['value'] != null)
        $('#added_percentage_current').html("<span>Currently: %" + result['added_percentage']['value'] + " every $" + result['added_percentage']['trigger_value'] + " added</span>")
      else
        $('#added_percentage_current').html("<span>There is no active promo for this store yet</span>")
    }
  });
}

$(document).on('click','.big_bill_submit', function(event){
    var button = $(event.target);                 
    var data = $('#big_bill_bonus_form').serialize()
        + '&' 
        + encodeURI(button.attr('name'))
        + '='
        + encodeURI(button.attr('value'));
    console.log(data);

    $.ajax({
        url:"api/promotions/add_promotion",
        type:"POST",
        data:data,
        success:function(response){
          var notif;
          if (response['status'] == "success") {
            notif = new PNotify({
              title: 'Add promotion',
              text: response['msg'],
              type: 'success',
              styling: 'bootstrap3',
              buttons: {
                  closer: false,
                  sticker: false
              }
            });
          }
          else {
            var msg;
            if (!'msg' in response)
              msg = "There was an error resetting the promo";
            else
              msg = response['msg'];

            notif = new PNotify({
              title: 'Add promotion',
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
          get_promotions();
        }
    });
});

$(document).on('change','#promo_store', function(){
    $('#added_value_msg').empty();
    $('#added_percentage_msg').empty();
    get_promotions();
});

var promo_types = ['value', 'percentage'];

$.each(promo_types, function(i, promo_type) {
  $('#reset_' + promo_type).click(function(e) {
    const data = {
      store_id: $('#promo_store').val(),
      promo_type: promo_type
    };
    console.log(data)
    $.ajax({
      url:"api/promotions/reset_promotion",
      type:"POST",
      data:data,
      success:function(response) {
        var notif;
        if (response['status'] == "success") {
          notif = new PNotify({
            title: 'Promotion reset',
            text: response['msg'],
            type: 'success',
            styling: 'bootstrap3',
            buttons: {
                closer: false,
                sticker: false
            }
          });
        }
        else {
          var msg;
          if (!'msg' in response) {
            msg = "There was an error resetting the promo";
          }
          else {
            msg = response['msg'];
          }
          notif = new PNotify({
            title: 'Promotion reset',
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
        get_promotions();
      }
    });
  });
});

$(document).ready(function() {
  $.ajax({
    url:"api/promotions/get_stores_forpromos",
    type:"GET",
    success:function(data){
      $("#promo_store").html(data);
    }
  });
});