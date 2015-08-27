<?php

include 'include/constantes.php';
include 'include/connexionBase.php';
include 'include/cloudcoach_configuration.php';

$packTime = [];

//get the remaining time of all the prestations
foreach ($allPrestations as $preItem){
	$packTime[$preItem->nomc] = $preItem->temps; 
} 

//$packTime = array("expert1h" => "60", "expert2h" => "120", "expert4h" => "240", "expertannee" => "600", "formation1h" => "60", "formation2h" => "120", "formation4h" => "240");

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
if ($action != "newcase" && $action != "newevent" && $action != "deletecase" && $action != "deleteevent" && $action != "modifycase" && $action != "modifyevent") erreur("Acucune action définie");



// Récupération des éléments de contexte Case
$account     = (isset($_POST['account']))     ? $_POST['account']     : "NULL";
$vhmaccount  = (isset($_POST['vhmaccount']))     ? $_POST['vhmaccount']     : "";
$accountname = (isset($_POST['accountname'])) ? $_POST['accountname'] : "";
$coach       = (isset($_POST['coach'])) ? $_POST['coach'] : "";
//$datecase    = (isset($_POST['datecase']))       ? $_POST['datecase']       : "";
$caseoffer   = (isset($_POST['caseoffer']))       ? $_POST['caseoffer']       : "";
$casetype    = (isset($_POST['casetype']))       ? $_POST['casetype']       : "";
$casepackname  = (isset($_POST['casepackname']))       ? $_POST['casepackname']       : "";
//$casepackfs  = (isset($_POST['casepackfs']))       ? $_POST['casepackfs']       : "";
//$msctfc      = (isset($_POST['msctfc']))       ? $_POST['msctfc']       : "";
//$msctfs      = (isset($_POST['msctfs']))       ? $_POST['msctfs']       : "";

$amountinput = (isset($_POST['amountinput']))     ?$_POST['amountinput']		:"";
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

$eventid = (isset($_POST['eventid']))     ? $_POST['eventid']     : "";

// -------------------- Initialisation ------------------

if ($action == "newcase" || $action == "modifycase") {
	if ($account == "NULL" && $vhmaccount == "" && $accountname == "") { erreur("Vous devez saisir le nom du client"); }
	if ($caseoffer == "" || $caseoffer == "TOUTES") { erreur("Vous devez saisir un type d'offre"); }
	if ($casetype == "") { erreur("Aucun type de prestation fourni"); }	
	if ($amountinput != "" && preg_match("/^[0-9]+\$/",$amountinput) == 0) { erreur("Le montant de la prestation doit \u00EAtre num\u00E9rique: #$amountinput#"); }
	
	/* if ($casetype == "devis") {
		if($amountinput == "")   erreur("Vous devez saisir le montant");
	} */
}

else if ($action == "newevent" || $action == "modifyevent") {
	if($action == "newevent") {
		if ($caseid == "") { erreur("Aucun num\\351ro de dossier fourni"); }
		if ($origrole == "cloudcoach" && $cenomcoach == "") { erreur("Vous devez sp\\351cifier un Coach en charge du dossier"); }
	}
	
	if ($eventdate == "") { erreur("Vous devez renseigner la date de l'\\351v\\350nement"); }
	if ($origrole == "") { erreur("Vous devez renseigner l'initiateur de l'\\351v\\350nement"); }
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
	if ($passedtime != "" && preg_match("/^[0-9]+\$/",$passedtime) == 0) { erreur("Le temps pass\\351 doit \u00EAtre num\u00E9rique: #$passedtime#"); }

}


// ===================  Corps principal ===================

