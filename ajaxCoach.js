
<script type="text/javascript">

//jQuery.fn.reset = function () {
//  $(this).each (function() { this.reset(); });
//}
var TCaseType = { "avantvente":"Support Avant-Vente", "devis":"Devis", "tryer":"Accompagnement Tryer", "welcome":"Welcome Nouveau client", "30min":"30 minutes gratuites", "question":"Question / R\351ponse", "prestation":"Prestation", "conso":"Relance consommation nulle", "alerte":"Appel pro-actif", "autre":"Sollicitation simple" };
var TCasePack = { "middleware":"Cr\351ation VM avec installation logiciel", "configfw":"Aide Configuration FW", "demarrage":"Pack D\351marrage", "construction":"Pack Construction", "optimisation":"Pack Optimisation", "performance":"Pack Performance", "securite":"Pack S\351curit\351", "expert1h":"Pack Expert 1H", "expert2h":"Pack Expert 2H", "expert4h":"Pack Expert 4H", "expertannee":"Pack Expert Annuel", "prestadevis":"sur devis", "logbronze":"Pack Logiciel Bronze", "logsilver":"Pack Logiciel Silver", "loggold":"Pack Logiciel Gold", "logplatinum":"Pack Logiciel Platinum", "formation1h":"Pack Expert 1H", "formation2h":"Pack Formation 2H", "formation4h":"Pack Formation 4H" };


