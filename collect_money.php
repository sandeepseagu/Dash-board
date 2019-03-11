<?php
   include __DIR__."/api/auth/get_auth.php";
  include __DIR__."/api/auth/check_roles.php";

  if (!$auth->isLoggedIn()) {
    header('Location: login.html');
    exit;
  }
  else if (!canAccessCollectMoney($auth)) {
    header('Location: page_403.html');
    exit;
  }
  else {
?>

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
    <!-- NProgress -->
    

    <link href="static/third_party/pnotify/dist/pnotify.css" rel="stylesheet">
    <link href="static/third_party/pnotify/dist/pnotify.buttons.css" rel="stylesheet">
    <link href="static/third_party/pnotify/dist/pnotify.nonblock.css" rel="stylesheet">
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />
  

    <!-- Custom Theme Style -->
    <link href="static/css/custom.css" rel="stylesheet">
  </head>

  <body class="nav-md">
    <div id="main_content"></div>
    
 
    <script src="static/third_party/nunjucks/nunjucks.js"></script>
    <!-- jQuery -->
    <script src="static/third_party/jquery/dist/jquery.min.js"></script>       
    <!-- Bootstrap -->
    <script src="static/third_party/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- FastClick -->
    <script src="static/third_party/fastclick/lib/fastclick.js"></script>
    <!-- NProgress -->
  
    <!-- jQuery Smart Wizard -->
    <script src="static/third_party/jQuery-Smart-Wizard/js/jquery.smartWizard.js"></script>
    <script src="static/third_party/pnotify/dist/pnotify.js"></script>
    <script src="static/third_party/pnotify/dist/pnotify.buttons.js"></script>
    <script src="static/third_party/pnotify/dist/pnotify.nonblock.js"></script>
    <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>



    <script type="text/javascript">
      $(document).ready( function() {
        $.ajax({
          url: 'api/auth/get_user_role.php',
          method: "POST",
          data: {},
          success: render_page
        });

        function render_page(role) {
        	console.log(role);
          nunjucks.configure('./includes', { autoescape: true });
          nunjucks.render('dashboard_collect_page.html', {"role": role}, function(err, res) {
            $("#main_content").html(res)
          });
        }

    });
    </script>

	
  </body>
</html>




<?php
  }
?>