//erreur($action);
if ($action == "newcase" || $action == "modifycase") {

	if($account == "") {		# le compte n'existe pas => on doit d'abord le créer
						
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
							
		// on crée un nouveau compte seulement au cas où ce compte n'existe pas !!!
		
			$accountname = str_replace('"',"\'",$accountname);
			$accountname = str_replace("'","\'",$accountname);
		
		//if account name is not null
		if($accountname !="") {
			$requete = "SELECT id FROM coachaccount WHERE displayname='$accountname' ORDER BY id DESC LIMIT 1";
			$resultats = mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 3 incorrecte ($requete)");
			list($account) = mysqli_fetch_row($resultats);
			
			
			if ($account == NULL) {
				// erreur($accountname);
				$requete = "INSERT INTO coachaccount VALUES (NULL,$vhmaccount,'$accountname','$administratif','','$interlocuteur','','','','','','$date')";
				mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 2 incorrecte ($requete)");
				# puis on récupère l'ID généré à la requête précédente
				$requete = "SELECT id FROM coachaccount WHERE displayname='$accountname' ORDER BY id DESC LIMIT 1";
				$resultats = mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 3 incorrecte ($requete)");
				list($account) = mysqli_fetch_row($resultats);
			
			}
		}
		else $account = 'NULL';
		
		//pour vérifier est-ce que le compte veuille est vide (avec aucun dossier), on renvoi le 'old account id' et le 'new account id' dans la réponse
		if( $action == "modifycase" ) {
			$accountold = "";			
			$requete = "SELECT coachaccount_fk FROM coachcase WHERE id=$caseid";
			$resultats = mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 3 incorrecte ($requete)");
			list($accountold) = mysqli_fetch_row($resultats);
		}
		
		
	}
}



$result = "{\"result\":\"";

if ($action == "newcase") {
	
	
	
	if($casetype == "devis"){
		$packname = 'NULL';
		$remainingtime = 'NULL'; 
		
		if($amountinput == "") $amount = 'NULL';
		else $amount = $amountinput;
		
	}
	
	else if($casetype == "prestation"){
		
		if($amountinput == "")  $amount = 'NULL';	
		else	$amount = $amountinput;
		
		$packname = $casepackname;

		/* if (array_key_exists($packname,$packTime)) { $remainingtime = $packTime[$packname]; }
		else { $remainingtime = 'NULL'; } */
		if(array_key_exists($packname,$packTime) && $packTime[$packname] != 'NULL') {
			$remainingtime = $packTime[$packname];
		}
		else 	$remainingtime = 'NULL';
	}
	
	else{
		$amount = 'NULL';
		$packname = 'NULL';
		$remainingtime = 'NULL';   // not "= NULL"
	}
	
	
	# --- Mise en forme de la requete de creation ---
	$details = str_replace('"','\\\'',$details);
	$details = str_replace('\'','\\\'',$details);
	$requete = "INSERT INTO coachcase VALUES (NULL,'$coach','$caseoffer',1,$account,'$date','NOUVEAU','$casetype','$packname',$remainingtime,'',$amount,'$details');";
	//erreur($requete);
	 if (mysqli_query($link,$requete)) { $res = "ok"; }
	else { erreur("Probl\\350me de cr\\351ation dans la base"); } 
	
	// add the id of the new created case to the response
	$id = mysqli_insert_id($link);
	$res .= "_".$id;
	
	$resultats = "";
	
	//$requete = "SELECT SCOPE_IDENTITY()";

	
/* 	$resultats = mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 4 incorrecte ($requete)");
	$row = mysqli_fetch_row($resultats);
	erreur($row[0]." ".$requete );
 */}

