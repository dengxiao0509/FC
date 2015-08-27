<html>
<head> 
  <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8"></META> 
  <title>Reporting Cloud Coach</title> 
  <link rel="stylesheet" href="/css/themes_smoothness_1.10.3/jquery-ui.css">
  <script src="/scripts/jquery-1.10.2.min.js"></script>
  <script src="/scripts/1.10.3/jquery-ui.min.js"></script>
 
</head> 
<body>

<style type="text/css">
body {
	font-family: Verdana,Arial,Sans-serif;
	font-size: 16px;
}
h1 {
	font-size: 24px;
}
#entete {
	font-family: Verdana,Arial,Sans-serif;
	height: 110px;
	position: fixed;
}
#corps {
	width: 1300px;
	position: fixed;
	top: 110px;
	height: 90%;
	overflow: auto;
	clear: both;
	font-size: 12px;
}
tbody th {
	text-align: center;
	font-size: 12px;
	background-color: #ff7300;
	color: white;
	padding: 2px 5px;
}
tbody td {
	text-align: center;
	font-size: 12px;
}
table.tdetails tbody td {
	text-align: left;
	font-size: 12px;
	padding: 0 5px;
}
</style>
<script>
</script>
<?php


include 'include/constantes.php';
include 'include/erreurs.php';
include 'include/connexionBase.php';
#include 'include/ajaxRecherche.js';

// ===================  Corps principal ===================

$C_TRUE = 1;

$anneeCour = date("Y");
$moisCour = date("m");
$jourCour = date("d");
$anneeMin = $anneeCour - 1;		// on travaille sur 12 mois glissants
$moisMin = $moisCour;
$jourMin = 1;

$dateMin = sprintf("%d-%02d-%02d",$anneeMin,$moisMin,$jourMin);
while ($anneeMin <> $anneeCour || $moisMin <> $moisCour) {
	$dates{sprintf("%d-%02d",$anneeMin,$moisMin)} = $C_TRUE;
	$moisMin++;
	if ($moisMin > 12) { $anneeMin++; $moisMin = 1; }
}
$dates{sprintf("%d-%02d",$anneeMin,$moisMin)} = $C_TRUE;	// ajout du mois en cours

?>

<div id="entete"">
	<div style="float:left; padding: 10px 30px 20px 50px"><img src="/images/Logo-obs.gif"></div>
	<div style="float:left"><h1>reporting Cloud Coach <span style="color:#ff7300">Flexible Computing</span></h1></div>
</div>


<div id="corps">
	<div id="feuillets">
		<ul>
			<li><a href="#feuilletfce"><span>FCE</span></a></li>
			<li><a href="#feuilletfs"><span>FS</span></a></li>
			<li><a href="#feuilletautre"><span>Autres</span></a></li>
			<li><a href="#feuilletanomalies"><span>Anomalies</span></a></li>
		</ul>
		<div id="feuilletfce" class="feuillet">
			<h1>Reporting FCE</h1>
			<h2>Nombre de dossiers traités</h2>
<?php

$cases = "";
$types = "";
# --- Récupération des données cloud coach ---
$requete = "SELECT DISTINCT cc.type FROM coachcase cc WHERE cc.offer='FCE' AND status<>'REJETE' and date>'$dateMin' ORDER BY type";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
while (list($type) = mysqli_fetch_row($resultats)) {
	$types{$type} = $C_TRUE;
}
$types{"REJETE"} = $C_TRUE;	// on inclut les dossiers rejetés

