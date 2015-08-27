<?php

include 'include/constantes.php';
include 'include/connexionBase.php';

$packTime = array("expert1h" => "60", "expert2h" => "120", "expert4h" => "240", "expertannee" => "600", "formation1h" => "60", "formation2h" => "120", "formation4h" => "240");

function erreur($msgErreur) {
  echo "{\"result\":\"".$msgErreur."\"}";
  exit;
}

# Connexion permanente à la base

$link = mysqli_connect(HOST_MYSQL, USER_MYSQL, PASS_MYSQL, DB_MYSQL);
if (!$link) erreur("Impossible de se connecter à MySQL");

$date = date("Y-m-d");
$time = date("H:i:s");

// -------------------- Chargement des paramètres du script --------------------
// Récupération du type de l'action
$action = (isset($_POST['action'])) ? $_POST['action'] : "";
if ($action != "newcase" && $action != "newevent") erreur("Acucune action définie");

// Récupération des éléments de contexte Case
$account     = (isset($_POST['account']))     ? $_POST['account']     : "NULL";
$vhmaccount  = (isset($_POST['vhmaccount']))     ? $_POST['vhmaccount']     : "";
$accountname = (isset($_POST['accountname'])) ? $_POST['accountname'] : "";
$coach       = (isset($_POST['coach'])) ? $_POST['coach'] : "";
//$datecase    = (isset($_POST['datecase']))       ? $_POST['datecase']       : "";
$caseoffer   = (isset($_POST['caseoffer']))       ? $_POST['caseoffer']       : "";
$casetype    = (isset($_POST['casetype']))       ? $_POST['casetype']       : "";
$casepackfc  = (isset($_POST['casepackfc']))       ? $_POST['casepackfc']       : "";
$casepackfs  = (isset($_POST['casepackfs']))       ? $_POST['casepackfs']       : "";
//$msctfc      = (isset($_POST['msctfc']))       ? $_POST['msctfc']       : "";
//$msctfs      = (isset($_POST['msctfs']))       ? $_POST['msctfs']       : "";
$amountfc    = (isset($_POST['amountfc']))       ? $_POST['amountfc']       : "0";
$amountfs    = (isset($_POST['amountfs']))       ? $_POST['amountfs']       : "0";
$details     = (isset($_POST['details']))       ? $_POST['details']       : "";

// Récupération des éléments de contexte Event
$caseid     = (isset($_POST['caseid']))     ? $_POST['caseid']     : "";
$eventdate  = (isset($_POST['eventdate']))     ? $_POST['eventdate']     : "";
$origrole = (isset($_POST['origrole'])) ? $_POST['origrole'] : "";
$origname       = (isset($_POST['origname'])) ? $_POST['origname'] : "";
$medium   = (isset($_POST['medium']))       ? $_POST['medium']       : "";
$msctid   = (isset($_POST['msctid']))       ? $_POST['msctid']       : "";
$eventtype    = (isset($_POST['eventtype']))       ? $_POST['eventtype']       : "";
$cenomcoach  = (isset($_POST['cenomcoach']))       ? $_POST['cenomcoach']       : "";
$newcasestatus  = (isset($_POST['newcasestatus']))       ? $_POST['newcasestatus']       : "";
$datesuspended      = (isset($_POST['datesuspended']))       ? $_POST['datesuspended']       : "";
$passedtime      = (isset($_POST['passedtime']))       ? $_POST['passedtime']       : "";
$details     = (isset($_POST['details']))       ? $_POST['details']       : "";
$casedetails     = (isset($_POST['casedetails']))       ? $_POST['casedetails']       : "";

if ($action == "newcase") {
	if ($account == "NULL" && $vhmaccount == "" && $accountname == "") { erreur("Vous devez saisir le nom du client"); }
	if ($caseoffer == "" || $caseoffer == "TOUTES") { erreur("Vous devez saisir un type d'offre"); }
	if ($casetype == "") { erreur("Aucun type de prestation fourni"); }
	if ($amountfc != "" && preg_match("/^[0-9]+\$/",$amountfc) == 0) { erreur("Le montant de la prestation doit être numérique: #$amountfc#"); }
//	if ($amountfs := "" && preg_match("/^[0-9]+\$/",$amountfs) == 0) { erreur("Le montant de la prestation doit être numérique: #$amountfs#a"); }
}

