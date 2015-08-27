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

// -------------------- Chargement des paramètres du script --------------------


// -------------------- Initialisation ------------------

// ===================  Corps principal ===================
$offres = "";
$Pres = "";

foreach($offreArray as $offreItem) {
	$Pres = "";
	//iterate over the prestations of this offer
	foreach($offreItem->prestationPacks as $prePack) {
		foreach($prePack as $preItem) {
			$Pres .= "{\"nomc\":\"$preItem->nomc\",\"noml\":\"$preItem->noml\",\"montant\":\"$preItem->montant\",\"temps\":\"$preItem->temps\"},";
		}
	}
	$Pres = substr($Pres,0,-1);
	$Pres = "[".$Pres."]";
	$offres .= "{\"offre\":\"$offreItem->offre\",\"description\":\"$offreItem->description\",\"actif\":\"$offreItem->actif\",\"filtre\":\"$offreItem->filtre\",\"prestationPacks\":$Pres},";

}
	$offres = substr($offres,0,-1);
	$offres = "[".$offres."]";
	//$result = "\"offre\":\"$offres\",\"\":\"\"";
	$result = "\"offres\":$offres";

$coachs = "";
	
foreach($cloudcoachArray as $ccItem) {
	
	$coachs .= "{\"user\":\"$ccItem->user\",\"prenom\":\"$ccItem->prenom\",\"nom\":\"$ccItem->nom\",\"actif\":\"$ccItem->actif\",\"filtre\":\"$ccItem->filtre\"},";

}
	$coachs = substr($coachs,0,-1);
	$coachs = "[".$coachs."]";
	$result .= ",\"coachs\":$coachs";
	
$pres = "";
	
foreach($allPrestations as $preItem) {
	
	$pres .= "\"$preItem->nomc\":\"$preItem->noml\",";

}
	$pres = substr($pres,0,-1);
	$pres = "{".$pres."}";
	$result .= ",\"prestations\":$pres";
	
echo "{".$result."}";

?>