$requete = "SELECT DATE_FORMAT(cc.date,'%Y-%m'),cc.type,COUNT(cc.id),cc.status FROM coachcase cc WHERE cc.offer='FCE' AND cc.date>'$dateMin' GROUP BY DATE_FORMAT(cc.date,'%Y-%m'),cc.type,cc.status";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
while (list($date,$type,$nb,$status) = mysqli_fetch_row($resultats)) {
	if ($status == "REJETE") { $cases{$date}{$status} += $nb; }
	else { $cases{$date}{$type} += $nb; }
}
echo "<table>\n";
echo "<tr><th>Type</th>";
foreach ($dates as $date => $dvalue) {
	echo "<th>$date</th>";
}
echo "</tr>\n";
foreach ($types as $type => $tvalue) {
	echo "<tr><td>$type</td>";
	foreach ($dates as $date => $dvalue) {
		echo "<td>".$cases{$date}{$type}."</td>";
	}
}
echo "</tr>\n";
echo "<tr><td>TOTAL</td>";
foreach ($dates as $date => $dvalue) {
	$total = 0;
	foreach ($types as $type => $tvalue) {
		$total += $cases{$date}{$type};
	}
	echo "<td>$total</td>";
}
echo "</tr>\n";
echo "</table>\n";

?>
			<h2>Nombre de clients distincts traités</h2>
<?php
$cases = "";
# --- Récupération des données cloud coach ---
$requete = "SELECT DATE_FORMAT(cc.date,'%Y-%m'),COUNT(DISTINCT ca.id) FROM coachcase cc LEFT JOIN coachaccount ca ON (cc.coachaccount_fk=ca.id) WHERE cc.offer='FCE' AND cc.status<>'REJETE' AND cc.date>'$dateMin' GROUP BY DATE_FORMAT(cc.date,'%Y-%m')";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
while (list($date,$nb) = mysqli_fetch_row($resultats)) {
	$cases{$date} = $nb;
}
echo "<table>\n";
echo "<tr>";
foreach ($dates as $date => $dvalue) {
	echo "<th>$date</th>";
}
echo "</tr>\n";
echo "<tr>";
foreach ($dates as $date => $dvalue) {
	echo "<td>".$cases{$date}."</td>";
}
echo "</tr>\n";
echo "</table>\n";

?>
			<h2>Proportion de clients actuels passés par la cellule Cloud Coach : 
<?php
$cases = "";
# --- Récupération des données cloud coach ---
$requete = "SELECT COUNT(DISTINCT ca.id) FROM coachcase cc LEFT JOIN coachaccount ca ON (cc.coachaccount_fk=ca.id) WHERE cc.offer='FCE' AND cc.status<>'REJETE' AND ca.fcaccount_fk IS NOT NULL";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
list($nbcoachaccount) = mysqli_fetch_row($resultats);

$requete = "SELECT COUNT(DISTINCT account.id) FROM ordering LEFT JOIN account ON (ordering.clientaccount_fk=account.id) WHERE ordering.offer='FCEV1'";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
list($nbvhmaccount) = mysqli_fetch_row($resultats);

echo sprintf("%d",($nbcoachaccount/$nbvhmaccount)*100)," % ($nbcoachaccount / $nbvhmaccount)</h2>\n";
?>
			<h2>Commandes de prestations
<?php
$cases = "";
# --- Récupération des données cloud coach ---
$requete = "SELECT DATE_FORMAT(cc.date,'%Y-%m'),COUNT(cc.id),SUM(cc.amountineuro) FROM coachcase cc WHERE cc.offer='FCE' AND cc.type='prestation' AND cc.status<>'REJETE' AND cc.date>'$dateMin' GROUP BY DATE_FORMAT(cc.date,'%Y-%m')";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
while (list($date,$nb,$sum) = mysqli_fetch_row($resultats)) {
	$cases{$date}{'nb'} = $nb;
	$cases{$date}{'sum'} = $sum;
}
echo "<table>\n";
echo "<tr><th></th>";
foreach ($dates as $date => $dvalue) {
	echo "<th>$date</th>";
}
echo "</tr>\n";
echo "<tr><td>Nb commandes</td>";
foreach ($dates as $date => $dvalue) {
	echo "<td>".$cases{$date}{'nb'}."</td>";
}
echo "</tr>\n";
echo "<tr><td>CA (EHT)</td>";
foreach ($dates as $date => $dvalue) {
	echo "<td>".$cases{$date}{'sum'}."</td>";
}
echo "</tr>\n";
echo "</table>\n";