if ($action == "newevent") {
	if ($caseid == "") { erreur("Aucun num\\351ro de dossier fourni"); }
	if ($eventdate == "") { erreur("Vous devez renseigner la date de l'\\351v\\350nement"); }
	if ($origrole == "") { erreur("Vous devez renseigner l'initiateur de l'\\351v\\350nement"); }
	if ($origrole == "cloudcoach" && $cenomcoach == "") { erreur("Vous devez sp\\351cifier un Coach en charge du dossier"); }
	if ($origrole != "cloudcoach" && $origname == "") { erreur("Vous devez sp\\351cifier le nom de l'initiateur"); }
	if ($eventtype && ($origrole == "commercial" || $origrole == "interne")) { erreur("Les valeurs pour Initiateur et Type sont incompatibles"); }
	if ($newcasestatus == "SUSPENDU") {
		if ($datesuspended == "") { erreur("Vous devez renseigner la date de suspension"); }
		if ($datesuspended <= $date) { erreur("La date de suspension doit \\352tre sup\\351rieure \\340 la date du jour"); }
	}
	if ($details == "") {
//		if ($eventtype) { erreur("Vous devez renseigner le champ Détails"); }
		if ($origrole != "cloudcoach" && $medium != "portail") { erreur("Vous devez renseigner le champ D\\351tails"); }
		if ($origrole == "cloudcoach" && $medium != "") { erreur("Vous devez renseigner le champ D\\351tails"); }
		if ($newcasestatus == "SUSPENDU" || $newcasestatus == "REJETE" || $newcasestatus == "CLOS") { erreur("Vous devez renseigner le champ D\\351tails"); }
		if ($newcasestatus == "" && $cenomcoach == "") { erreur("Vous devez renseigner le champ D\\351tails"); }
	}
}


// -------------------- Initialisation ------------------

// ===================  Corps principal ===================

if ($action == "newcase" && $account == "") {		# le compte n'existe pas => on doit d'abord le créer
	if ($vhmaccount != "") {		# il existe un compte VHM => on récupère les infos de ce compte
		$requete = "SELECT account.displayname,account.customertype,account.customerid,account.siren,user.firstname,user.lastname,user.email,user.phonenumber,user.gsm FROM account LEFT JOIN user ON (account.referentuser_fk=user.id) WHERE account.id=$vhmaccount";
		$resultats = mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 1 incorrecte ($requete)");
		list($accountname,$customertype,$customerid,$siren,$firstname,$lastname,$email,$phonenumber,$gsm) = mysqli_fetch_row($resultats);
		$interlocuteur = "$firstname $lastname (mail: $email / gsm: $gsm / fixe: $phonenumber)";
		$administratif = "SIREN: $siren / ID CORE: $customerid / type: $customertype";
	} else {
		$vhmaccount = "NULL";
		$interlocuteur = "";
		$administratif = "";
	}
	$accountname = str_replace('\'','\\\'',$accountname);
	$requete = "INSERT INTO coachaccount VALUES (NULL,$vhmaccount,'$accountname','$administratif','','$interlocuteur','','','','','','$date')";
	mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 2 incorrecte ($requete)");
	# puis on récupère l'ID généré à la requête précédente
	$requete = "SELECT id FROM coachaccount WHERE displayname='$accountname' ORDER BY id DESC LIMIT 1";
	$resultats = mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 3 incorrecte ($requete)");
	list($account) = mysqli_fetch_row($resultats);
}

if ($account  == "") { $account  = "NULL"; }
if ($amountfc == "") { $amountfc = "NULL"; }
if ($amountfs == "") { $amountfs = "NULL"; }


$result = "{\"result\":\"";

if ($action == "newcase") {
	if ($caseoffer == "FS") {
		$packname = $casepackfs;
//		$packid   = $msctfs;
		$amount   = $amountfs;
	} else {
		$packname = $casepackfc;
//		$packid   = $msctfc;
		$amount   = $amountfc;
	}
	if ($packTime[$packname]) { $remainingtime = $packTime[$packname]; }
	else { $remainingtime = "NULL"; }
	# --- Mise en forme de la requete de creation ---
	$details = str_replace('"','\\\'',$details);
	$details = str_replace('\'','\\\'',$details);
	$requete = "INSERT INTO coachcase VALUES (NULL,'$coach','$caseoffer',1,$account,'$date','NOUVEAU','$casetype','$packname',$remainingtime,'',$amount,'$details')";
	if (mysqli_query($link,$requete)) { $res = "ok"; }
	else { erreur("Probl\\350me de cr\\351ation dans la base"); }
}

