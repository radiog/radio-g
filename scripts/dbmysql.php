<?php
$user="archetypes";
$password="archetypes";
$localhost = "localhost";
$database="archetypes";
mysql_connect($localhost,$user,$password);
@mysql_select_db($database) or die( "Unable to connect to database1");
mysql_query("SET NAMES 'utf8'");


//$_POST["query"] = 'select Q.id as id_question, Q.question, group_concat(concat(R.reponse,R.id),";;") as reponses, R.id as id_reponse from questions Q inner join reponses R on R.id_question=Q.id group by Q.id';
$result = mysql_query($_POST["query"]);

// Ordre des remplacements
$order   = array("\r\n", "\n", "\r");
$replace = '<br />';

// Traitement du premier \r\n, ils ne seront pas convertis deux fois.
$newstr = str_replace($order, $replace, $str);

$retour = '';
while ($line = mysql_fetch_array($result,MYSQL_ASSOC)) {
	$content = '';
	foreach ($line as $key => $val) {
		$content .=  (($content) ? ',' : ''). '"'.$key .'" : "'.str_replace($order, $replace,str_replace('"','\"',$val)).'"';
	}	
	$retour .= (($retour) ? ',' : '').'{'.$content.'}';
}
print '['.$retour.']';


?>