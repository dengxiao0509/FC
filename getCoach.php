<?php
#require_once ('PHPUnit.php');
#require_once ('Services/JSON.php');

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
$vhmaccount = (isset($_GET['vhmaccount'])) ? $_GET['vhmaccount'] : "";
$account = (isset($_GET['account'])) ? $_GET['account'] : "";
$coach   = (isset($_GET['coach']))   ? $_GET['coach']   : "";
$offer   = (isset($_GET['offer']))   ? $_GET['offer']   : "";
$status   = (isset($_GET['status']))   ? $_GET['status']   : "";
$date   = (isset($_GET['date']))   ? $_GET['date']   : "";
$order   = (isset($_GET['order']))   ? $_GET['order']   : "";
$recherche   = (isset($_GET['recherche']))   ? $_GET['recherche']   : "";

#$sortbyaccountname = (isset($_GET['sortbyaccountname']))   ? "cc.accountname ASC," : "";
if ($order == "nom") { $order = "ca.displayname ASC,"; }
else { $order = ""; }

// -------------------- Initialisation ------------------


// ===================  Corps principal ===================

#$json = new Services_JSON();
#$TCase  = array();
#$TEvent = array();

# --- Récupération des données compte CC ---
if ($vhmaccount != "" && $account == "") {			# on tente de récupérer l'account à partir du vhmaccount
	$requete = "SELECT id FROM coachaccount WHERE fcaccount_fk=$vhmaccount";
	$resultats = mysqli_query($link,$requete) or erreur(4,$link);
	list($account) = mysqli_fetch_row($resultats);
}

$result = "";

$result .= "\"coachaccount\":\"$account\"";

# --- Calcul du filtre ---
$filter = "";
if ($date) {
	if ($filter) { $filter .= " AND "; }
	if ($date == "mois3") { $diffdays = 90; }
	else { $diffdays = 180; }
	$filter .= "DATEDIFF(NOW(),cc.date)<=$diffdays";
}
if ($account) { if ($filter) { $filter .= " AND "; } $filter .= "cc.coachaccount_fk=$account"; }
if ($offer && $offer != "TOUTES") {
	if ($filter) { $filter .= " AND "; }
	$filter .= "cc.offer='$offer'";
}
if ($coach != "" && $coach != "TOUS") {
	if ($coach == "AUCUN") { $coach = ""; }
	if ($filter) { $filter .= " AND "; }
	$filter .= "cc.cloudcoach='$coach'";
}
if ($status && $status != "TOUS") {
	if ($filter) { $filter .= " AND "; }
	if ($status == "ACTIFS") { $filter .= "cc.status NOT IN ('REJETE','CLOS')"; }
	else { $filter .= "cc.status='$status'"; }
}
if ($recherche) {
	if ($filter) { $filter .= " AND "; }
	$filter .= "ca.displayname LIKE '%$recherche%'";
	$leftjoin = "LEFT JOIN coachaccount ca ON (cc.coachaccount_fk=ca.id)";
} else {
	$leftjoin = "";
}
if ($filter) {
	$filter = "WHERE (".$filter.")";
#	if ($vhmaccount == "" && $account == "") {	// on affiche les cases non attribués si on n'est pas sur un compte en particulier
#		if ($offer && $offer != "TOUTES") { $filter .= " OR (cc.cloudcoach='' AND cc.offer='$offer')"; }
#		else { $filter .= " OR cc.cloudcoach=''"; }
#	}
}

