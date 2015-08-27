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
// Récupération du type de l'action
$action = (isset($_POST['action'])) ? $_POST['action'] : "";
if ($action != "deleteaccount") erreur("Aucune action d\\351fini\\351e");


$accountid = (isset($_POST['accountid']))     ? $_POST['accountid']     : "";



$result = "{\"result\":\"";

if ($action == "deleteaccount") {
	$requete = "DELETE FROM coachaccount WHERE id=$accountid";
	 if (mysqli_query($link,$requete)) { $res = "ok"; }
	 else { erreur("Probl\\350me de cr\\351ation dans la base"); }
}
	


$result .= "$res\"}";

echo $result;

mysqli_close($link);

?>
