<?php  header("Access-Control-Allow-Origin: *");
	require("phpmailer/class.phpmailer.php");

	$path_parts = pathinfo($_FILES['userfile']['name']);

	$mail = new PHPmailer();
	$mail->SMTPAuth = false;
	$mail->IsHTML(true);
	$mail->From=$_POST['from'];
	$mail->AddAddress($_POST['destinataire']);
	//$mail->AddAddress($_POST['from']);
	$mail->AddReplyTo($_POST['from']);
	error_log("from:". $_POST['from']);

	if(isset($_FILES['userfile']))
		$mail->AddAttachment($_FILES['userfile']['tmp_name'], 'photo.'.substr($path_parts['extension'],0,3));
	
	$mail->Subject="Message envoyé depuis l'application Radio G! ".date('d/m/Y')." à ".date('G:i');
	$mail->Body ='	Bonjour,
					<p>Message envoyé le '.date('d/m/Y').' à '.date('G:i').' depuis l\'application Radio G!</p>
					<p>Informations de la personne :</p>
					<div><strong>Nom :</strong> '.$_POST['nom'].'</div>
					<div><strong>Email :</strong> '.$_POST['mail'].'</div>
					<div><strong>Mobile :</strong> '.$_POST['mobile'].'</div>
					<div><strong>Message :</strong> '.$_POST['message'].'</div>';

	if(!$mail->Send()) $messageError1 =  $mail->ErrorInfo;
	else $messageError1 = 'Mail envoyé avec succès';
	unset($mail);

	error_log("retour:". $messageError1);
	print 'envoyé';
	?>