else if ($action == "modifycase") {
	
	if($casetype == "devis"){
		$amount = $amountinput;
		$packname = 'NULL';
		$remainingtime = 'NULL'; 
	}
	
	else if($casetype == "prestation"){	

		if($amountinput == "")  $amount = 'NULL';	
		else	$amount = $amountinput;
		$packname = $casepackname;
		
		//il faut d'abord vérifier est-ce que ce key existe
		if(array_key_exists($packname,$packTime) && $packTime[$packname] != 'NULL') {
			$remainingtime = $packTime[$packname];
		}
		else 	$remainingtime = 'NULL';
	}
	
	else{
		$amount = 'NULL';
		$packname = 'NULL';
		$remainingtime = 'NULL';   // not "= NULL"
	}
		
	# --- Mise en forme de la requete de creation ---

	$details = str_replace('\"','\\\'',$details);
	$details = str_replace('\'','\\\'',$details);

	$requete = "UPDATE coachcase SET cloudcoach='$coach',offer='$caseoffer',coachaccount_fk=$account,date='$date',status='NOUVEAU',type='$casetype',packname='$packname',packremainingtime=$remainingtime,packid='',amountineuro=$amount,details='$details' WHERE id=$caseid";
	//erreur($requete);
	
	if (mysqli_query($link,$requete)) { $res = "ok";}
	else { erreur("Probl\\350me de cr\\351ation dans la base"); }
	
	//si le accountname change, on vérifie est-ce que le accountold est vide 
	if($accountold != $account) {
		
		$requete = "SELECT * FROM coachcase cc WHERE cc.coachaccount_fk='$accountold'";
		$resultats = mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 4 incorrecte ($requete)");
		$row = mysqli_fetch_row($resultats);
		
		//oui, on renvoi le accountold
		if($row == NULL) {
			$res .= "_" . $accountold;			
		}
	}
	
}

else if ($action == "newevent") {
	# on récupère les données du case père
	$requete = "SELECT date,cloudcoach,status,packid,packremainingtime,details FROM coachcase WHERE id=$caseid";
	$resultats = mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 4 incorrecte ($requete)");
	list($casedate,$coach,$status,$packid,$remainingtime,$ccdetails) = mysqli_fetch_row($resultats);
	
	# --- dernières vérifications
	if ($datesuspended && $datesuspended <= $casedate) { erreur("La date de suspension doit être sup\\351rieure à la date du jour"); }
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
		$updateCase .= "packid=\"$msctid\"";
	}
	if ($newcasestatus != $status) {
		if ($updateCase) { $updateCase .= ","; }
		$updateCase .= "status='$newcasestatus'";
		if ($logchangecase) { $logchangecase .= " / "; }
		$logchangecase .= "statut: $newcasestatus";
	}
	if ($passedtime) {
		$remainingtime -= $passedtime;
		if ($remainingtime < 0) {
			$timeout = " (hors forfait:".((-1)*$remainingtime).")"; 
			$remainingtime = 0; 
		}
		else { 
			$timeout = "";
		}
		
		if ($updateCase) { $updateCase .= ","; }
		$updateCase .= "packremainingtime=$remainingtime";
		if ($logchangecase) { $logchangecase .= " / "; }
		//$logchangecase .= "temps restant: $remainingtime".$timeout;
		$logchangecase .= "temps passe $passedtime".$timeout;
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
	$requete = "INSERT INTO coachevent VALUES (NULL,$caseid,'$datesuspended','$eventdate',\"$origname\",'$origrole','$eventtype','$medium',\"$details\",\"$logchangecase\",'$date $time')";
	if (mysqli_query($link,$requete)) { $res = "ok"; }
	else { erreur("Problème de cr\\351ation dans la base ($requete)"); }
}

else if ($action == "modifyevent") {
	
		
	# --- Mise en forme de la requete de creation ---
	// $details = str_replace('"','\\\'',$details);
	// $details = str_replace('\'','\\\'',$details);
	
	//if msctid is not null, we upload the msctid of its case
	if ($msctid != "") {
		$requete = "UPDATE coachcase SET packid=\"$msctid\" WHERE id=$caseid";
	//erreur($requete);
		
		if (mysqli_query($link,$requete)) { $res = "ok";}
		else { erreur("Probl\\350me de cr\\351ation dans la base :".$requete); }
	}
	
	if($origrole != "cloudcoach")
		$requete = "UPDATE coachevent SET date='$eventdate',origrole='$origrole',origname=\"$origname\",medium='$medium',type='$eventtype',details=\"$details\" WHERE id=$eventid";
	else 
		$requete = "UPDATE coachevent SET date='$eventdate',origrole='$origrole',medium='$medium',type='$eventtype',details=\"$details\" WHERE id=$eventid";
 
	//erreur($requete);
	if (mysqli_query($link,$requete)) { $res = "ok";}
	else { erreur("Probl\\350me de cr\\351ation dans la base :".$requete); }
	
	$resultats ="";
	
}

