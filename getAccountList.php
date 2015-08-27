<?php

include 'include/constantes.php';
include 'include/connexionBase.php';
include 'include/cloudcoach_configuration.php';


function erreur($msgErreur) {
  echo "{\"result\":\"".$msgErreur."\"}";
  exit;
}

# Connexion permanente à la base

$link = mysqli_connect(HOST_MYSQL, USER_MYSQL, PASS_MYSQL, DB_MYSQL);
if (!$link) erreur("Impossible de se connecter à MySQL");

$result = "";
$requete = "SELECT ca.displayname FROM coachaccount ca";
$resultats = mysqli_query($link,$requete) or erreur("Query in the DataBase Error");

while ($displayname = mysqli_fetch_row($resultats)) {
	if($displayname[0] != "") $result .= "\"".$displayname[0]."\",";	
}
	
$result = substr($result,0,-1);
$result = "[".$result."]";

echo "{\"result\":".$result."}";

?>