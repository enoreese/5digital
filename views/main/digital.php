<?php 
session_start();
include_once 'alert.php';  

include 'connectDB.php';    
  
 $alert = new Alert(); $attachment ="";
    //instantiate DB class
    function dbController()
    {
        $connector = new connectDB();
        $connector->doConnect();
    }  
        
        //Check e-mail validation
	function check_email($email){
		if(!@eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $email)){
			return false;
		} else {
			return true;
		}
	}
 

	if(isset($_GET['id']))
	{
		$id= $_GET['id'];  
	

	//Get post data
      if($id == 1)  {
                
            $email  = $_POST['email']; 		$name 	 = $_POST['name'];
			      $phone 	 = $_POST['phone']; 	$title = $_POST['title'];
            $type = 1; ;
                
                $subject = "New Project Request"; 
                $recipients ='hello@mozabo.com'; //azorbo1@gmail.com          	 
					
				

				

					$message = '<html>
      <head>
        <title>New Contact from '. $name.' </title>
      </head>
      <body>
        <table style="width: 500px; font-family: arial; font-size: 14px;" border="1">
        <tr style="height: 32px;">
          <th align="right" style="width:150px; padding-right:5px;">Project Title:</th>
          <td align="left" style="padding-left:5px; line-height: 20px;">'. $title.'</td>
        </tr>
        <tr style="height: 32px;">
          <th align="right" style="width:150px; padding-right:5px;">Contact Email:</th>
          <td align="left" style="padding-left:5px; line-height: 20px;">'. $email .'</td>
        </tr>       
                                <tr style="height: 32px;">
          <th align="right" style="width:150px; padding-right:5px;">Contact Phone:</th>
          <td align="left" style="padding-left:5px; line-height: 20px;">'. $phone .'</td>
        </tr>       
        <tr style="height: 32px;">
          <th align="right" style="width:150px; padding-right:5px;">Type of Project:</th>
          <td align="left" style="padding-left:5px; line-height: 20px;">'. $type .'</td>
        </tr>
                                            
        </table>
      </body>
      </html>';

//echo $message; exit();
        $alert->email($recipients, $subject, $message, $attachment);
         $alert->email($email, $subject, $message, $attachment);

          //send to db
        dbController();
        $sql = "INSERT INTO digital(title,fullname,email,phone,type) VALUES('$title','$name','$email','$phone','$type')";
        $result = mysql_query($sql) or die(mysql_error());
  
        $_SESSION['errMsg'] = "Congratulations!!! Your message was sent successfully. "
                            . "We will respond within 48 hours.";

        //header("location:". $_SERVER['HTTP_REFERER'] );
          header('Location: index.php');       

//echo $message; exit();
			
        //echo $message; exit();
                    
        }
        elseif($id == 2)  {
                $email  = $_POST['email']; 		$name 	 = $_POST['name'];
				$phone 	 = $_POST['phone']; 	$subject = $_POST['subject']; 
				$messages = $_POST['message'];
               
                $type = "Digital Contact";
                $recipients ='hello@mozabo.com'; 
		
                    $message = '
			<html>
			<head>
			  <title>New Contact from '. $name.' </title>
			</head>
			<body>
			  <table style="width: 500px; font-family: arial; font-size: 14px;" border="1">
				<tr style="height: 32px;">
				  <th align="right" style="width:150px; padding-right:5px;">Full Name:</th>
				  <td align="left" style="padding-left:5px; line-height: 20px;">'. $name.'</td>
				</tr>
				<tr style="height: 32px;">
				  <th align="right" style="width:150px; padding-right:5px;">Contact Email:</th>
				  <td align="left" style="padding-left:5px; line-height: 20px;">'. $email .'</td>
				</tr>				
                                <tr style="height: 32px;">
				  <th align="right" style="width:150px; padding-right:5px;">Contact Phone:</th>
				  <td align="left" style="padding-left:5px; line-height: 20px;">'. $phone .'</td>
				</tr>				
				<tr style="height: 32px;">
				  <th align="right" style="width:150px; padding-right:5px;">Message:</th>
				  <td align="left" style="padding-left:5px; line-height: 20px;">'. $messages .'</td>
				</tr>
                                            
			  </table>
			</body>
			</html>
			';
$alert = new Alert(); $attachment ="";
        $alert->email($recipients, $subject, $message, $attachment);
                    
        }


        //echo $message; exit();
       
        $alert->email($email, $subject, $message, $attachment);

        //send to db
        dbController();
        $sql = "INSERT INTO contacts(name,email,phone,msg,type) VALUES('$name','$email','$phone','$message','$type')";
        $result = mysql_query($sql) or die(mysql_error());
	
        $_SESSION['errMsg'] = "Congratulations!!! Your message was sent successfully. "
                            . "We will respond within 48 hours.";

        header("location:". $_SERVER['HTTP_REFERER'] );
        

       


        }
                
   
        

 ?>