# --- Récupération des données affaires ---
$result .= ", \"coachcase\":[";
$res = "";
if ($vhmaccount == "" || $account != "") {
//if ($account != "") {
	$requete = "SELECT cc.id,cc.cloudcoach,cc.date,cc.offer,cc.coachaccount_fk,ca.displayname,cc.status,cc.type,cc.packname,cc.packremainingtime,cc.packid,cc.amountineuro,cc.details,ca.fcaccount_fk FROM coachcase cc LEFT JOIN coachaccount ca ON (cc.coachaccount_fk=ca.id) $filter ORDER BY $order cc.date DESC, cc.id DESC";
//echo $requete;
	$resultats = mysqli_query($link,$requete) or erreur(4,$link);
	while (list($id,$coach,$date,$offer,$coachaccount_fk,$accountname,$status,$type,$packname,$packremainingtime,$packid,$amount,$details,$fcaccountfk) = mysqli_fetch_row($resultats)) {
		
		if ($res) { $res .= ","; }
		if ($amount == "0") { $amount = ""; }
		$accountname = str_replace('"','\'',$accountname);
		$details = str_replace('"','\'',$details);
		$caseid[$id] = 1;
		
		//get files corresponding to this case
		$dir = "files/case" . $id;
		$PJFiles = "";

		if(is_dir($dir)) {
			if($dh = opendir($dir)) {
				while(($file = readdir($dh)) !== false) {
					if($file != "." && $file != "..")	$PJFiles .= "\"". $file ."\",";
				}
			closedir($dh);
			}
			$PJFiles = substr($PJFiles,0,-1); 
			$PJFiles = "[".$PJFiles."]"; 
		}
		
		else $PJFiles = "[]";
		
		
	//	$result = "\"id\":\"$caseid\",\"cloudcoach\":\"$cloudcoach\",\"offer\":\"$offer\",\"priority\":\"$priority\",\"accountname\":\"$accountname\",\"date\":\"$date\",\"status\":\"$status\",\"type\":\"$type\",\"packname\":\"$packname\",\"packremainingtime\":\"$packremainingtime\",\"packid\":\"$packid\",\"amountineuro\":\"$amountineuro\",\"details\":\"$details\",\"PJFiles\":$PJFiles";

			
		$res .= "{\"id\":$id,\"coach\":\"$coach\",\"date\":\"$date\",\"offer\":\"$offer\",\"accountid\":\"$coachaccount_fk\",\"fcaccountfk\":\"$fcaccountfk\",\"accountname\":\"$accountname\",\"status\":\"$status\",\"type\":\"$type\",\"packname\":\"$packname\",\"packremainingtime\":\"$packremainingtime\",\"packid\":\"$packid\",\"amount\":\"$amount\",\"details\":\"$details\",\"PJFiles\":$PJFiles}";
		#$onecase = array("id"=>(int)$id,"coach"=>"$coach","date"=>"$date","accountid"=>"$coachaccount_fk","accountname"=>"$accountname","status"=>"$status","type"=>"$type","packname"=>"$packname","packremainingtime"=>"$packremainingtime","packid"=>"$packid","amount"=>"$amount","details"=>"$details");
		#array_push($TCase,$onecase);
	}
}
$result .= $res."]";


# --- Récupération des données évènements ---
$result .= ", \"coachevent\":[";
$res = "";
//if ($account != "") {
	if ($filter) { $filter .= " AND "; } else { $filter = "WHERE "; }
	#$filter .= "cc.status<>'CLOS'";
$filter .= "1=1";
	$requete = "SELECT ce.id,ce.coachcase_fk,ce.datesuspended,ce.date,ce.origname,ce.origrole,ce.type,ce.medium,ce.details,ce.logchangecase,ce.createdon FROM coachevent ce LEFT JOIN coachcase cc $leftjoin ON (ce.coachcase_fk=cc.id) $filter ORDER BY ce.date ASC,ce.id";
	#echo $requete;
	$resultats = mysqli_query($link,$requete) or erreur(4,$link);
	while (list($id,$coachcase_fk,$datesuspended,$date,$origname,$origrole,$type,$medium,$details,$logchangecase,$createdon) = mysqli_fetch_row($resultats)) {
if ($caseid[$coachcase_fk]) {
	if ($res) { $res .= ","; }
		$details = str_replace('"','\'',$details);
		$details = str_replace("\\n", "<br>", $details);
		$res .= "{\"id\":$id,\"coachcasefk\":\"$coachcase_fk\",\"datesuspended\":\"$datesuspended\",\"date\":\"$date\",\"origname\":\"$origname\", \"origrole\":\"$origrole\",\"type\":\"$type\", \"medium\":\"$medium\", \"details\":\"$details\",\"logchangecase\":\"$logchangecase\",\"createdon\":\"$createdon\"}";
		#$oneevent = array("id"=>(int)$id,"coachcasefk"=>"$coachcase_fk","datesuspended"=>"$datesuspended","date"=>"$date","origname"=>"$origname","origrole"=>"$origrole","type"=>"$type","medium"=>"$medium","details"=>"$details","logchangecase"=>"$logchangecase","createdon"=>"$createdon");
		#array_push($TEvent,$oneevent);
}
		}
//}
$result .= $res."]";

#$TResult = array("coachaccount"=>"$account","coachcase"=>$TCase,"coachevent"=>$TEvent);
#$output = $json->encode($TResult);
#echo $output;

echo "{".$result."}";

// Libération des résultats 
mysqli_free_result($resultats);

?>
