function get_stores(process_stores) {
  $.ajax({
    url:"api/get_stores",
    type:"POST",
    data:{},
    success: function(response) {
      $.each(response, function(i, store_data) {
        const li_option = $('<li id="store_' + store_data['store_id'] + '" store_num="' + store_data['store_id'] + '" class="li-break"><label class="center-checkbox" style="width:160px;"><input id="checkbox_' + response[i].store_id + '" class="store_checkbox" type="checkbox" name="stores[]" value="' + response[i].store_id + '"> ' + response[i].store_name + '</label></li>');
        li_option.click( function(e) {
          $('#all_stores_checkbox').prop('checked', false);
        });
        $("#stores_filter_form").append(li_option);
      });
      const stores_filter_button = $('<button id="stores_filter_button" type="button" name="" class="btn btn-success pull-right">Submit</button>');
      $("#stores_filter_form").append(stores_filter_button);

      stores_filter_button.click( function() {
        var all_stores_checkboxes = $("#stores_filter_form")[0].getElementsByTagName("input");
        var selected_store_ids = [];

        for (store in all_stores_checkboxes) {
          if (all_stores_checkboxes[store].checked)
            selected_store_ids.push(all_stores_checkboxes[store].value)
        }
        $('#stores_filter_dropdown').removeClass('open');
        $('#stores_filter_dropdown').parent().toggleClass('open');

        process_stores(selected_store_ids)
      })
    }
  });
};

$(document).ready( function() { 

  $('#all_stores_checkbox').click( function(e) {
    $.each($('.store_checkbox'), function(index, store_checkbox) {
      $(this).prop('checked', false);
    });
  });

  // PREVENT DROPDOWN CLOSING WHEN CLICKED INSIDE
  $('#stores_filter_dropdown').on('click', function (event) {
      $(this).parent().toggleClass('open');
  });

  $('body').on('click', function (e) {
      if (!$('#stores_filter_dropdown').is(e.target) 
          && $('#stores_filter_dropdown').has(e.target).length === 0 
          && $('.open').has(e.target).length === 0
      ) {
          $('#stores_filter_dropdown').removeClass('open');
      }
  });
  //////////////////////////////////////////////////////
});


