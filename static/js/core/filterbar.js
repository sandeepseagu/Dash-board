function get_stores(process_stores) {
  $.ajax({
    url:"api/get_stores",
    type:"POST",
    data:{},
    success: function(response) {
      $.each(response, function(i, store_data) {
        var li_option = $('<li id="store_' + store_data['store_id'] + '" store_num="' + store_data['store_id'] + '"><a>' + store_data['store_name'] + '</a></li>');
        li_option.click(function() {
          store_id = li_option[0].getAttribute('store_num');
          process_stores(store_id);
        });
        $("#stores_filter").append(li_option);
      });
    }
  });
}
