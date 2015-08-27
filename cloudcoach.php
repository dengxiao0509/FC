<html>
<head> 
  <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=utf-8">
  <title>FC - Prestations Cloud Coach</title> 
  <link rel="stylesheet" href="/www/css/themes_smoothness_1.10.3/jquery-ui.css">
  <script src="/www/scripts/jquery-1.10.2.min.js"></script>
  <script src="/www/scripts/1.10.3/jquery-ui.min.js"></script>
  
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
	width :1200px;
	left: 50%;
	margin-left: -600px;
	
}
#corps {
	width: 1200px;
	position: fixed;
	top: 150px;
	clear: both;
	font-size: 12px;
	bottom: 1px;
	left: 50%;
	margin-left: -600px;
}
#panelFilterCase {
	position: relative;
	float: left;
	max-width: 200px;
	z-index: 200;
	height:100%;
	overflow:auto;
	bottom:1px;
}

#panelFilterCase td {
	font-size: 0.9em;
}
#panelFilterCase tr {
	font-size: 0.9em;
	padding-top: 10px;
}

/* #fccoachincharge {
	overflow: auto;
	height: 100px;
} */

#coach {
	position: absolute;
	margin-left: 210px;
	// margin-left: 20%;
	width: 1000px;
	height:100%;
	margin-bottom:1px;
	overflow : auto;
}
.nbcases {
	position: relative;
	left: 5px;
	width: 20px;
	font-weight: bold;
	text-align: right;
	display : inline;
}

/*button "Coach en charge + "*/
#showFcnomcoach {
	font-size : 11px;
	padding : 3px;
}

</style>

  
</head> 
<body>

<?php
include 'include/constantes.php';
include 'include/erreurs.php';
include 'include/connexionBase.php';
include 'include/ajaxCoach.js';
include 'include/cloudcoach_configuration.php';

// ===================  Corps principal ===================

$date = date("Y-m-d");

# --- Récupération des données cloud coach ---
$requete = "SELECT cc.cloudcoach,COUNT(cc.id) FROM coachcase cc WHERE cc.status NOT IN ('REJETE','CLOS') GROUP BY cc.cloudcoach";
$resultats = mysqli_query($link,$requete) or erreur(4,$link);
$totalnbcases = 0;
$nbcases{'AUCUN'} = 0;
$nbcases{'TOUS'} = 0;
while (list($cloudcoach,$cases) = mysqli_fetch_row($resultats)) {
	if ($cloudcoach == "") { $cloudcoach = "AUCUN"; }
	$nbcases{$cloudcoach} = $cases;
	$totalnbcases += $cases;
}
$nbcases{'TOUS'} = $totalnbcases;

?>
<script> 
 ajaxGetConfig(); //get all the configuration data
 </script>
 
<div id="entete">
	<div style="float:left; padding: 10px 30px 20px 50px"><img src="/www/images/Logo-obs.gif"></div>
	<div style="float:left"><h1>cloud coach <span style="color:#ff7300">Flexible Computing</span></h1></div>
	<div style="float:left; margin-left:100px; margin-top:30px; font-size:12px">Recherche <input name="recherche" type=text style="width:130px" onkeyup="coachrecherche=encodeURIComponent(this.value);ajaxCoach();"></div>
	<div style="clear:both"></div>
</div>


<div id="corps">

	<div id="panelFilterCase">
			<table>
				<tr id="fccaseoffer">
					<td>Offre</td>
					<td>
						<div id="buttonFCOffer">
						
						    <?php		
							$i=1;
							foreach($offreArray as $offreItem) {
								echo "<input type=\"radio\" id=\"fccaseoffer" . $i . "\" name=\"fccaseoffer\" value=" . $offreItem->offre . "><label for=\"fccaseoffer" . $i . "\">" . $offreItem->offre . "</label>";
								$i++ ;
							}
							echo "<input type=\"radio\" id=\"fccaseoffer" . $i . "\" name=\"fccaseoffer\" value=\"TOUTES\"><label for=\"fccaseoffer" . $i . "\">TOUTES</label>";	
							?>
						</div>
						<br/>
					</td>
				</tr>
				<tr>
				<td></td>
				<td>
				<div id="showCCbutton">
				<input type="button" id="showFcnomcoach" name="showFcnomcoach" title="Voir tous les coachs" value="Coach en charge +">
				</div>
				</td>
				
				</tr>
				<tr id="fccoachincharge">
					<!-- <td>Coach en charge</td> -->		
					<td></td>	
					<td>
						<div id="buttonFCCoachEnCharge" style="display:none">
							<?php		
							$i=1;
							foreach($cloudcoachArray as $ccItem) {
								if($ccItem->filtre == "O") {
									echo "<input type=\"radio\" id=\"fcnomcoach" . $i . "\" name=\"fcnomcoach\" value=" . $ccItem->prenom . "><label for=\"fcnomcoach" . $i . "\" class=\"fcnomcoach\">" . $ccItem->prenom . "</label>";					
									if(array_key_exists($ccItem->prenom,$nbcases)) 						
										echo "<span class=\"nbcases\">". $nbcases{$ccItem->prenom}."</span>";
									else 									
										echo "<span class=\"nbcases\">0</span>";
									$i++ ;
								}
							}
							echo "<div style='white-space:nowrap' class='fcnomcoach1row'><input type=\"radio\" id=\"fcnomcoach" . $i . "\" name=\"fcnomcoach\" value=\"TOUS\"><label for=\"fcnomcoach" . $i . "\">TOUS</label>";
							echo "<span class=\"nbcases\">". $nbcases{'TOUS'}. "</span></div>";
							$i++;
							echo "<input type=\"radio\" id=\"fcnomcoach" . $i . "\" name=\"fcnomcoach\" value=\"AUCUN\"><label for=\"fcnomcoach" . $i . "\">AUCUN</label>";
							echo "<span class=\"nbcases\">". $nbcases{'AUCUN'}. "</span>";
							?>
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
											$("#buttonFCCoachEnCharge").toggle("blind",{"direction":"up"}); 
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

	$("#showCCbutton").buttonset();
	$("#showCCbutton").click(function(){
							//$("#buttonFCCoachEnCharge").css("display","none");	
							$("#buttonFCCoachEnCharge").toggle("blind",{"direction":"up"}); 
	});
	
	$("input:radio[name='fccaseoffer']").button("refresh");
	$("input:radio[name='fcnomcoach']").button("refresh");
	$("input:radio[name='fccasestatus']").button("refresh");
	$("input:radio[name='fccaseorder']").button("refresh");
	$("input:radio[name='fccasedate']").button("refresh");

	ajaxCoach();
</script>

</body>
</html>
