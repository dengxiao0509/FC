<?php

include 'include/constantes.php';
include 'include/connexionBase.php';


function erreur($msgErreur) {
  echo "{\"result\":\"ERREUR: ".$msgErreur."\"}";
  exit;
}

# Connexion permanente à la base

$link = mysqli_connect(HOST_MYSQL, USER_MYSQL, PASS_MYSQL, DB_MYSQL);
if (!$link) erreur("Impossible de se connecter \\340 MySQL");

$date = date("Y-m-d");
$time = date("H:i:s");

// -------------------- Chargement des paramètres du script --------------------

// Récupération des éléments de contexte Case
$accountid     = (isset($_POST['accountid']))     ? $_POST['accountid']     : "";
if ($accountid == "") { erreur("Aucun id de compte sp\\351cifi\\351"); }

$displayname  = (isset($_POST['displayname']))     ? $_POST['displayname']     : "";
$administratif  = (isset($_POST['administratif']))     ? $_POST['administratif']     : "";
$metier = (isset($_POST['metier'])) ? $_POST['metier'] : "";
$interlocuteur       = (isset($_POST['interlocuteur'])) ? $_POST['interlocuteur'] : "";
$integrateur   = (isset($_POST['integrateur']))       ? $_POST['integrateur']       : "";
$services    = (isset($_POST['services']))       ? $_POST['services']       : "";
$projet  = (isset($_POST['projet']))       ? $_POST['projet']       : "";
$connaissanceit  = (isset($_POST['connaissanceit']))       ? $_POST['connaissanceit']       : "";
$commentaires    = (isset($_POST['commentaires']))       ? $_POST['commentaires']       : "0";


// -------------------- Initialisation ------------------

// ===================  Corps principal ===================

$displayname = str_replace('"','\\\'',$displayname);
$displayname = str_replace('\'','\\\'',$displayname);
$administratif = str_replace('"','\\\'',$administratif);
$administratif = str_replace('\'','\\\'',$administratif);
$metier = str_replace('"','\\\'',$metier);
$metier = str_replace('\'','\\\'',$metier);
$interlocuteur = str_replace('"','\\\'',$interlocuteur);
$interlocuteur = str_replace('\'','\\\'',$interlocuteur);
$interlocuteur = str_replace("\x0a","\\\\n",$interlocuteur);
$interlocuteur = $link->real_escape_string($interlocuteur);
$integrateur = str_replace('"','\\\'',$integrateur);
$integrateur = str_replace('\'','\\\'',$integrateur);
$services = str_replace('"','\\\'',$services);
$services = str_replace('\'','\\\'',$services);
$services = str_replace("\x0a","\\\\n",$services);
$services = $link->real_escape_string($services);
$projet = str_replace('"','\\\'',$projet);
$projet = str_replace('\'','\\\'',$projet);
$projet = str_replace("\x0a","\\\\n",$projet);
$projet = $link->real_escape_string($projet);
$connaissanceit = str_replace('"','\\\'',$connaissanceit);
$connaissanceit = str_replace('\'','\\\'',$connaissanceit);
$commentaires = str_replace('"','\\\'',$commentaires);
$commentaires = str_replace('\'','\\\'',$commentaires);
$commentaires = str_replace("\x0a","\\\\n",$commentaires);
$commentaires = $link->real_escape_string($commentaires);

$requete = "UPDATE coachaccount SET displayname='$displayname',administratif='$administratif',metier='$metier',interlocuteur='$interlocuteur',integrateur='$integrateur',services='$services',projet='$projet',connaissanceit='$connaissanceit',commentaires='$commentaires' WHERE id=$accountid";
mysqli_query($link,$requete) or erreur("requ\\352te incorrecte ($requete)");

$result = "{\"result\":\"ok\"}";
echo $result;

// Libération des résultats 
mysqli_free_result($resultats);

?>
