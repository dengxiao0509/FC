<html>
<head> 
  <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8"></META> 
  <title>FC - Prestations Cloud Coach</title> 
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
	width: 100%;
	position: fixed;
	top: 110px;
	height: 100%;
	overflow: auto;
	clear: both;
	font-size: 12px;
}
#panelFilterCase {
	position: fixed;
	float: left;
	width: 220px;
	width: 20%;
	z-index: 200;
}
#panelFilterCase td {
	font-size: 0.9em;
}
#panelFilterCase tr {
	font-size: 0.9em;
	padding-top: 10px;
}
/* .panelResultCase {
	overflow: auto;
	//float: left;
//	width: 300px;
}  */

#coach {
	position: relative;
	overflow: auto;
//	left: 200px;
	width: 950px;
	max-height : 100px;
}
.nbcases {
	position: relative;
	left: 5px;
	width: 20px;
	font-weight: bold;
	text-align: right;
}
</style>

<?php

include 'include/constantes.php';
include 'include/erreurs.php';
include 'include/connexionBase.php';
include 'include/ajaxCoach.js';

// ===================  Corps principal ===================

$date = date("Y-m-d");

# --- Récupération des données cloud coach ---
$requete = "SELECT cc.cloudcoach,COUNT(cc.id) FROM coachcase cc WHERE cc.status NOT IN ('REJETE','CLOS') GROUP BY cc.cloudcoach";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
$totalnbcases = 0;
while (list($cloudcoach,$cases) = mysqli_fetch_row($resultats)) {
	if ($cloudcoach == "") { $cloudcoach = "AUCUN"; }
	$nbcases{$cloudcoach} = $cases;
	$totalnbcases += $cases;
}
$nbcases{'TOUS'} = $totalnbcases;

?>

<div id="entete">
	<div style="float:left; padding: 10px 30px 20px 50px"><img src="/images/Logo-obs.gif"></div>
	<div style="float:left"><h1>cloud coach <span style="color:#ff7300">Flexible Computing</span></h1></div>
	<div style="float:left; margin-left:100px; margin-top:30px; font-size:12px">Recherche <input name="recherche" type=text style="width:130px" onkeyup="coachrecherche=encodeURIComponent(this.value);ajaxCoach()";></div>
	<div style="clear:both"></div>
</div>


<div id="corps">
	<div id="panelFilterCase">
			<table>
				<tr id="fccaseoffer">
					<td>Offre</td>
					<td>
						<div id="buttonFCOffer">
							<input type="radio" id="fccaseoffer1" name="fccaseoffer" value="FCE"><label for="fccaseoffer1">FCE</label> 
							<input type="radio" id="fccaseoffer2" name="fccaseoffer" value="FS"><label for="fccaseoffer2">FS</label> 
							<input type="radio" id="fccaseoffer3" name="fccaseoffer" value="FCA"><label for="fccaseoffer3">FCA</label> 
							<input type="radio" id="fccaseoffer4" name="fccaseoffer" value="TOUTES"><label for="fccaseoffer4">TOUTES</label>
						</div>
						<br/>
					</td>
				</tr>
				<tr id="fccoachincharge">
					<td>Coach en charge</td>
					<td>
						<div id="buttonFCCoachEnCharge">
							<input type="radio" id="fcnomcoach1" name="fcnomcoach" value="Myriam"><label for="fcnomcoach1">Myriam</label>
							<span class="nbcases"> <?php echo $nbcases{'Myriam'}; ?></span>
							<input type="radio" id="fcnomcoach2" name="fcnomcoach" value="Pierre"><label for="fcnomcoach2">Pierre</label> 
							<span class="nbcases"> <?php echo $nbcases{'Pierre'}; ?></span>
							<input type="radio" id="fcnomcoach3" name="fcnomcoach" value="Mathieu"><label for="fcnomcoach3">Mathieu</label>
							<span class="nbcases"> <?php echo $nbcases{'Mathieu'}; ?></span>
							<input type="radio" id="fcnomcoach4" name="fcnomcoach" value="Christophe"><label for="fcnomcoach4">Christophe</label>
							<span class="nbcases"> <?php echo $nbcases{'Christophe'}; ?></span>
							<input type="radio" id="fcnomcoach5" name="fcnomcoach" value="Yoann"><label for="fcnomcoach5">Yoann</label>
							<span class="nbcases"> <?php echo $nbcases{'Yoann'}; ?></span>
							<input type="radio" id="fcnomcoach6" name="fcnomcoach" value="Fabien"><label for="fcnomcoach6">Fabien</label>
							<span class="nbcases"> <?php echo $nbcases{'Fabien'}; ?></span>
							<input type="radio" id="fcnomcoach7" name="fcnomcoach" value="Laurent"><label for="fcnomcoach7">Laurent</label>
							<span class="nbcases"> <?php echo $nbcases{'Laurent'}; ?></span>
							<input type="radio" id="fcnomcoach8" name="fcnomcoach" value="TOUS"><label for="fcnomcoach8">TOUS</label>
							<input type="radio" id="fcnomcoach9" name="fcnomcoach" value="AUCUN"><label for="fcnomcoach9">AUCUN</label>
							<span class="nbcases"> <?php echo $nbcases{'AUCUN'}; ?></span>
						</div>
						<br/>
					</td>
				</tr>
				<tr>
					<td>Statut</td>
					<td>
						<div id="buttonFCCaseStatus">
							<input type="radio" id="fccasestatus1" name="fccasestatus" value="NOUVEAU"><label for="fccasestatus1">Nouveau</label> 
							<input type="radio" id="fccasestatus2" name="fccasestatus" value="EN COURS"><label for="fccasestatus2">En cours</label> 
							<input type="radio" id="fccasestatus3" name="fccasestatus" value="EN ATTENTE"><label for="fccasestatus3">En attente</label> 
							<input type="radio" id="fccasestatus4" name="fccasestatus" value="SUSPENDU"><label for="fccasestatus4">Suspendu</label>
							<input type="radio" id="fccasestatus5" name="fccasestatus" value="REJETE"><label for="fccasestatus5">Rejet&eacute;</label>
							<input type="radio" id="fccasestatus6" name="fccasestatus" value="CLOS"><label for="fccasestatus6">Clos</label>
							<input type="radio" id="fccasestatus7" name="fccasestatus" value="ACTIFS" title="Ni clos ni rejetes"><label for="fccasestatus7">ACTIFS</label>
							<input type="radio" id="fccasestatus8" name="fccasestatus" value="TOUS"><label for="fccasestatus8">TOUS</label>
						</div>
						<br/>
					</td>
				</tr>
				<tr>
					<td>Tri</td>
					<td>
						<div id="buttonFCCaseOrder">
							<input type="radio" id="fccaseorder1" name="fccaseorder" value="date"><label for="fccaseorder1">par Date</label> 
							<input type="radio" id="fccaseorder2" name="fccaseorder" value="nom"><label for="fccaseorder2">par Nom</label> 
						</div>
						<br/>
					</td>
				</tr>
				<tr>
					<td>Date</td>
					<td>
						<div id="buttonFCCaseDate">
							<input type="radio" id="fccasedate2" name="fccasedate" value="mois6"><label for="fccasedate2">6 mois</label> 
							<input type="radio" id="fccasedate3" name="fccasedate" value=""><label for="fccasedate3">TOUS</label> 
						</div>
						<br/>
					</td>
				</tr>
			</table>
	</div>
	<div id="fakePanelFilterCase" style="position:relative; float:left; width:220px; height:100%;">
	</div>
