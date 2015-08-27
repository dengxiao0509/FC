
<?php

$TErreurs = array (
					1	=> "Aucun identifiant de compte donn� en argument.",
					2	=> "Impossible de se connecter � la base de donn�es.",
					3	=> "Impossible de s�lectionner la base de donn�es.",
					4	=> "La requ�te de s�lection a �chou�.",
					5	=> "Aucun identifiant de genre donn� en argument.",
					6	=> "Aucun num�ro de compte ni identifiant d'�criture donn� en param�tre.",
					7	=> "La requ�te de cr�ation a �chou�.",
					8	=> "La requ�te de modification a �chou�.",
					9	=> "La requ�te de suppression a �chou�.",
					10	=> "Aucune date donn�e en argument."
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
