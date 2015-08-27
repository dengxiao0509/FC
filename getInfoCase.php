<?php

include 'include/constantes.php';
include 'include/connexionBase.php';


function erreur($msgErreur) {
  echo "Erreur: $msgErreur";
  exit;
}

# Connexion permanente à la base

$link = mysqli_connect(HOST_MYSQL, USER_MYSQL, PASS_MYSQL, DB_MYSQL);
if (!$link) erreur("Impossible de se connecter à MySQL");

// -------------------- Chargement des paramètres du script --------------------
// Récupération des éléments de contexte

$caseid = (isset($_GET['caseid'])) ? $_GET['caseid'] : "";

if ($caseid == "") { erreur("Aucun id de case fourni"); }


// -------------------- Initialisation ------------------

// ===================  Corps principal ===================

# --- Récupération des données compte ---
$requete = "SELECT cc.cloudcoach,cc.offer,cc.priority,cc.coachaccount_fk,cc.date,cc.status,cc.type,cc.packname,cc.packremainingtime,cc.packid,cc.amountineuro,cc.details FROM coachcase cc WHERE cc.id=$caseid";

$resultats = mysqli_query($link,$requete) or erreur(4,$link);
if (list($cloudcoach,$offer,$priority,$coachaccount_fk,$date,$status,$type,$packname,$packremainingtime,$packid,$amountineuro,$details) = mysqli_fetch_row($resultats)) {
	
	if($coachaccount_fk){
		$req = "SELECT ca.displayname  FROM coachaccount ca WHERE ca.id=" .+ $coachaccount_fk;
		//erreur($req);
		$res = mysqli_query($link,$req) or erreur(4,$link);
		$row = mysqli_fetch_row($res);
		if( $row) {
			//erreur($row[0]);
			 $accountname =  $row[0] ;
		}
	}
	
	$dir = "files/case" . $caseid;
	$PJFiles = "";

 	if(is_dir($dir)) {
		if($dh = opendir($dir)) {
			while(($file = readdir($dh)) !== false) {
				if($file != "." && $file != "..")	$PJFiles .= "\"". $file ."\",";
			}
		closedir($dh);
		}
	}
	
	$PJFiles = substr($PJFiles,0,-1); 
	$PJFiles = "[".$PJFiles."]"; 
	$result = "\"id\":\"$caseid\",\"cloudcoach\":\"$cloudcoach\",\"offer\":\"$offer\",\"priority\":\"$priority\",\"accountname\":\"$accountname\",\"date\":\"$date\",\"status\":\"$status\",\"type\":\"$type\",\"packname\":\"$packname\",\"packremainingtime\":\"$packremainingtime\",\"packid\":\"$packid\",\"amountineuro\":\"$amountineuro\",\"details\":\"$details\",\"PJFiles\":$PJFiles";

}

echo "{".$result."}";

// Libération des résultats 
mysqli_free_result($resultats);

?>