?>
			<h2>Détail des prestations
<?php
$cases = "";
# --- Récupération des données cloud coach ---
$requete = "SELECT cc.cloudcoach,cc.date,cc.status,cc.packname,cc.packremainingtime,cc.packid,cc.amountineuro,cc.details,ca.displayname FROM coachcase cc LEFT JOIN coachaccount ca ON (cc.coachaccount_fk=ca.id) WHERE cc.offer='FCE' AND cc.type='prestation' AND cc.status<>'REJETE' AND cc.date>'$dateMin' ORDER BY cc.date DESC";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
echo "<table class='tdetails'>\n";
echo "<tr><th>Date</th><th>Status</th><th>Client</th><th>Coach</th><th>Pack</th><th>Temps restant</th><th>ID MSCT</th><th>Montant (EHT)</th><th>Details</th></tr>\n";
while (list($cloudcoach,$date,$status,$packname,$packremainingtime,$packid,$amountineuro,$details,$displayname) = mysqli_fetch_row($resultats)) {
	if ($packremainingtime == "0") { $packremainingtime = ""; }
	echo "<tr style='tex-align:left'><td nowrap>$date</td><td nowrap>$status</td><td nowrap>$displayname</td><td>$cloudcoach</td><td>$packname</td><td style='text-align:center'>$packremainingtime</td><td nowrap>$packid</td><td style='text-align:center'>$amountineuro</td><td nowrap>$details</td></tr>\n";
}
echo "</table>\n";

?>
			<br/>
		</div>
		<div id="feuilletfs" class="feuillet">
			<h1>Reporting FS</h1>
			<h2>Nombre de dossiers traités</h2>
<?php

$cases = "";
$types = "";
# --- Récupération des données cloud coach ---
$requete = "SELECT DISTINCT cc.type FROM coachcase cc WHERE cc.offer='FS' AND status<>'REJETE' and date>'$dateMin' ORDER BY type";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
while (list($type) = mysqli_fetch_row($resultats)) {
	$types{$type} = $C_TRUE;
}
$types{"REJETE"} = $C_TRUE;	// on inclut les dossiers rejetés

$requete = "SELECT DATE_FORMAT(cc.date,'%Y-%m'),cc.type,COUNT(cc.id),cc.status FROM coachcase cc WHERE cc.offer='FS' AND cc.date>'$dateMin' GROUP BY DATE_FORMAT(cc.date,'%Y-%m'),cc.type,cc.status";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
while (list($date,$type,$nb,$status) = mysqli_fetch_row($resultats)) {
	if ($status == "REJETE") { $cases{$date}{$status} += $nb; }
	else { $cases{$date}{$type} += $nb; }
}
echo "<table>\n";
echo "<tr><th>Type</th>";
foreach ($dates as $date => $dvalue) {
	echo "<th>$date</th>";
}
echo "</tr>\n";
foreach ($types as $type => $tvalue) {
	echo "<tr><td>$type</td>";
	foreach ($dates as $date => $dvalue) {
		echo "<td>".$cases{$date}{$type}."</td>";
	}
}
echo "</tr>\n";
echo "<tr><td>TOTAL</td>";
foreach ($dates as $date => $dvalue) {
	$total = 0;
	foreach ($types as $type => $tvalue) {
		$total += $cases{$date}{$type};
	}
	echo "<td>$total</td>";
}
echo "</tr>\n";
echo "</table>\n";

?>
			<h2>Nombre de clients distincts traités</h2>
