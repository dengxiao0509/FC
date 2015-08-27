<?php
//header('Content-Type: text/html; charset=ISO-8859-1');

$newCaseDir = "files/newcase_tmp";

function erreur($msgErreur) {
  echo "{\"result\":\"".$msgErreur."\"}";
  exit;
}

$action = $_POST['action'];
$PJFiles = ""; // used to return files existing in a certain dir

$res = "";

if(!file_exists("files")) mkdir("files");

//delete a file from the server
if($action == "deleteFile") {
	
	$filename = $_POST['filename'];
	$filedir = $_POST['filedir'];

	$filepath = $filedir . "/" . $filename;
	
	if(file_exists($filepath)) {
		if(unlink($filepath)) {
			
			$res = "ok";
			
			if(is_dir($filedir)) {
				$files = scandir($filedir);
					if(sizeof($files) <= 2 ) {   //if this directory is empty, remove it
						rmdir($filedir);
					}
			}
		}
		
		else  $res = "Error deleting $filepath";
	}
	else $res = "File not exiting";
}

//move a file to the directory of one case
else if ($action == "moveFile") {
	
	$caseid = $_POST['caseid'];
	$oldfiledir = $newCaseDir;
	$newfiledir = "files/case".$caseid;
	if(is_dir($oldfiledir)) {
		if($dh = opendir($oldfiledir)) {
			while(($file = readdir($dh)) !== false) {
				if($file != "." && $file != "..")	{   //move onloaded files to the directory of new created case
					
					$oldfpath = $oldfiledir."/".$file;
					$newfpath = $newfiledir."/".$file;
					if(!file_exists($newfiledir)) mkdir($newfiledir);
					
					if(file_exists($oldfpath)) {
						if(copy($oldfpath,$newfpath))
							unlink($oldfpath);
					}
				}
			}
		$res = "ok";
		closedir($dh);
		}
	}
}

//update the list of uploaded files in form "new case"
else if ($action == "updateInNewCase") {
	
 	if(is_dir($newCaseDir)) {
		if($dh = opendir($newCaseDir)) {
			while(($file = readdir($dh)) !== false) {
				if($file != "." && $file != "..")	$PJFiles .= "\"". $file ."\",";
			}
		closedir($dh);
		}
	}
	
	$PJFiles = substr($PJFiles,0,-1); 
	$PJFiles = "[".$PJFiles."]"; 
	$res = "ok";

}

//update the list of uploaded files in form "modify case"
else if ($action == "updateInModifyCase") {
	
	$caseid = $_POST['caseid'];
	$currentCaseDir = "files/case" . $caseid;
	
	if(is_dir($currentCaseDir)) {
		if($dh = opendir($currentCaseDir)) {
			while(($file = readdir($dh)) !== false) {
				if($file != "." && $file != "..")	$PJFiles .= "\"". $file ."\",";
			}
		closedir($dh);
		}
	}
	
	$PJFiles = substr($PJFiles,0,-1); 
	$PJFiles = "[".$PJFiles."]"; 
	
	$res = "ok";
}

//delete a directory in the server
else if ($action == "deleteDir") {
	
	$dir = $_POST['dirname'];
		
	//if this dir exists
	if(is_dir($dir)) {
		$files = array_diff(scandir($dir),array('.','..'));
		//if this dir is not empty,delete all its files
		if(count($files) > 0) { 
				   
			foreach ($files as $file) {
				if(!unlink(realpath($dir). "/" . $file)) erreur("Delete File Error");
			}
			
		}
		
		if(rmdir($dir))	$res = "ok";
		else erreur("Delete Directory Error");
	}
	else $res = "not Exist";
}



if($PJFiles == "") $PJFiles = "[]";
$result = "{\"result\":\"".$res."\",\"PJFiles\":".$PJFiles."}";
echo $result;