<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="static/images/favicon.ico" type="image/ico" />

    <title>IPS | Dashboard</title>

    <!-- Bootstrap -->
    <link href="static/third_party/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="static/third_party/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <!-- iCheck -->
    <link href="static/third_party/iCheck/skins/flat/green.css" rel="stylesheet">
    <!-- Switchery -->
    <link href="static/third_party/switchery/dist/switchery.min.css" rel="stylesheet">
    <!-- PNotify -->
    <link href="static/third_party/pnotify/pnotify.custom.min.css" rel="stylesheet">

  
    <!-- bootstrap-progressbar -->
    <link href="static/third_party/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet">
    <!-- JQVMap -->
    <link href="static/third_party/jqvmap/dist/jqvmap.min.css" rel="stylesheet"/>
    <!-- bootstrap-daterangepicker -->
    <link href="static/third_party/bootstrap-daterangepicker/daterangepicker.css" rel="stylesheet">
    <!-- moment.js -->
    <script src="static/third_party/moment/min/moment.min.js"></script>

    <!-- Custom Theme Style -->
    <link href="static/css/custom.css" rel="stylesheet">
  </head>

  <body class="nav-md">
    <div id="main_content"></div>

    <!-- jQuery -->
    <script src="static/third_party/jquery/dist/jquery.min.js"></script>
    <!-- Bootstrap -->
    <script src="static/third_party/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- Chart.js -->
    <script src="static/third_party/Chart.js/dist/Chart.min.js"></script>
    <!-- bootstrap-progressbar -->
    <script src="static/third_party/bootstrap-progressbar/bootstrap-progressbar.min.js"></script>
    <!-- iCheck -->
    <script src="static/third_party/iCheck/icheck.min.js"></script>
    <!-- Switchery -->
    <script src="static/third_party/switchery/dist/switchery.min.js"></script>
    <!-- PNotify -->
    <script src="static/third_party/pnotify/pnotify.custom.min.js"></script>
    <!-- DateJS -->
    <script src="static/third_party/DateJS/build/date.js"></script>
    <!-- JQVMap -->
    <script src="static/third_party/jqvmap/dist/jquery.vmap.js"></script>
    <script src="static/third_party/jqvmap/examples/js/jquery.vmap.sampledata.js"></script>
    <script src="static/third_party/jqvmap/dist/maps/jquery.vmap.usa.js"></script>
    <!-- bootstrap-daterangepicker -->
    <script src="static/third_party/moment/min/moment.min.js"></script>
    <script src="static/third_party/bootstrap-daterangepicker/daterangepicker.js"></script>
    
    <script src="static/third_party/nunjucks/nunjucks.js"></script>
    <script src="static/js/core/auth_required.js"></script>

    <script type="text/javascript">
      $(document).ready( function() {
        $.ajax({
          url: 'api/auth/get_user_role.php',
          method: "POST",
          data: {},
          success: render_page
        });

        function render_page(role) {
          nunjucks.configure('./includes', { autoescape: true });
          nunjucks.render('profile_main.html', {"role": role}, function(err, res) {
            $("#main_content").html(res)
          });
        }
      });
    </script>
  </body>
</html>
