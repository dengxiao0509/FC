<?php

include 'include/constantes.php';
include 'include/connexionBase.php';


function erreur($msgErreur) {
  echo "{\"result\":\"".$msgErreur."\"}";
  exit;
}

# Connexion permanente à la base

$link = mysqli_connect(HOST_MYSQL, USER_MYSQL, PASS_MYSQL, DB_MYSQL);
if (!$link) erreur("Impossible de se connecter à MySQL");

// -------------------- Chargement des paramètres du script --------------------
// Récupération des éléments de contexte
//$vhmaccount = (isset($_GET['vhmaccount'])) ? $_GET['vhmaccount'] : "";
$account = (isset($_GET['account'])) ? $_GET['account'] : "";

if ($account == "") { erreur("Aucun id de compte fourni"); }


// -------------------- Initialisation ------------------

// ===================  Corps principal ===================

# --- Récupération des données compte ---
$requete = "SELECT ca.displayname,ca.administratif,ca.metier,ca.interlocuteur,ca.integrateur,ca.services,ca.projet,ca.connaissanceit,ca.commentaires FROM coachaccount ca WHERE ca.id=$account";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
if (list($displayname,$administratif,$metier,$interlocuteur,$integrateur,$services,$projet,$connaissanceit,$commentaires) = mysqli_fetch_row($resultats)) {
/* 	
	$displayname = str_replace('"','\"',$displayname);
	$displayname = str_replace("'",'\'',$displayname);

	$administratif = str_replace('"','\'',$administratif);
	$metier = str_replace('"','\'',$metier);
	$interlocuteur = str_replace('"','\'',$interlocuteur);
	$integrateur = str_replace('"','\'',$integrateur);
	$services = str_replace('"','\'',$services);
	$projet = str_replace('"','\'',$projet);
	$commentaires = str_replace('"','\'',$commentaires);
//	$services = str_replace("\\n", "<br>", $services);
//	$projet = str_replace("\\n", "<br>", $projet);
//	$commentaires = str_replace("\\n", "<br>", $commentaires); */
	$result = "\"accountid\":\"$account\",\"displayname\":\"$displayname\",\"administratif\":\"$administratif\",\"metier\":\"$metier\",\"interlocuteur\":\"$interlocuteur\",\"integrateur\":\"$integrateur\",\"services\":\"$services\",\"projet\":\"$projet\",\"connaissanceit\":\"$connaissanceit\",\"commentaires\":\"$commentaires\"";
	
}


echo "{".$result."}";

// Libération des résultats 
mysqli_free_result($resultats);

?>
