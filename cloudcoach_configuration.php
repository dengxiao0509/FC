<?php

//offre 
class OfferClass {
	public $offre;
	public $description;
	public $actif;
	public $filtre;
	public $prestationPacks;
	
	public function __construct($off,$des,$ac,$fil,$prePacks){
		$this->offre = $off;
		$this->description = $des;
		$this->actif = $ac;
		$this->filtre = $fil;
		$this->prestationPacks = $prePacks;
	}
	
}

//cloud coach
class CloudCoachClass {
	public $user;
	public $prenom;
	public $nom;
	public $actif;
	public $filtre;
	
	public function __construct($u,$p,$n,$a,$f){
		$this->user = $u;
		$this->prenom = $p;
		$this->nom = $n;
		$this->actif = $a;
		$this->filtre = $f;
	}
	
}

//prestation
class PrestationClass {
	public $nomc;
	public $noml;
	public $montant;
	public $temps;
	
	public function __construct($nc,$nl,$mon = 'NULL',$tem = 'NULL') {
		$this->nomc = $nc;
		$this->noml = $nl;
		$this->montant = $mon;
		$this->temps = $tem;
	}
}

 //////////////////////// configuration data   ///////////////////////////////////////////

//-------------------- Tableau CloudCoach ----------------------------------------
/*create a new cloud coach class and insert it to the array*/
$denis_class = new CloudCoachClass("denis","Denis","BOURGEOIS","N","N");
$mael_class = new CloudCoachClass("mael","Mael","BAEKELANDT","N","N");
$myriam_class = new CloudCoachClass("myriam","Myriam","LIBERGE","N","O");
$pierre_class = new CloudCoachClass("pierre","Pierre","PEZZIN","O","O");
$yoann_class = new CloudCoachClass("yoann","Yoann","CORMERAIS","O","O");
$fabien_class = new CloudCoachClass("fabien","Fabien","CARROT","O","O");
$laurent_class = new CloudCoachClass("laurent","Laurent","BENET","O","O");
$nicolas_class = new CloudCoachClass("nicolas","Nicolas","APPERT","O","O");
$christophe_class = new CloudCoachClass("christophe","Christophe","CARRY","O","O");

 /***********define a new cloud coach class here*********/
//$test_class = new CloudCoachClass("testcc","Marina","CHEZPAS","O","O");         


/************ add the new defined cloud coach class here ***********/
//$cloudcoachArray = array($denis_class,$mael_class,$myriam_class,$pierre_class,$yoann_class,$fabien_class,$laurent_class,$nicolas_class,$christophe_class,$test_class);  /*add the new cloud coach here*/
$cloudcoachArray = array($denis_class,$mael_class,$myriam_class,$pierre_class,$yoann_class,$fabien_class,$laurent_class,$nicolas_class,$christophe_class);



//-------------------- Tableau Prestation ----------------------------------------
/*create a new prestation and insert it to one prepack array and allPrestations array,
  then insert the prepack array to one OffrePrestationArray */
$dema_class = new PrestationClass("demarrage","Pack Démarrage",220,120);
$opt_class = new PrestationClass("optimisation","Pack Optimisation",160,60);
$prepack1 = array($dema_class,$opt_class);

$ex1_class = new PrestationClass("expert1h","Pack Expert 1H",120,60);
$ex2_class = new PrestationClass("expert2h","Pack Expert 2H",220,120);
$ex4_class = new PrestationClass("expert4h","Pack Expert 4H",400,240);
$exa_class = new PrestationClass("expertannee","Pack Expert Année",1500,600);
$prepack2 = array($ex1_class,$ex2_class,$ex4_class,$exa_class);

$lb_class = new PrestationClass("logbronze","Pack Logiciel Bronze",300);
$ls_class = new PrestationClass("logsilver","Pack Logiciel Silver",550);
$lg_class = new PrestationClass("loggold","Pack Logiciel Gold",1000);
$lp_class = new PrestationClass("logplatinum","Pack Logiciel Platinum",1500);
$prepack3 = array($lb_class,$ls_class,$lg_class,$lp_class);

$pr_class = new PrestationClass("prestadevis","Sur devis");
$prepack4 = array($pr_class);

$f1_class = new PrestationClass("formation1h","Formation 1H",160,60);
$f2_class = new PrestationClass("formation2h","Formation 2H",290,120);
$f4_class = new PrestationClass("formation4h","Formation 4H",590,240);
$prepack5 = array($f1_class,$f2_class,$f4_class);

$fvcd_class = new PrestationClass("formationVCD","Formation VCD",600,240);
/*********define the new prestation class here************/
// $test_class = new PrestationClass("formationTEST","Formation TEST",100,40);  

/*********add the new defined prestation class here*************/
$prepack6 = array($fvcd_class); 
// $prepack6 = array($fvcd_class,$test_class);  /*add the new defined prestation class here*/


/*********add the new defined prestation class here*************/
// $allPrestations = array($test_class,$dema_class,$opt_class,$ex1_class,$ex2_class,$ex4_class,$exa_class,$lb_class,$ls_class,$lg_class,$lp_class,$pr_class,$f1_class,$f2_class,$f4_class,$fvcd_class);
$allPrestations = array($dema_class,$opt_class,$ex1_class,$ex2_class,$ex4_class,$exa_class,$lb_class,$ls_class,$lg_class,$lp_class,$pr_class,$f1_class,$f2_class,$f4_class,$fvcd_class);

$FCEPrestationArray = array($prepack1,$prepack2,$prepack3,$prepack4);
$FSPrestationArray = array($prepack5,$prepack4);
$FCAPrestationArray = array($prepack6,$prepack4);

//-------------------- Tableau Offre ----------------------------------------
/*create a new offre class and insert it to the offreArray*/
$FCE_Class = new OfferClass("FCE","Flexible Computing Express","O","O",$FCEPrestationArray);
$FS_Class = new OfferClass("FS","Flexible Storage","O","O",$FSPrestationArray);
$FCA_Class = new OfferClass("FCA","Flexible Computing Advanced","O","O",$FCAPrestationArray);
/*********** define a new offre class here *********************/
// $TEST_Class = new OfferClass("TESTO","Test Offre","O","O",$FCAPrestationArray);

/*********** add the new defined offre class here ******************/
// $offreArray = array($FCE_Class,$FS_Class,$FCA_Class,$TEST_Class);
$offreArray = array($FCE_Class,$FS_Class,$FCA_Class);

?>