<?php
include 'coach.php';
?>
	<div style="clear:both"></div>
</div>

<script>
	$("#coach").addClass("panelResultCase");
	$("#buttonFCOffer").buttonset();
	$("#buttonFCOffer").change( function() {
											coachoffer = $("input:radio[name='fccaseoffer']:checked").val();
											ajaxCoach();
											resetNewCase();
											} );
	$("#buttonFCCoachEnCharge").buttonset();
	$("#buttonFCCoachEnCharge").change( function() {
											coachname = $("input:radio[name='fcnomcoach']:checked").val();
											ajaxCoach();
											resetNewCase();
											} );
	$("#buttonFCCaseStatus").buttonset();
	$("#buttonFCCaseStatus").change( function() {
											coachstatus = $("input:radio[name='fccasestatus']:checked").val();
											ajaxCoach();
											} );
	$("#buttonFCCaseOrder").buttonset();
	$("#buttonFCCaseOrder").change( function() {
											coachorder = $("input:radio[name='fccaseorder']:checked").val();
											ajaxCoach();
											} );
	$("#buttonFCCaseDate").buttonset();
	$("#buttonFCCaseDate").change( function() {
											coachdate = $("input:radio[name='fccasedate']:checked").val();
											ajaxCoach();
											} );
/*
	$("input:text[name='recherche']").change( function() {
											coachrecherche = $("input:text[name='recherche']").val();
											ajaxCoach();
											} );
*/
	$("input:radio[name='fccaseoffer'][value='TOUTES']").prop("checked",true);
	coachoffer = "TOUTES";
//	$("input:radio[name='fccaseoffer']").prop("checked",false);
	$("input:radio[name='fcnomcoach'][value='TOUS']").prop("checked",true);
	coachname = "TOUS";
	$("input:radio[name='fccasestatus'][value='TOUS']").prop("checked",true);
	coachstatus = "TOUS";
	$("input:radio[name='fccaseorder'][value='date']").prop("checked",true);
	coachorder = "date";
	$("input:radio[name='fccasedate'][value='mois6']").prop("checked",true);
	coachdate = "mois3";

	$("input:radio[name='fccaseoffer']").button("refresh");
	$("input:radio[name='fcnomcoach']").button("refresh");
	$("input:radio[name='fccasestatus']").button("refresh");
	$("input:radio[name='fccaseorder']").button("refresh");
	$("input:radio[name='fccasedate']").button("refresh");

	ajaxCoach();
</script>

</body>
</html>