//delete the given case and ask whether or not to delete its account if it has no more cases
else if ($action == "deletecase") {
	
	//examiner est-ce qu'il y des événements liés à ce dossier 
	$requete = "SELECT * FROM coachevent ce WHERE ce.coachcase_fk='$caseid'";
	$resultats = mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 4 incorrecte ($requete)");
	$row = mysqli_fetch_row($resultats);
	
	//oui, ne supprimer pas et renvoi "notVideDossier" 
	if($row) {
		$res = "no_NotVideDossier";
	} 
	
	//non, supprimer ce dossier et examiner est-ce qu'il reste d'autres dossiers liés à ce compte
	else {
					
		$requete = "SELECT cc.coachaccount_fk FROM coachcase cc WHERE cc.id='$caseid'";
		$resultats = mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 4 incorrecte ($requete)");
		list($accountID) = mysqli_fetch_row($resultats);

		//supprimer ce dossier
		$requete = "DELETE FROM coachcase WHERE id='$caseid'";
		if(mysqli_query($link,$requete)) { $res = "ok_";}
		else { erreur("Probl\\350me de supprimer le case dans la base");}

		//no account
		if($accountID) {
			$requete = "SELECT * FROM coachcase cc WHERE cc.coachaccount_fk='$accountID'";
			$resultats = mysqli_query($link,$requete) or erreur("Probl\\350me : requ\\352te 4 incorrecte ($requete)");
			$row = mysqli_fetch_row($resultats);
			
			//il reste d'autres dossiers
			if($row) {
				$res .= "notVideAccount";
			}
			// aucun dossier reste
			else {
				$res .= "VideAccount_$accountID";
			}
		}	
		else {
			$res .="NoAccount";
		}
			
	}
	
}

//delete the given event and add its passed time(if there is) to the remaining time of its case
else if ($action == "deleteevent") {
	
	$requete = "SELECT logchangecase FROM coachevent WHERE id='$eventid'";
	$resultats = mysqli_query($link,$requete) or erreur("Query in the DataBase Error");

if ($eventdetails = mysqli_fetch_row($resultats)) {
	//if this event change the remaining time, try to find the passed time of this event

	if(strpos($eventdetails[0],'temps') === false) { }
	else{
		$arr = explode(" ",$eventdetails[0]);
		$invalidPassedTime = $arr[array_search('temps',$arr)+2];
	
		//find the original remaining time of this case
		$requete = "SELECT packremainingtime FROM coachcase WHERE id='$caseid'";
		$resultats = mysqli_query($link,$requete) or erreur("Query in the DataBase Error");

		if ($remainingT = mysqli_fetch_row($resultats)) {
			
			$remainingTime = intval($remainingT[0]) + intval($invalidPassedTime);  
			//update the remaining time of this case
			$requete = "UPDATE coachcase SET packremainingtime=$remainingTime WHERE id=$caseid";
			if(mysqli_query($link,$requete)) { }
			else { erreur("Probl\\350me de supprimer le evenement dans la base"); }
		}
}

	$requete = "DELETE FROM coachevent WHERE id='$eventid'";
	if(mysqli_query($link,$requete)) { $res = "ok" ;}
	else { erreur("Probl\\350me de supprimer le evenement dans la base"); }
	$resultats = "";
}
}

$result .= "$res\"}";

echo $result;

// Libération des résultats 
if($resultats) mysqli_free_result($resultats);

mysqli_close($link);

?>