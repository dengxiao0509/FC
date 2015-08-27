<?php

//**********   This file is used to process the form of uploading files to the server  *********/

// header('Content-Type: text/html; charset=UTF-8');

$maxSize = 2*1024*1024;  //2M

function erreur($msgErreur) {
  echo "{\"result\":\"".$msgErreur."\"}";
  exit;
}

$dirname = $_POST['dirofPJ'];
// $dirname = "files/".$dirname;
echo $dirname;

if(!file_exists("files")) mkdir("files");

if(!file_exists($dirname)) {
mkdir("$dirname");
}

$result = 0;

$target_dir = "$dirname/";     //directory to store the uploaded file
//$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

// Check file size
if ($_FILES["fileToUpload"]["size"] > $maxSize)    $result = 2;  // file too big

else {
	$tempfile = $_FILES["fileToUpload"]["tmp_name"];
	$target_file = html_entity_decode(htmlentities($_FILES["fileToUpload"]["name"],ENT_QUOTES,'UTF-8'));
	//$target_file = $_FILES["fileToUpload"]["name"];

	// ^ : begin , $ : end
	$ismatch = preg_match("/^[a-zA-Z0-9\s\._-]+\$/",$target_file);
	if($ismatch) {
		$target_path = $target_dir . basename($target_file);
		if (move_uploaded_file($tempfile, $target_path)) 	 $result = 1;
	}
	else $result = 3;  // incorrect file name 
}

sleep(1);  // to test the uploading animation
?>	

<script type="text/javascript">
		window.top.window.stopUpload(<?php echo $result; ?>);
		//alert(<?php echo "'target_path = ".$target_path."'" ?>);
</script> 