<?php
$cases = "";
# --- Récupération des données cloud coach ---
$requete = "SELECT DATE_FORMAT(cc.date,'%Y-%m'),COUNT(DISTINCT ca.id) FROM coachcase cc LEFT JOIN coachaccount ca ON (cc.coachaccount_fk=ca.id) WHERE cc.offer='FS' AND cc.status<>'REJETE' AND cc.date>'$dateMin' GROUP BY DATE_FORMAT(cc.date,'%Y-%m')";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
while (list($date,$nb) = mysqli_fetch_row($resultats)) {
	$cases{$date} = $nb;
}
echo "<table>\n";
echo "<tr>";
foreach ($dates as $date => $dvalue) {
	echo "<th>$date</th>";
}
echo "</tr>\n";
echo "<tr>";
foreach ($dates as $date => $dvalue) {
	echo "<td>".$cases{$date}."</td>";
}
echo "</tr>\n";
echo "</table>\n";

?>
			<h2>Commandes de prestations : 
<?php
$cases = "";
# --- Récupération des données cloud coach ---
$requete = "SELECT DATE_FORMAT(cc.date,'%Y-%m'),COUNT(cc.id),SUM(cc.amountineuro) FROM coachcase cc WHERE cc.offer='FS' AND cc.type='prestation' AND cc.status<>'REJETE' AND cc.date>'$dateMin' GROUP BY DATE_FORMAT(cc.date,'%Y-%m')";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
while (list($date,$nb,$sum) = mysqli_fetch_row($resultats)) {
	$cases{$date}{'nb'} = $nb;
	$cases{$date}{'sum'} = $sum;
}
echo "<table>\n";
echo "<tr><th></th>";
foreach ($dates as $date => $dvalue) {
	echo "<th>$date</th>";
}
echo "</tr>\n";
echo "<tr><td>Nb commandes</td>";
foreach ($dates as $date => $dvalue) {
	echo "<td>".$cases{$date}{'nb'}."</td>";
}
echo "</tr>\n";
echo "<tr><td>CA (EHT)</td>";
foreach ($dates as $date => $dvalue) {
	echo "<td>".$cases{$date}{'sum'}."</td>";
}
echo "</tr>\n";
echo "</table>\n";

?>
			<h2>Détail des prestations
<?php
$cases = "";
# --- Récupération des données cloud coach ---
$dateMin = ""; 		// provisoire !!!
$requete = "SELECT cc.cloudcoach,cc.date,cc.status,cc.packname,cc.packremainingtime,cc.packid,cc.amountineuro,cc.details,ca.displayname FROM coachcase cc LEFT JOIN coachaccount ca ON (cc.coachaccount_fk=ca.id) WHERE cc.offer='FS' AND cc.type='prestation' AND cc.status<>'REJETE' AND cc.date>'$dateMin' ORDER BY cc.date DESC";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
echo "<table class='tdetails'>\n";
echo "<tr><th>Date</th><th>Status</th><th>Client</th><th>Coach</th><th>Pack</th><th>Temps restant</th><th>ID MSCT</th><th>Montant (EHT)</th><th>Details</th></tr>\n";
while (list($cloudcoach,$date,$status,$packname,$packremainingtime,$packid,$amountineuro,$details,$displayname) = mysqli_fetch_row($resultats)) {
	if ($packremainingtime == "0") { $packremainingtime = ""; }
	echo "<tr style='tex-align:left'><td nowrap>$date</td><td nowrap>$status</td><td nowrap>$displayname</td><td>$cloudcoach</td><td>$packname</td><td style='text-align:center'>$packremainingtime</td><td nowrap>$packid</td><td style='text-align:center'>$amountineuro</td><td nowrap>$details</td></tr>\n";
}
echo "</table>\n";

?>
			<br/>
		</div>
		<div id="feuilletautre" class="feuillet">
			<h1>Reporting Autre</h1>
		</div>
		<div id="feuilletanomalies" class="feuillet">
			<h1>Reporting Anomalies</h1>
			<h2>Comptes en doublon</h2>
