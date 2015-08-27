<?php

include 'include/constantes.php';
include 'include/connexionBase.php';


function erreur($msgErreur) {
  echo "$msgErreur";
  exit;
}

# Connexion permanente à la base

$link = mysqli_connect(HOST_MYSQL, USER_MYSQL, PASS_MYSQL, DB_MYSQL);
if (!$link) erreur("Impossible de se connecter à MySQL");

// -------------------- Chargement des paramètres du script --------------------
// Récupération des éléments de contexte
$eventid = (isset($_GET['eventid'])) ? $_GET['eventid'] : "";
if ($eventid == "") { erreur("Aucun id de event fourni"); }

// -------------------- Initialisation ------------------
// ===================  Corps principal ===================

# --- Récupération des données compte ---
$requete = "SELECT ce.coachcase_fk,ce.datesuspended,ce.date,ce.origname,ce.origrole,ce.type,ce.medium,ce.details,ce.logchangecase,ce.createdon FROM coachevent ce WHERE ce.id=$eventid";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
//erreur($resultats.length);

if (list($coachcase,$datesuspended,$date,$origname,$origrole,$type,$medium,$details,$logchangecase,$createdon) = mysqli_fetch_row($resultats)) {
	
	//erreur("in");
	$result = "\"id\":\"$eventid\",\"coachcase\":\"$coachcase\",\"datesuspended\":\"$datesuspended\",\"date\":\"$date\",\"origname\":\"$origname\",\"origrole\":\"$origrole\",\"type\":\"$type\",\"medium\":\"$medium\",\"details\":\"$details\",\"logchangecase\":\"$logchangecase\",\"createdon\":\"$createdon\"";
}

echo "{".$result."}";

// Libération des résultats 
mysqli_free_result($resultats);

?>
