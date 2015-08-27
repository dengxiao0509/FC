
<?php

$TErreurs = array (
					1	=> "Aucun identifiant de compte donné en argument.",
					2	=> "Impossible de se connecter à la base de données.",
					3	=> "Impossible de sélectionner la base de données.",
					4	=> "La requête de sélection a échoué.",
					5	=> "Aucun identifiant de genre donné en argument.",
					6	=> "Aucun numéro de compte ni identifiant d'écriture donné en paramètre.",
					7	=> "La requête de création a échoué.",
					8	=> "La requête de modification a échoué.",
					9	=> "La requête de suppression a échoué.",
					10	=> "Aucune date donnée en argument."
				);

function erreur($noErreur,$mysqlLink,$msgErreur = '') {
  global $TErreurs;
  
  echo "<h1>Erreur: $TErreurs[$noErreur]</h1>\n<h2>$msgErreur</h2>\n";
  $noErreurMySQL = mysqli_errno($mysqlLink);
  if ($noErreurMySQL) { echo "<br>\n<h2>Retour MySQL ($noErreurMySQL) : ",mysqli_error($mysqlLink),"</h2>\n"; }
  echo "</body>\n</html>\n";
  exit;
}

?>
