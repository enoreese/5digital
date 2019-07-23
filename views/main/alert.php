<?php

include_once("PHPMailer/PHPMailerAutoload.php");

class Alert  {
//	protected static $ownerEmail = "";
//	protected static $subAcct = "";
//	protected static $subPwd = "";
//	protected static $sender = "Mozabo Inverters";
        protected static $mailServer = "smtp.gmail.com";
        protected static $email = "mozaboengineering@gmail.com";
        protected static $emailName = "Mozabo Engineering";
        protected static $reply = "hello@mozabo.com";
        protected static $emailPassword = "Bugsy@8128"; //Lx}-eopCwN]4
        private $mail;
        
        function __construct(){
            $this->mail = new PHPMailer();
        }


        public static function sms($msg, $phone){
		$url  = "http://www.smslive247.com/http/index.aspx?";
		$url .= "cmd=sendquickmsg";
		$url .= "&owneremail=".urlencode(self::$ownerEmail);
		$url .= "&subacct=".urlencode(self::$subAcct);
		$url .= "&subacctpwd=".urlencode(self::$subPwd);
		$url .= "&message=".urlencode($msg);
		$url .= "&sender=".urlencode(self::$sender);
		$url .= "&sendto=".urlencode($phone);
		$url .= "&msgtype=0";
		
		$ch = curl_init();
		//// set URL and other appropriate options
		
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
		
		$f = curl_exec($ch);
		curl_close($ch);
                return TRUE;
	}
        
        public function email($to, $subject, $body, $attachment =""){
            $this->mail->isSMTP(); 
            $this->mail->SMTPAuth   = true;
            $this->mail->SMTPSecure = "ssl";
            $this->mail->Host       = self::$mailServer;      // sets GMAIL as the SMTP server
            $this->mail->Port       = 465;                    // set the SMTP port for the GMAIL server
            $this->mail->Username   = self::$email; // SMTP account username
            $this->mail->Password   = self::$emailPassword;  
            $this->mail->setFrom(self::$email,  self::$emailName);
            $this->mail->addReplyTo(self::$reply);
            
            if(is_array($to)){
                foreach ($to as $i=>$email){
                    $this->mail->addAddress($to[$i]);
                }
            }
            else{
                $this->mail->addAddress($to);
            }
        
            $this->mail->Subject = $subject;
            $this->mail->MsgHTML($body);
            if(!empty($attachment)){
                    $this->mail->addAttachment($attachment);
            }

            if (!$this->mail->send()) {
                return FALSE;
                //return "Mailer Error: " . $this->mail->ErrorInfo;
            } 
            else {
                return TRUE;
            }
        }
	
}
$alert = new Alert();

?>