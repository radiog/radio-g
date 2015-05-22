<?php
$db = new SQLite3('../../db/'.$_GET["db"]);

error_log(exec('pwd'));
$order   = array("\r\n", "\n", "\r");
$replace = '<br />';
error_log('before urldecode '.$_GET["query"]);

$query = str_replace($order, $replace,urldecode($_GET["query"]));
error_log($query);

if($db->busyTimeout(4000)) {
	$results = $db->query($query);
	if ($results)
		error_log('request ok');
	else 	
		error_log('error in request : '.$query);    
} else {
	error_log('after busyTimeout ');
}
//$db->close();
if (substr(strtolower($query),0,6) != "update" && substr(strtolower($query),0,6)!='insert') {
	error_log('boucle');
	$retour = '';
	while ($line = $results->fetchArray()) {
		$content = '';
		foreach ($line as $key => $val) {
			$content .=  (($content) ? ',' : ''). '"'.$key .'" : "'.str_replace($order, $replace,str_replace('"','\"',$val)).'"';
		}	
		$retour .= (($retour) ? ',' : '').'{'.$content.'}';
	}
	print '['.$retour.']';
}

?>
