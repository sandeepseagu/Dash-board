$( document ).ready(function() {


    


    function open(param_data)
    {
        window.location.assign("results?query=" + param_data); 
    }

    $("#search").keyup(function(e)
    {
        
        
        e.preventDefault();
        if(e.keyCode == 13)
        {
             var search_query=$("#search").val();

             open(search_query);
        } 

    });

   $( "#search_button" ).click(function() 
   {
        var search_query=$("#search").val();
        open(search_query);

    });
   

     function search()
    {
            var input=document.getElementById("search");
            console.log(input);

    }


	// Dynamic generation of terminal drop down
    $("#store_selection").on('change', function() 
    {
    	console.log("change");
    	if($(this).val()!=0){
    		console.log($(this).val());
    		$('#terminal_div').removeAttr('style'); 
    	}
    	else if($(this).val()==0)
    	{
    		$('#terminal_div').css("display","none");
    	}

    });

    
     var ajax_data;
    function init_SmartWizard() 
    {
        var data;
       
        if( typeof ($.fn.smartWizard) === 'undefined')
        { 
            return; 
        }
        console.log('init_SmartWizard');
        $('#wizard').smartWizard({
            onLeaveStep:leaveAStepCallback,
            onFinish:collectMoney,
            toolbarSettings:{
                showNextButton:false
            }
                
        });

        function collectMoney(obj,context)
        {

            	console.log("hello");
            	$.ajax({
            		url:"api/collect_money.php",
            		type:"POST",
            		data:ajax_data,
            		success:function(response)
            		{
                        console.log(response);
                        var msg=" ";
            			if(response[0]==1 )
                        {
                            msg=msg+" Collection log has been updated."
                        }
                        else if (response[0]==0) 
                        {
                            msg=msg+" There is problem updating the Collection log in the database.";
                        }
                        if(response[1]==1)
                        {
                            msg=msg+"Cash Counter has been updated.";
                        }
                        else if(response[1]==0)
                        {
                            msg=msg+" There is a problem Updating the Cash Counter in the database.";
                        }
            			if(response[0]==0 ||response[1]==0)
                        {
                            msg=msg+" Please Contact the Store Owner."
                        }

                        if(response[2]==1)
                        {
                            var mail_msg='Email has been sent to Store Owner for Collection Report';
                        }
                        else
                        {
                            var mail_msg="There is a problem sending Email for Collection Report";
                        }
                        new PNotify({
                                title:  'EMail Notification',
                                text:   mail_msg,
                                type: 'success',
                                styling: 'bootstrap3'
                        });


                        $("#step-2").empty();
                        $("#step-2").html("<h2 style='text-align:center;'>"+msg+"</h2>");
            		}
            	});
            }






             function leaveAStepCallback(obj, context)
             {
             	var status=true;
                console.log(context.toStep);
                if(context.toStep==1)
                {
                     $(".buttonNext").show();
                }
                
             	if(context.fromStep==1)
             	{
					data=validate_user_input();

             		ajax_data={"username":data[1],"pin":data[2],"store":data[3],"terminal_id":data[4]};
             	    status=data[0];
             	    if (status== true) 
             	    {
             	    	console.log(ajax_data);
             	    	$.ajax({
             			url:"api/auth/validate_user.php",
             			type:"POST",
             			async:false,
             			data:ajax_data,
             			success:function(response)
             			{

                            console.log(response);

             				if(response.username_status=='error' || response.password_status=='error')
             				{
             					$("#user_message").html("<h2>Please Enter valid Username and Employee PIN.</h2>");
             					$("#pin_message").html("");
                                $("#user_message").addClass('red');
                                status=false;
             				}
             				else if(response.username_status=='success' && response.password_status=='success')
             				{
             					$("#user_message").html(" ");
             					$("#pin_message").html(" ");


             				}
             				
             				if(response.username_status=='success' && response.password_status=='success')
             				{

             					var store_name=$("#store_selection option:selected").text();
             					console.log(store_name);
             					$("#step-2-store").html(store_name);
             					$("#step-2-username").html(data[1]);
             					$("#step-2-terminal").html(data[4]);
                                status=true;

             				}
             				
             			}

             			}); 
             	    	
             	    }
             		
                    if(status==true)
                    {
                        $(".buttonNext").hide();
                        
                    }
             		return status;

             	}

             	if(context.fromStep==2)
             	{
                    console.log(context.fromStep);
               
             		return true;
             	}	
        		
        		
        	}


    		function validate_user_input()
    		{
    			var status=true;
    			var username=$("#user_name").val();
             	var pin=$("#employee_pin").val()
             	var store=$("#store_selection").val();
             	var terminal;
             	console.log(store);
             	if (username=='')
             	{
             		status=false;
             		$("#user_name").attr("placeholder","Please Enter the Username.");
                    $("#user_name").addClass('red'); 
             	}
             	else
             	{
					$("#user_message").html("");
             	}
             	
             	if(pin=='')
             	{
             		status=false;
             		$("#employee_pin").attr("placeholder","Please Enter The Pin");
                    $("#employee_pin").addClass('red');	
                     
             	}
             	else
             	{
             		$("#pin_message").html("");	
             	}
             	if(store==0)
             	{
             		status=false;
             		$("#store_message").html("Please Select a Store.");
             		
             	}
             	else if(store!=0)
             	{
                    $("#store_message").html(" ");
             		terminal=$("#terminal_selection").val();
             		if(terminal==0)
             		{
             			status=false;
             			$("#terminal_message").html("Please Select a Terminal.");
             		}
             		else
             		{
             			$("#terminal_message").html("");
             		}
             	}
             	return [status,username,pin,store,terminal];
             	}
            $('#employee_pin').keypress(function() {

                   $("#employee_pin").removeClass('red');  
            });

             $('#user_name').keypress(function() {

                   $("#user_name").removeClass('red');  
            });
            $('#wizard_verticle').smartWizard({
              transitionEffect: 'slide'
            });

            $('.buttonNext').addClass('btn btn-success');
            $('.buttonPrevious').addClass('btn btn-primary');
            $('.buttonFinish').addClass('btn btn-default');
            
      };

        



init_SmartWizard();

 

   
    
});



    
