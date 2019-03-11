 $(document).ready(function()
 {
  $.ajax({
    url:"api/promotions/get_all_promotions",
    type:"GET",
    success:function(response){
      $.each(response, function(store_id, data) {
        var by_cash_html = "There's no active promo for this store yet";
        var by_percentage_html = "There's no active promo for this store yet";

        if (data[0].campaign != null) {
          for (i in data) {
            if (data[i].campaign == 2)
              by_cash_html = '<p>For every <b>$' + data[i].trigger_value + '</b> customer adds, customer receives <b>$' + data[i].bonus + '</b> as a bonus</p>';
            if (data[i].campaign == 1)
              by_percentage_html = '<p>For every <b>$' + data[i].trigger_value + '</b> customer adds, customer receives <b>%' + data[i].bonus + '</b> as a bonus</p>';
          }
        }

        const div = '<div class="panel">\
                      <a class="panel-heading" role="tab" id="heading_' + store_id + '" data-toggle="collapse" data-parent="#accordion" href="#collapse_' + store_id + '" aria-expanded="true" aria-controls="collapseOne">\
                        <h4 class="panel-title">' + data[0]['store_name'] + '</h4>\
                      </a>\
                      <div id="collapse_' + store_id + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading_' + store_id + '">\
                        <div class="panel-body">\
                          <h2>By cash</h2>' +
                            by_cash_html +
                          '<h2>By percentage</h2>' +
                            by_percentage_html +
                        '</div>\
                      </div>\
                    </div>';

        $("#big_bill_bonus_accordion").append(div);
      })
    }
  })
});