if ($action == "newevent") {
	# on récupère les données du case père
	$requete = "SELECT date,cloudcoach,status,packid,packremainingtime,details FROM coachcase WHERE id=$caseid";
	$resultats = mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 4 incorrecte ($requete)");
	list($casedate,$coach,$status,$packid,$remainingtime,$ccdetails) = mysqli_fetch_row($resultats);
	
	# --- dernières vérifications
	if ($datesuspended && $datesuspended <= $casedate) { erreur("La date de suspension doit être supérieure à la date du jour"); }
	if ($cenomcoach == "" && ($newcasestatus == "encours" || $newcasestatus == "rejete" || $newcasestatus == "clos")) { erreur("Vous devez sp\\351cifier un Coach en charge du dossier"); }
	if ($medium == "portail" && $msctid == "" && $packid == "") { erreur("Vous devez renseigner le MSCT ID"); }
	
	$updateCase    = "";
	$logchangecase = "";
	if ($casedetails != $ccdetails) {
		if ($updateCase) { $updateCase .= ","; }
		$casedetails = str_replace('"','\\\'',$casedetails);
		$casedetails = str_replace('\'','\\\'',$casedetails);
		$updateCase .= "details='$casedetails'";
		if ($logchangecase) { $logchangecase .= " / "; }
		if ($ccdetails == "") { $logchangecase .= "nouveau resume"; }
		else { $logchangecase .= "resume modifie"; }		
	}

	if ($eventdate < $casedate) {
		if ($updateCase) { $updateCase .= ","; }
		$updateCase .= "date='$eventdate'";
	}
	if ($cenomcoach && $origrole == "cloudcoach") {
		$origname = $cenomcoach;
		if ($cenomcoach != $coach) {
			if ($updateCase) { $updateCase .= ","; }
			$updateCase .= "cloudcoach='$cenomcoach'";
			if ($logchangecase) { $logchangecase .= " / "; }
			$logchangecase .= "coach: $cenomcoach";
		}
	}
	if ($msctid) {
		if ($updateCase) { $updateCase .= ","; }
		$updateCase .= "packid='$msctid'";
	}
	if ($newcasestatus != $status) {
		if ($updateCase) { $updateCase .= ","; }
		$updateCase .= "status='$newcasestatus'";
		if ($logchangecase) { $logchangecase .= " / "; }
		$logchangecase .= "statut: $newcasestatus";
	}
	if ($passedtime) {
		$remainingtime -= $passedtime;
		if ($remainingtime < 0) { $timeout = " (hors forfait:".((-1)*$remainingtime).")"; $remainingtime = 0; } else { $timeout = ""; }
		if ($updateCase) { $updateCase .= ","; }
		$updateCase .= "packremainingtime=$remainingtime";
		if ($logchangecase) { $logchangecase .= " / "; }
		$logchangecase .= "temps restant: $remainingtime".$timeout;
	}
	if ($datesuspended) {
		if ($details != "") { $details = "\\\\n".$details; }
		$details = "Mise en SUSPENS jusqu'au $datesuspended".$details;
	}
	# --- Update du case père si nécessaire ---
	if ($updateCase) {
		$requete = "UPDATE coachcase SET $updateCase WHERE id=$caseid";
		if (mysqli_query($link,$requete)) { $res = "ok"; }
		else { erreur("Problème de mise à jour du dossier dans la base ($requete)"); }
	}
//	erreur(bin2hex($details));
	# --- Mise en forme de la requete de création ---
//	$details = str_replace('"','\\\'',$details);
//	$details = str_replace('\'','\\\'',$details);
//	$details = str_replace('\\r','\\\\r',$details);
//	$details = str_replace("\r\n","\\\\n",htmlspecialchars(addslashes($details),ENT_QUOTES));
	$details = str_replace("\x0a","\\\\n",$details);
	$details = $link->real_escape_string($details);
	$requete = "INSERT INTO coachevent VALUES (NULL,$caseid,'$datesuspended','$eventdate','$origname','$origrole','$eventtype','$medium','$details','$logchangecase','$date $time')";
	if (mysqli_query($link,$requete)) { $res = "ok"; }
	else { erreur("Problème de création dans la base ($requete)"); }
}

$result .= "$res\"}";
echo $result;

// Libération des résultats 
mysqli_free_result($resultats);

?>