<?php
# --- Récupération des données cloud coach ---
$requete = "SELECT ca.id,ca.displayname,cc.id,cc.offer,cc.date,cc.type,cc.packname,cc.status FROM coachcase cc LEFT JOIN coachaccount ca ON (cc.coachaccount_fk=ca.id) WHERE ca.id IN (SELECT id FROM coachaccount WHERE displayname IN (SELECT displayname FROM coachaccount WHERE displayname<>'' GROUP BY displayname HAVING COUNT(id)>1))";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
$i = 0; $precAccount = "";
while (list($accountid,$displayname,$caseid,$offer,$date,$type,$packname,$status) = mysqli_fetch_row($resultats)) {
	if ($i == 0) { echo "<table>\n\t<tr><th>ID compte</th><th>Raison sociale</th><th>ID dossier</th><th>Offre</th><th>Date</th><th>Statut</th><th>Type</th><th>Pack</th></tr>\n"; }
	$i++;
	echo "<tr><td>$accountid</td><td>$displayname</td><td>$caseid</td><td>$offer</td><td>$date</td><td>$status</td><td>$type</td><td>$packname</td></tr>\n";
}
if ($i > 0) { echo "</table>\n"; }
?>
			<br/>
			<h2>Comptes sans dossier rattaché</h2>
<?php
# --- Récupération des données cloud coach ---
$requete = "SELECT ca.id,ca.displayname,ca.interlocuteur FROM coachcase cc RIGHT JOIN coachaccount ca ON (cc.coachaccount_fk=ca.id) GROUP BY ca.id HAVING COUNT(cc.id)=0";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
$i = 0; $precAccount = "";
while (list($accountid,$displayname,$interlocuteur) = mysqli_fetch_row($resultats)) {
	if ($i == 0) { echo "<table>\n\t<tr><th>ID compte</th><th>Raison sociale</th><th>Interlocuteur</th></tr>\n"; }
	$i++;
	echo "<tr><td>$accountid</td><td>$displayname</td><td>$interlocuteur</td></tr>\n";
}
if ($i > 0) { echo "</table>\n"; }
?>
			<br/>
			<h2>Dossiers sans compte associé</h2>
<?php
# --- Récupération des données cloud coach ---
$requete = "SELECT cc.id,cc.offer,cc.date,cc.type,cc.packname,cc.status,cc.details FROM coachcase cc LEFT JOIN coachaccount ca ON (cc.coachaccount_fk=ca.id) WHERE ca.id IS NULL";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
$i = 0; $precAccount = "";
while (list($caseid,$offer,$date,$type,$packname,$status,$details) = mysqli_fetch_row($resultats)) {
	if ($i == 0) { echo "<table>\n\t<tr><th>ID dossier</th><th>Offre</th><th>Date</th><th>Statut</th><th>Type</th><th>Pack</th><th>Details</th></tr>\n"; }
	$i++;
	echo "<tr><td>$caseid</td><td>$offer</td><td>$date</td><td>$status</td><td>$type</td><td>$packname</td><td>$details</td></tr>\n";
}
if ($i > 0) { echo "</table>\n"; }
?>
			<br/>
			<h2>Comptes client France sans AE associée</h2>
<?php
# --- Récupération des données ---
$requete = "SELECT account.id,account.displayname,account.zipcode,account.address FROM account LEFT JOIN accountae ON (account.id=accountae.account_fk) WHERE accountae.ae_fk IS NULL AND account.customertype='France' AND account.clientaccountclass='CLIENT' AND account.status='ENABLED'";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
$i = 0; $precAccount = "";
while (list($id,$displayname,$zipcode,$address) = mysqli_fetch_row($resultats)) {
	if ($i == 0) { echo "<table>\n\t<tr><th>ID</th><th>Raison sociale</th><th>Code postal</th><th>Adresse</th></tr>\n"; }
	$i++;
	echo "<tr><td>$id</td><td>$displayname</td><td>$zipcode</td><td>$address</td></tr>\n";
}
if ($i > 0) { echo "</table>\n"; }
?>
			<br/>
		</div>
	</div>
</div>

<script>
$("#feuillets").tabs();
</script>
<?php

?>

</body>
</html>
