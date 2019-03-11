<?php 

include __DIR__."/api/auth/get_auth.php";

  if (!$auth->isLoggedIn()) {
    header('Location: login.html');
    exit;
  }
  else {
  	
  	$vv=$_GET["query"];
  

?>


<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Meta, title, CSS, favicons, etc. -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="static/images/favicon.ico" type="image/ico" />

    <title>IPS | Dashboard</title>

    <!-- Bootstrap -->
    <link href="./static/third_party/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="./static/third_party/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    
    <!-- iCheck -->
    <link href="./static/third_party/iCheck/skins/flat/green.css" rel="stylesheet">
    <!-- Datatables -->
    <link href="./static/third_party/datatables.net-bs/css/dataTables.bootstrap.min.css" rel="stylesheet">
    <link href="./static/third_party/datatables.net-buttons-bs/css/buttons.bootstrap.min.css" rel="stylesheet">
    <link href="./static/third_party/datatables.net-fixedheader-bs/css/fixedHeader.bootstrap.min.css" rel="stylesheet">
    <link href="./static/third_party/datatables.net-responsive-bs/css/responsive.bootstrap.min.css" rel="stylesheet">
    <link href="./static/third_party/datatables.net-scroller-bs/css/scroller.bootstrap.min.css" rel="stylesheet">

    <!-- Custom Theme Style -->
    <link href="./static/build/css/custom.min.css" rel="stylesheet">
  </head>
<body class="nav-md">
	<div id="main_content">


	</div>
	<!-- jQuery -->
    <script src="./static/third_party/jquery/dist/jquery.min.js"></script>
    <!-- Bootstrap -->
    <script src="./static/third_party/bootstrap/dist/js/bootstrap.min.js"></script>
    <!-- FastClick -->
    <script src="./static/third_party/fastclick/lib/fastclick.js"></script>
   
    <!-- iCheck -->
    <script src="./static/third_party/iCheck/icheck.min.js"></script>
    <!-- Datatables -->
    <script src="./static/third_party/datatables.net/js/jquery.dataTables.min.js"></script>
    <script src="./static/third_party/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
    <script src="./static/third_party/datatables.net-buttons/js/dataTables.buttons.min.js"></script>
    <script src="./static/third_party/datatables.net-buttons-bs/js/buttons.bootstrap.min.js"></script>
    <script src="./static/third_party/datatables.net-buttons/js/buttons.flash.min.js"></script>
    <script src="./static/third_party/datatables.net-buttons/js/buttons.html5.min.js"></script>
    <script src="./static/third_party/datatables.net-buttons/js/buttons.print.min.js"></script>
    <script src="./static/third_party/datatables.net-fixedheader/js/dataTables.fixedHeader.min.js"></script>
    <script src="./static/third_party/datatables.net-keytable/js/dataTables.keyTable.min.js"></script>
    <script src="./static/third_party/datatables.net-responsive/js/dataTables.responsive.min.js"></script>
    <script src="./static/third_party/datatables.net-responsive-bs/js/responsive.bootstrap.js"></script>
    <script src="./static/third_party/datatables.net-scroller/js/dataTables.scroller.min.js"></script>
    <script src="./static/third_party/jszip/dist/jszip.min.js"></script>
    <script src="./static/third_party/pdfmake/build/pdfmake.min.js"></script>
    <script src="./static/third_party/pdfmake/build/vfs_fonts.js"></script>
    <script type="text/javascript" src="./static/third_party/datepicker/daterangepicker.js"></script>
    
    




    <!-- Custom Theme Scripts -->
    
     <script src="static/third_party/nunjucks/nunjucks.js"></script>
     
    <script type="text/javascript">
    	var php_va="<?php echo $vv; ?>";
    	var globalVariable={
  			 test: php_va
			};

    	$(document).ready( function() 
    	{
    	
    		$.ajax({
          		url: 'api/auth/get_user_role.php',
          		method: "POST",
          		data: {},
          		success: render_page
        	});

        	function render_page(role) 
        	{
        		console.log(role);
          		nunjucks.configure('./includes', { autoescape: true });
          		nunjucks.render('dashboard_results.html', {"role": role}, function(err, res) {
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