function ajaxCoachAccount(accountid) {
	var xmlHttp,data,params;
	
	try { xmlHttp=new XMLHttpRequest(); }
	catch (e) { // Internet Explorer
		try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
		catch (e) {
			try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
			catch (e) {
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function() {
		if (xmlHttp.readyState==4) {
		//alert(xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			$("#infoAccountRO").empty();
			$("#infoAccountRO").append("<table><tr><td>Raison sociale</td><td>"+data.displayname+"</td></tr><tr><td>Donn&eacute;es administratives</td><td>"+data.administratif+"</td></tr><tr><td>M&eacute;tier</td><td>"+data.metier+"</td></tr><tr><td>Interlocuteur</td><td>"+data.interlocuteur.replace(/\\n/g,'<br>')+"</td></tr><tr><td>Int&eacute;grateur</td><td>"+data.integrateur+"</td></tr><tr><td>Services d&eacute;ploy&eacute;s</td><td>"+data.services.replace(/\\n/g,'<br>')+"</td></tr><tr><td>Projet</td><td>"+data.projet.replace(/\\n/g,'<br>')+"</td></tr><tr><td>Connaissance IT</td><td>"+data.connaissanceit+"</td></tr><tr><td>Commentaires</td><td>"+data.commentaires.replace(/\\n/g,'<br>')+"</td></tr></table>\n<div id=\"buttonModifInfoAccount\">Modifier</div>\n");
			$("#buttonModifInfoAccount").button();
			$("#buttonModifInfoAccount").click( function () { $("#infoAccountContainer").toggleClass('flipped'); } );
			
//alert(data.commentaires+" ### "+data.commentaires.replace('\\n','\n'));
			$("#infoAccountRW").empty();
			$("#infoAccountRW").append("<form name='formInfoAccount' method='PUT' action='/php/processInfoCoachAccount.php'><input type='hidden' name='accountid' value='"+data.accountid+"'><table><tr><td>Raison sociale</td><td><input type='text' name='displayname' value='"+data.displayname+"'></td></tr><tr><td>Donn&eacute;es administratives</td><td><input type='text' name='administratif' value='"+data.administratif+"'></td></tr><tr><td>M&eacute;tier</td><td><input type='text' name='metier' value='"+data.metier+"'></td></tr><tr><td>Interlocuteur</td><td><textarea name='interlocuteur'>"+data.interlocuteur+"</textarea></td></tr><tr><td>Int&eacute;grateur</td><td><input type='text' name='integrateur' value='"+data.integrateur+"'></td></tr><tr><td>Services d&eacute;ploy&eacute;s</td><td><textarea name='services'>"+data.services.replace(/\\n/g,'\n')+"</textarea></td></tr><tr><td>Projet</td><td><input type='text' name='projet' value='"+data.projet.replace(/\\n/g,'\n')+"'></td></tr><tr><td>Connaissance IT</td><td><input type='text' name='connaissanceit' value='"+data.connaissanceit+"'></td></tr><tr><td>Commentaires</td><td><textarea name='commentaires'>"+data.commentaires.replace(/\\n/g,'\n')+"</textarea></td></tr></table>\n<div id=\"buttonValidInfoAccount\">Valider</div>\n<div id=\"buttonCancelInfoAccount\">Annuler</div>\n</form>");
			$("#buttonValidInfoAccount").button();
			$("#buttonValidInfoAccount").click( function () { ajaxSubmitCoachAccount(); } );
			$("#buttonCancelInfoAccount").button();
			$("#buttonCancelInfoAccount").click( function () { $("#infoAccountContainer").toggleClass('flipped'); } );
		}
	}

	url="/php/getInfoCoachAccount.php";
	if (accountid) {
		params = "account="+accountid;
		url += "?"+params;
	}

	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
}

function ajaxSubmitCoachAccount() {
	var xmlHttp,data,params;
	
	try { xmlHttp=new XMLHttpRequest(); }
	catch (e) { // Internet Explorer
		try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
		catch (e) {
			try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
			catch (e) {
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function() {
		if (xmlHttp.readyState==4) {
		//alert(xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			if (data.result == "ok") {
				$("#infoAccount").toggle("blind",{"direction":"up"},function() {$("#infoAccountContainer").toggleClass('flipped');});
			} else {
				alert(data.result);
			}

		}
	}

	url="/php/processInfoCoachAccount.php";
	params = "accountid="+$("input:hidden[name='accountid']").val();
	params += "&displayname="+encodeURIComponent($("input:text[name='displayname']").val());
	params += "&administratif="+encodeURIComponent($("input:text[name='administratif']").val());
	params += "&metier="+encodeURIComponent($("input:text[name='metier']").val());
	params += "&interlocuteur="+encodeURIComponent($("textarea[name='interlocuteur']").val());
	params += "&integrateur="+encodeURIComponent($("input:text[name='integrateur']").val());
	params += "&services="+encodeURIComponent($("textarea[name='services']").val());
	params += "&projet="+encodeURIComponent($("input:text[name='projet']").val());
	params += "&connaissanceit="+encodeURIComponent($("input:text[name='connaissanceit']").val());
	params += "&commentaires="+encodeURIComponent($("textarea[name='commentaires']").val());

	xmlHttp.open("POST",url,true);
	
	//Send the proper header information along with the request
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlHttp.send(params);
}

function ajaxCoach() {
	var xmlHttp,data;
	var tcoachcase = new Array;
	
	try { xmlHttp=new XMLHttpRequest(); }
	catch (e) { // Internet Explorer
		try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
		catch (e) {
			try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
			catch (e) {
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function() {
		if (xmlHttp.readyState==4) {
//		alert(xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			if (data.coachaccount.length) {		// on affiche les cases que d'un seul account
				coachaccount = data.coachaccount;
				$("#showinfocoachaccount").css("display","block");
				$("#showinfocoachaccount").click(function() { showInfoAccount("",coachaccount); });
			} else {
				coachaccount = "";
				$("#showinfocoachaccount").css("display","none");
			}
			resCase = document.getElementById('resCase');
			while (resCase.hasChildNodes()) {
				resCase.removeChild(resCase.firstChild);
			}
			document.getElementById('nbcases').innerHTML = data.coachcase.length;
			if (data.coachcase.length > 1) { document.getElementById('plurielnbcases').innerHTML = "s"; } else { document.getElementById('plurielnbcases').innerHTML = ""; }
			document.getElementById('nbevents').innerHTML = data.coachevent.length;
			if (data.coachevent.length > 1) { document.getElementById('plurielnbevents').innerHTML = "s"; } else { document.getElementById('plurielnbevents').innerHTML = ""; }
			//alert(data.coachcase.length);
			for (var i=0; i<data.coachcase.length; i++) {
				div = document.createElement("div");
				div.setAttribute("id","cc"+data.coachcase[i].id);
				caseclass = "coachcase";
				if (data.coachcase[i].status == "CLOS" || data.coachcase[i].status == "REJETE") { caseclass += " ccclos"; }
				div.setAttribute("class",caseclass);
				tcoachcase[data.coachcase[i].id] = i;
//				div.setAttribute("onclick","showCase('cc"+data.coachcase[i].id+"')");
				resCase.appendChild(div);

				divg = document.createElement("div");
				divg.setAttribute("class","ccgauche");
				div.appendChild(divg);
				subdiv = document.createElement("div");
				subdiv.setAttribute("class","ccdate");
				texte = document.createTextNode(data.coachcase[i].date);
				subdiv.appendChild(texte);
				divg.appendChild(subdiv);
				subdiv = document.createElement("div");
				if (data.coachcase[i].status == "REJETE") { subdiv.setAttribute("class","ccstatus ccstatusrejete"); }
				else { subdiv.setAttribute("class","ccstatus"); }
				texte = document.createTextNode(data.coachcase[i].status);
				subdiv.appendChild(texte);
				divg.appendChild(subdiv);
				subdiv = document.createElement("div");
				if (data.coachcase[i].coach != "") {
					subdiv.setAttribute("class","cccoach");
					texte = document.createTextNode(data.coachcase[i].coach); }
				else {
					subdiv.setAttribute("class","cccoachvide");
					texte = document.createTextNode("NON ATTRIBUE");
				}
				subdiv.appendChild(texte);
				divg.appendChild(subdiv);

				divc = document.createElement("div");
				divc.setAttribute("class","cccentre");
				div.appendChild(divc);
				subdiv = document.createElement("div");
				subdiv.setAttribute("class","ccaccount");
//				if (coachvhmaccount == "") {
				if (coachaccount == "") {
					texte = document.createTextNode(data.coachcase[i].accountname);
					subdiv.setAttribute("onclick","showInfoAccount('cc"+data.coachcase[i].id+"','"+data.coachcase[i].accountid+"')");
					subdiv.appendChild(texte);
				}
				divc.appendChild(subdiv);
				subdiv = document.createElement("div");
				subdiv.setAttribute("class","cctype");
				
				subdivtype = document.createElement("div");
				subdivtype.setAttribute("class","cctypenom");
				texte = document.createTextNode(TCaseType[data.coachcase[i].type]);
				subdivtype.appendChild(texte);
				subdiv.appendChild(subdivtype);
				if (data.coachcase[i].type == "prestation") {
					subdivtype = document.createElement("div");
					subdivtype.setAttribute("class","cctypepacknom");
					subdivtype.setAttribute("packname",data.coachcase[i].packname);
					texte = document.createTextNode(TCasePack[data.coachcase[i].packname]);
					subdivtype.appendChild(texte);
					subdiv.appendChild(subdivtype);
					subdivtype = document.createElement("div");
					subdivtype.setAttribute("class","cctypepackamount");
					texte = document.createTextNode(data.coachcase[i].amount+" EUR");
					subdivtype.appendChild(texte);
					subdiv.appendChild(subdivtype);
					subdivtype = document.createElement("div");
					subdivtype.setAttribute("class","cctypepackid");
					texte = document.createTextNode(data.coachcase[i].packid);
					subdivtype.appendChild(texte);
					subdiv.appendChild(subdivtype);
					if (data.coachcase[i].packremainingtime != "") {
						subdivtype = document.createElement("div");
						subdivtype.setAttribute("class","cctypepacktime");
						texte = document.createTextNode("Reste ");
						subdivtype.appendChild(texte); 
						span = document.createElement("span");
						span.setAttribute("id","typepacktimecc"+data.coachcase[i].id);
						texte = document.createTextNode(data.coachcase[i].packremainingtime);
						span.appendChild(texte);
						subdivtype.appendChild(span); 
						texte = document.createTextNode(" min.");
						subdivtype.appendChild(texte); 
						subdiv.appendChild(subdivtype);
					}
				}
				divc.appendChild(subdiv);
				subdiv = document.createElement("div");
				subdiv.setAttribute("class","ccdetails");
				texte = document.createTextNode(data.coachcase[i].details);
				subdiv.appendChild(texte);
				divc.appendChild(subdiv);

				divd = document.createElement("div");
				divd.setAttribute("class","ccdroite");
				div.appendChild(divd);
//				if (coachoffer == "" || coachoffer == "TOUTES") {
					subdiv = document.createElement("div");
					subdiv.setAttribute("class","ccoffer");
					if (data.coachcase[i].fcaccountfk != "") {
						subdiv.setAttribute("onclick","window.open('/php/account3d.php?account="+data.coachcase[i].fcaccountfk+"')");
						star = "*";
					} else { star = ""; }
					texte = document.createTextNode(data.coachcase[i].offer+star);
					subdiv.appendChild(texte);
					divd.appendChild(subdiv);
//				}

				subdiv = document.createElement("div");
				subdiv.setAttribute("class","ccplusevent");
				img = document.createElement("img");
				img.setAttribute("src","/images/eventplus.png");
				img.setAttribute("title","case id="+data.coachcase[i].id);
				img.setAttribute("onclick","showNewEvent('cc"+data.coachcase[i].id+"')");
				subdiv.appendChild(img);
				divd.appendChild(subdiv);
				subdiv = document.createElement("div");
				subdiv.setAttribute("class","cclinkdetails");
				subdiv.setAttribute("onclick","showCoachCase('cc"+data.coachcase[i].id+"')");
				subdiv.innerHTML = "D&eacute;tails";
				//texte = document.createTextNode("D&eacute;tails");
				//subdiv.appendChild(texte);
				divd.appendChild(subdiv);

				divclear = document.createElement("div");
				divclear.setAttribute("class","clear");
				div.appendChild(divclear);
			}

			for (var i=0; i<data.coachevent.length; i++) {
			if (tcoachcase[data.coachevent[i].coachcasefk] >= 0) {
				coachcase = document.getElementById("cc"+data.coachevent[i].coachcasefk);
				div = document.createElement("div");
//				div.setAttribute("class","coachevent");
//				if (data.coachevent[i].origrole == "client") { eventclass = "client"; } else { eventclass = "orange"; }
				eventclass = "cc"+data.coachevent[i].origrole;
				if (data.coachcase[tcoachcase[data.coachevent[i].coachcasefk]].status == "CLOS" || data.coachcase[tcoachcase[data.coachevent[i].coachcasefk]].status == "REJETE") { eventclass += " cecache"; }
				div.setAttribute("class","coachevent "+eventclass);

				divg = document.createElement("div");
				divg.setAttribute("class","cegauche");
				div.appendChild(divg);
				subdiv = document.createElement("div");
				subdiv.setAttribute("class","cedate");
				if (data.coachevent[i].medium) { valtexte = " ["+data.coachevent[i].medium+"]"; } else { valtexte = ""; }
				texte = document.createTextNode(data.coachevent[i].date+valtexte);
				subdiv.appendChild(texte);
				divg.appendChild(subdiv);

				subdiv = document.createElement("div");
				subdiv.setAttribute("class","ceorig");
				texte = document.createTextNode(data.coachevent[i].origname+" ["+data.coachevent[i].origrole+"]");
				subdiv.appendChild(texte);
				divg.appendChild(subdiv);

				subdiv = document.createElement("div");
				subdiv.setAttribute("class","cetype");
				if (data.coachevent[i].type != "") {
					img = document.createElement("img");
					if (data.coachevent[i].type == "echange") { img.setAttribute("src","/images/smiley.png"); }
					else if (data.coachevent[i].type == "absent") { img.setAttribute("src","/images/stop.png"); }
					subdiv.appendChild(img);
				} 
				div.appendChild(subdiv);
				
//				texte = document.createTextNode(data.coachevent[i].type);
//				subdiv.appendChild(texte);
//				div.appendChild(subdiv);

				divd = document.createElement("div");
				divd.setAttribute("class","cedroite");
				div.appendChild(divd);
				subdiv = document.createElement("div");
				subdiv.setAttribute("class","cedetails");
				subdiv.innerHTML = data.coachevent[i].details;
				//texte = document.createTextNode(data.coachevent[i].details);
				//subdiv.appendChild(texte);
				divd.appendChild(subdiv);

				subdiv = document.createElement("div");
				subdiv.setAttribute("class","celogstatus");
				texte = document.createTextNode(data.coachevent[i].logchangecase);
				subdiv.appendChild(texte);
				divd.appendChild(subdiv);

//				subdiv = document.createElement("div");
//				subdiv.setAttribute("class","cerecby");
//				texte = document.createTextNode(data.coachevent[i].createdon);
//				subdiv.appendChild(texte);
//				divd.appendChild(subdiv);

				divclear = document.createElement("div");
				divclear.setAttribute("class","clear");
				div.appendChild(divclear);

				coachcase.appendChild(div);
			}
			}
		}
	}

	// important ! on rattache le formulaire evt à son point d'attache d'origine avant de rafraichir la liste des cases
	$("#coach").append($("#newEvent"));
	if ($("#infoAccount").css("display") != "none") { $("#infoAccount").toggle("blind",{"direction":"up"}); $("#coach").append($("#infoAccount")); }
	else { $("#infoAccount").insertAfter($("#headcoach")); }

	url="/php/getCoach.php";
	params = "";
	if (coachvhmaccount) { if (params) {params += "&"; } params += "vhmaccount="+coachvhmaccount; }
	if (coachaccount) { if (params) {params += "&"; } params += "account="+coachaccount; }
	if (coachoffer)   { if (params) {params += "&"; } params += "offer="+coachoffer; }
	if (coachname)    { if (params) {params += "&"; } params += "coach="+coachname; }
	if (coachstatus)  { if (params) {params += "&"; } params += "status="+coachstatus; }
	if (coachorder)  { if (params) {params += "&"; } params += "order="+coachorder; }
	if (coachdate)   { if (params) {params += "&"; } params += "date="+coachdate; }
	if (coachrecherche) { if (params) {params += "&"; } params += "recherche="+coachrecherche; }
	if (params)       { url += "?"+params; }
//alert(params);
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
console.log("url="+url);
}


function showCoachCase(caseid) {
	$("#"+caseid+">.coachevent").toggle("blind",{"direction":"up"});
}

function resetNewEvent() {
	var d = new Date();
	var curr_jour = d.getDate();
	var curr_mois = d.getMonth() + 1;
	var curr_annee = d.getFullYear();
	if (curr_jour < 10) { curr_jour = "0"+curr_jour; }
	if (curr_mois < 10) { curr_mois = "0"+curr_mois; }
	var dateDuJour = curr_annee + "-" + curr_mois + "-" + curr_jour;

	var idcase = $("#newEvent").parent().get(0).id;
	var coachincharge = $("#"+idcase+">div.ccgauche>div.cccoach").text();
	var eventtimeremaining = $("#"+idcase+">div.ccgauche>div.cccoach").text();
	var casedetails = $("#"+idcase+">div.cccentre>div.ccdetails").text();
	var casestatus = $("#"+idcase+">div.ccgauche>div.ccstatus").text();
	var casepackid = $("#"+idcase+">div.cccentre>div.cctype>div.cctypepackid").text();

	$("input:text[name='eventdate']").val(dateDuJour);
	$("input:radio[name='origrole']").prop("checked",false);
	$("#datesuspended").css("display","none");
	$("input:text[name='datesuspended']").val("");
	if (coachincharge != "") {
		$("input:radio[name='cenomcoach'][value='"+coachincharge+"']").prop("checked",true);
	} else {
		$("input:radio[name='cenomcoach']").prop("checked",false);
	}
	$("#origname").css("display","none");
	$("input:text[name='origname']").val("");
	$("input:radio[name='medium']").prop("checked",false);
	$("input:radio[name='eventtype']").prop("checked",false);
	$("input:radio[name='eventtype']").prop("disabled",true);
	$("textarea[name='cedetails']").val("");
	if (casestatus != "") {
//	alert("#"+casestatus+"#");
		$("input:radio[name='newcasestatus'][value='"+casestatus+"']").prop("checked",true);
	} else {
		$("input:radio[name='newcasestatus']").prop("checked",false);
	}
	$("#cemsctid").css("display","none");
	$("input:text[name='msctid']").val(casepackid);
	
//	$("input:radio[name='newcasestatus']").prop("checked",false);
	$("input:text[name='passedtime']").val("");
//	alert("#typepacktime"+idcase+"   "+$("#cctypepacktime"+idcase).length);
	$("#eventtimepassed").css("display","none");
	//if ($("#typepacktime"+idcase).length) { $("#eventtimepassed").css("display","table-row"); } else { $("#eventtimepassed").css("display","none"); }
	$("input:text[name='casedetails']").val(casedetails);
	
	$("input:radio[name='origrole']").button( "refresh");
	$("input:radio[name='cenomcoach']").button( "refresh");
	$("input:radio[name='medium']").button( "refresh");
//	$("input:radio[name='eventtype']").button( "refresh");
	$("input:radio[name='newcasestatus']").button( "refresh");

}

function resetNewCase() {
	$("input:text[name='accountname']").val("");
	$("input:radio[name='casetype']").prop("checked",false);
	if (coachaccount != "" || coachvhmaccount != "") { $("#newcaseaccount").css("display","none"); }
	else {
		$("#newcaseaccount").css("display","table-row");
		$("input:radio[name='casetype']").prop("disabled",true);
		$("input:radio[name='casetype'][value='avantvente']").prop("disabled",false);
		$("input:radio[name='casetype'][value='devis']").prop("disabled",false);
		$("input:radio[name='casetype'][value='autre']").prop("disabled",false);
	}
	if (coachoffer != "" && coachoffer != "TOUTES")   { $("input:radio[name='caseoffer']").val(coachoffer); $("#newcaseoffer").css("display","none"); }
	else { $("input:radio[name='caseoffer']").prop("checked",false); $("#newcaseoffer").css("display","table-row"); }
	$("#casePackFC").css("display","none");
	$("input:radio[name='casepackfc']").prop("checked",false);
//	$("input:text[name='msctfc']").val("");
	$("input:text[name='amountfc']").val("");
	$("#casePackFS").css("display","none");
	$("input:radio[name='casepackfs']").prop("checked",false);
//	$("input:text[name='msctfs']").val("");
	$("input:text[name='amountfs']").val("");
	if (coachname != "" && coachname != "TOUS" && coachname != "AUCUN") { 
		$("input:radio[name='ccnomcoach'][value='"+coachname+"']").prop("checked",true);
	} else {
		$("input:radio[name='ccnomcoach']").prop("checked",false);
	}
	$("input:text[name='details']").val("");
	
	$("input:radio[name='caseoffer']").button("refresh");
	$("input:radio[name='ccnomcoach']").button("refresh");
	$("input:radio[name='casetype']").button("refresh");
	$("input:radio[name='casepackfc']").button("refresh");
	$("input:radio[name='casepackfs']").button("refresh");

	//	alert($("input:radio[name='casetype'][value='question']").button("option"));
/*
document.getElementById('formCase').reset();
	$("input:radio[name=casetype]:checked").prop("checked",false);
	$("input:radio[name=casetype]").val("");
	$("input:radio[name=casepackfc]").val("");
	$("input:radio[name=casepackfc]").prop("checked",false);
	$("input:radio[name=casepackfs]").prop("checked",false);
*/
}

function ajaxNewCase() {
	var xmlHttp,url,params,data;
	try { xmlHttp=new XMLHttpRequest(); }
	catch (e) { // Internet Explorer
		try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
		catch (e) {
			try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
			catch (e) {
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function() {
		if (xmlHttp.readyState==4) {
		//alert ("##"+xmlHttp.responseText+"##");
			data = eval("("+xmlHttp.responseText+")");
			if (data.result == "ok") {
//				$("#formCase").reset();
				//document.getElementById("formCase").reset();
				//$("form:first").trigger('reset');
				//updatePackCC('reset');
				$("#newCase").toggle("blind",{"direction":"up"});
				ajaxCoach();
			} else {
				alert(data.result);
			}
		}
	}

	// important ! on rattache le formulaire evt à son point d'attache d'origine avant d'invoquer le script php de création
	$("#coach").append($("#newEvent"));
	
	url="/php/processCase.php";

	params = "action=newcase";
	params += "&account="+coachaccount;
	params += "&vhmaccount="+coachvhmaccount;
	params += "&accountname="+encodeURIComponent($("input:text[name='accountname']").val());
	params += "&coach=";
	if ($("input:radio[name='ccnomcoach']:checked").length) { params += $("input:radio[name='ccnomcoach']:checked").val(); }
//	if (coachname) { params += coachname; }
	params += "&caseoffer=";
	if (coachoffer) { params += coachoffer; }
	else { if ($("input:radio[name='caseoffer']:checked").length) { params += $("input:radio[name='caseoffer']:checked").val(); } }
	params += "&casetype=";
	if ($("input:radio[name='casetype']:checked").length) { params += $("input:radio[name='casetype']:checked").val(); }
	if ($("input:radio[name='casepackfc']:checked").length) {
		params += "&casepackfc="+$("input:radio[name='casepackfc']:checked").val();
	}
	if ($("input:radio[name='casepackfs']:checked").length) {
		params += "&casepackfs="+$("input:radio[name='casepackfs']:checked").val();
	}
//	params += "&msctfc="+$("input:text[name='msctfc']").val();
//	params += "&msctfs="+$("input:text[name='msctfs']").val();
	params += "&amountfc="+$("input:text[name='amountfc']").val();
	params += "&amountfs="+$("input:text[name='amountfs']").val();
	params += "&details="+encodeURIComponent($("input:text[name='details']").val());
	
	xmlHttp.open("POST",url,true);
	
	//Send the proper header information along with the request
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//	xmlHttp.setRequestHeader("Content-length", params.length);
//	xmlHttp.setRequestHeader("Connection", "close");
//alert(params);
	xmlHttp.send(params);
}

function ajaxNewEvent() {
	var xmlHttp,url,params,data;
	try { xmlHttp=new XMLHttpRequest(); }
	catch (e) { // Internet Explorer
		try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
		catch (e) {
			try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
			catch (e) {
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function() {
		if (xmlHttp.readyState==4) {
		//alert ("##"+xmlHttp.responseText+"##");
			data = eval("("+xmlHttp.responseText+")");
			if (data.result == "ok") {
//				$("#formCase").reset();
				//document.getElementById("formCase").reset();
				//$("form:first").trigger('reset');
				//updatePackCC('reset');
				$("#newEvent").toggle("blind",{"direction":"up"});
				// important ! on rattache le formulaire evt à son point d'attache d'origine avant d'invoquer le script php de création
				$("#coach").append($("#newEvent"));
				ajaxCoach();
			} else {
				alert(data.result);
			}
		}
	}

	
	url="/php/processCase.php";

//	alert($("textarea[name='cedetails']").val()+"##"+encodeURIComponent($("textarea[name='cedetails']").val()));
	params = "action=newevent";
	params += "&caseid="+$("input:hidden[name='caseid']").val();
//	params += "&eventdate="+encodeURIComponent($("input:text[name='eventdate']").val());
	params += "&eventdate="+$("input:text[name='eventdate']").val();
	params += "&origrole=";
	if ($("input:radio[name='origrole']:checked").length) { params += $("input:radio[name='origrole']:checked").val(); }
	params += "&origname="+encodeURIComponent($("input:text[name='origname']").val());
	params += "&medium=";
	if ($("input:radio[name='medium']:checked").length) { params += $("input:radio[name='medium']:checked").val(); }
	params += "&msctid="+$("input:text[name='msctid']").val();
	params += "&eventtype=";
	if ($("input:radio[name='eventtype']:checked").length) { params += $("input:radio[name='eventtype']:checked").val(); }
	params += "&details="+encodeURIComponent($("textarea[name='cedetails']").val());
	params += "&cenomcoach=";
	if ($("input:radio[name='cenomcoach']:checked").length) { params += $("input:radio[name='cenomcoach']:checked").val(); }
	params += "&newcasestatus=";
	if ($("input:radio[name='newcasestatus']:checked").length) { params += $("input:radio[name='newcasestatus']:checked").val(); }
	params += "&datesuspended="+encodeURIComponent($("input:text[name='datesuspended']").val());
	params += "&passedtime="+encodeURIComponent($("input:text[name='passedtime']").val());
	params += "&casedetails="+encodeURIComponent($("input:text[name='casedetails']").val());
	
	xmlHttp.open("POST",url,true);
	
	//Send the proper header information along with the request
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//	xmlHttp.setRequestHeader("Content-length", params.length);
//	xmlHttp.setRequestHeader("Connection", "close");
//alert(params);
	xmlHttp.send(params);
}

function showNewEvent(caseid) {
	var divcase = document.getElementById(caseid);
	var divnewevent = document.getElementById('newEvent');
	var idparent = $("#newEvent").parent().get(0).id;
//	var caseid = idparent.substring(2);

	if (idparent != caseid) {
		divnewevent.style.display = 'none';
		divcase.appendChild(divnewevent);
//alert(idparent);	
		$("input:hidden[name='caseid']").val(caseid.substring(2));
	}
	resetNewEvent();
	getOrigname();
	$("#newEvent").toggle("blind",{"direction":"up"});
}

function showInfoAccount(caseid,accountid) {
	// le caseid sert à positionner le formulaire, l'accountid à aller chercher les bonnes infos
	// si le caseid est null alors on est dans le cas d'une consultation d'un seul account
	if (caseid != "") {
		var divcase = document.getElementById(caseid);
		var divinfoaccount = document.getElementById('infoAccount');
		var idparent = $("#infoAccount").parent().get(0).id;
//	var caseid = idparent.substring(2);
//alert(caseid+"#"+accountid);	

		if (idparent != caseid) {
			divinfoaccount.style.display = 'none';
			divcase.appendChild(divinfoaccount);
			$("input:hidden[name='caseid']").val(caseid.substring(2));
		}
	}
//	resetNewEvent();
	ajaxCoachAccount(accountid);
	$("#infoAccount").toggle("blind",{"direction":"up"});
}


var dataOrig;

function getOrigname () {
	var xmlHttp,url,params,data;
	try { xmlHttp=new XMLHttpRequest(); }
	catch (e) { // Internet Explorer
		try { xmlHttp=new ActiveXObject("Msxml2.XMLHTTP"); }
		catch (e) {
			try { xmlHttp=new ActiveXObject("Microsoft.XMLHTTP"); }
			catch (e) {
				alert("Your browser does not support AJAX!");
				return false;
			}
		}
	}
	xmlHttp.onreadystatechange=function() {
		if (xmlHttp.readyState==4) {
		//alert ("##"+xmlHttp.responseText+"##");
			dataOrig = eval("("+xmlHttp.responseText+")");
		}
	}

	
	url="/php/getOrigname.php?caseid="+$("input:hidden[name='caseid']").val();
//	params = "";
//	if (coachaccount) { if (params) {params += "&"; } params += "account="+coachaccount; }
//	if (coachoffer)   { if (params) {params += "&"; } params += "offer="+coachoffer; }
//	if (params)       { url += "?"+params; }
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
}

</script>
