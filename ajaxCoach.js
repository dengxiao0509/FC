<script type="text/javascript" >

//jQuery.fn.reset = function () {
//  $(this).each (function() { this.reset(); });
//}

// able to parameter ?
var TCaseType = { "avantvente":"Support Avant-Vente", "devis":"Devis", "tryer":"Accompagnement Tryer", "welcome":"Welcome Nouveau client", "30min":"30 minutes gratuites", "question":"Question / R\351ponse", "prestation":"Prestation", "conso":"Relance consommation nulle", "alerte":"Appel pro-actif", "autre":"Sollicitation simple" };
var TCasePack = ""; 
//var TCasePack = { "middleware":"Cr\351ation VM avec installation logiciel", "configfw":"Aide Configuration FW", "demarrage":"Pack D\351marrage", "construction":"Pack Construction", "optimisation":"Pack Optimisation", "performance":"Pack Performance", "securite":"Pack S\351curit\351", "expert1h":"Pack Expert 1H", "expert2h":"Pack Expert 2H", "expert4h":"Pack Expert 4H", "expertannee":"Pack Expert Annuel", "prestadevis":"sur devis", "logbronze":"Pack Logiciel Bronze", "logsilver":"Pack Logiciel Silver", "loggold":"Pack Logiciel Gold", "logplatinum":"Pack Logiciel Platinum", "formation1h":"Pack Expert 1H", "formation2h":"Pack Formation 2H", "formation4h":"Pack Formation 4H" };

var dataConfig = "";  //configuration data
var accounts = [];    // list of account names


// show all the cases and events
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
		//alert(xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			//alert(data.coachaccount.length);
			if (data.coachaccount.length) {		// on affiche les cases que d'un seul account
				coachaccount = data.coachaccount;
				$("#showinfocoachaccount").css("display","block");
				$("#showinfocoachaccount").click(function() { showInfoAccount("",coachaccount); });
			} else {
				coachaccount = "";
				$("#showinfocoachaccount").css("display","none");
			}
			
			//important !!!!!!!
			$("#coach").append($("#newCase"));
			$("#coach").append($("#newEvent")); 
			
			$("#newCase").css("display","none");
			
			resCase = document.getElementById('resCase');
			while (resCase.hasChildNodes()) {
				resCase.removeChild(resCase.firstChild);
			}
			document.getElementById('nbcases').innerHTML = data.coachcase.length;
			if (data.coachcase.length > 1) { document.getElementById('plurielnbcases').innerHTML = "s"; } else { document.getElementById('plurielnbcases').innerHTML = ""; }
			document.getElementById('nbevents').innerHTML = data.coachevent.length;
			if (data.coachevent.length > 1) { document.getElementById('plurielnbevents').innerHTML = "s"; } else { document.getElementById('plurielnbevents').innerHTML = ""; }
			//alert(data.coachevent.length);
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
				subdiv.setAttribute("title","Afficher/Modifier les informations du compte");
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
				
				if(data.coachcase[i].type == "devis" && data.coachcase[i].amount != "") {
					subdivtype = document.createElement("div");
					subdivtype.setAttribute("class","cctypedevisamount");
					texte = document.createTextNode(data.coachcase[i].amount+" EUR");
					subdivtype.appendChild(texte);
					subdiv.appendChild(subdivtype);
					
				}
				
				else if (data.coachcase[i].type == "prestation") {
					subdivtype = document.createElement("div");
					subdivtype.setAttribute("class","cctypepacknom");
					subdivtype.setAttribute("packname",data.coachcase[i].packname);
					texte = document.createTextNode(TCasePack[data.coachcase[i].packname]);
					subdivtype.appendChild(texte);
					subdiv.appendChild(subdivtype);
					
					if(data.coachcase[i].amount != ""){
					subdivtype = document.createElement("div");
					subdivtype.setAttribute("class","cctypepackamount");
					texte = document.createTextNode(data.coachcase[i].amount+" EUR");
					subdivtype.appendChild(texte);
					subdiv.appendChild(subdivtype);
					}
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
				
				
/* //				if (coachoffer == "" || coachoffer == "TOUTES") {
					subdiv = document.createElement("div");
					subdiv.setAttribute("class","ccoffer");
					if (data.coachcase[i].fcaccountfk != "") {
						subdiv.setAttribute("onclick","window.open('/php/account3d.php?account="+data.coachcase[i].fcaccountfk+"')");
						star = "*";
					} else { star = ""; }
					texte = document.createTextNode(data.coachcase[i].offer+star);
					subdiv.appendChild(texte);
					divd.appendChild(subdiv);
					
//				} */

				divpro = document.createElement("div");
				divpro.setAttribute("class","ccprocess");
				divd.appendChild(divpro); 
				
				//add button
				divplus = document.createElement("div");
				divplus.setAttribute("class","ccplus");
     			
				img = document.createElement("img");
				img.setAttribute("src","/images/add1.png");
				img.setAttribute("class","proIcon");

				img.setAttribute("title","case id="+data.coachcase[i].id + " Ajouter");
				img.setAttribute("onclick","showNewEvent('cc"+data.coachcase[i].id+"')");

				divplus.appendChild(img);
				divpro.appendChild(divplus);

				// edit button
				divmodi = document.createElement("div");
				divmodi.setAttribute("class","ccmodify");

				img = document.createElement("img");
				img.setAttribute("src","/images/edit1.png");
				img.setAttribute("title","Modifier");				
				img.setAttribute("class","proIcon");				
				img.setAttribute("onclick","showModifyCase('cc"+data.coachcase[i].id+"')");

				divmodi.appendChild(img);
				divpro.appendChild(divmodi);
						
				// delete button		
				divdele = document.createElement("div");
				divdele.setAttribute("class","ccdelete");
							
				img = document.createElement("img");
				img.setAttribute("src","/images/delete1.png");
				img.setAttribute("title","Supprimer");
				img.setAttribute("class","proIcon");
				img.setAttribute("onclick","confirmDeleteCase("+data.coachcase[i].id+")");
				
				divdele.appendChild(img);				
				divpro.appendChild(divdele);

				// button 'details'
				subdiv = document.createElement("div");
				subdiv.setAttribute("class","cclinkdetails");
				subdiv.setAttribute("title","Afficher/Cacher les d\u00E9tails");
				subdiv.setAttribute("onclick","showCoachCase('cc"+data.coachcase[i].id+"')");
				subdiv.innerHTML = "D&eacute;tails";
				
				divpro.appendChild(subdiv);
				
				//icone 'details'
		/* 		divdetails = document.createElement("div");
				divdetails.setAttribute("class","cclinkdetails");
				divdetails.setAttribute("onclick","showCoachCase('cc"+data.coachcase[i].id+"')");
								
				img = document.createElement("img");
				img.setAttribute("src","/images/details.png");
				img.setAttribute("title","case id="+data.coachcase[i].id);
				//img.setAttribute("height","15px");
				img.setAttribute("width","10px");
				img.setAttribute("onclick","showCoachCase('cc"+data.coachcase[i].id+"')");
			
				divdetails.appendChild(img);
				divpro.appendChild(divdetails); */
				
				
				//	if (coachoffer == "" || coachoffer == "TOUTES") {
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
				
				divPJ = document.createElement("div");
				divPJ.setAttribute("id","listPJ");
				var ulItem = document.createElement("ul");

				if(data.coachcase[i].PJFiles.length > 0 ){
					for(var k=0; k<data.coachcase[i].PJFiles.length; k++){
						
						var filename = data.coachcase[i].PJFiles[k];
						var filedir = "files/case" + data.coachcase[i].id;
						var fileItem = document.createElement("li");
						
						var filenamediv = document.createElement("a");
						filenamediv.innerHTML = filename;
						filenamediv.setAttribute("title","T\u00E9l\u00E9charger "+ filename);
						filenamediv.setAttribute("href", filedir + "/" + filename);
						fileItem.appendChild(filenamediv);
							
						ulItem.appendChild(fileItem);
					}
				}
				
				divPJ.appendChild(ulItem);
				div.appendChild(divPJ);
				
				divclear = document.createElement("div");
				divclear.setAttribute("class","clear");
				div.appendChild(divclear);
				
				divcasevide = document.createElement("div");
				divcasevide.setAttribute("id","casevide");
				div.appendChild(divcasevide);
				
			}

			for (var i=0; i<data.coachevent.length; i++) {
			if (tcoachcase[data.coachevent[i].coachcasefk] >= 0) {
				var caseparentid = "cc"+data.coachevent[i].coachcasefk;
				coachcase = document.getElementById(caseparentid);
				divevnt = document.createElement("div");
				divevnt.setAttribute("id",data.coachevent[i].id);
//				div.setAttribute("class","coachevent");
//				if (data.coachevent[i].origrole == "client") { eventclass = "client"; } else { eventclass = "orange"; }
				eventclass = "cc"+data.coachevent[i].origrole;
				if (data.coachcase[tcoachcase[data.coachevent[i].coachcasefk]].status == "CLOS" || data.coachcase[tcoachcase[data.coachevent[i].coachcasefk]].status == "REJETE") { eventclass += " cecache"; }
				divevnt.setAttribute("class","coachevent "+eventclass);

				divEventProcess = document.createElement("div");
				divEventProcess.setAttribute("class","eventprocess");
				divevnt.appendChild(divEventProcess);
				
				
				/* //delete event				
				edtextdiv = document.createElement("div");
				edtextdiv.setAttribute("class","eventdelete");
				edtextdiv.innerHTML = "Delete";
				edtextdiv.setAttribute("onclick","confirmDeleteEvent("+data.coachevent[i].id+","+ data.coachevent[i].coachcasefk +")");
				divEventProcess.appendChild(edtextdiv);
				
				//modify event
				emtextdiv = document.createElement("div");
				emtextdiv.setAttribute("class","eventmodify");
				emtextdiv.innerHTML = "Modify";
				emtextdiv.setAttribute("onclick","showModifyEvent("+data.coachevent[i].id+")");
				divEventProcess.appendChild(emtextdiv); */
				
				
				divg = document.createElement("div");
				divg.setAttribute("class","cegauche");
				divevnt.appendChild(divg);
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
				//if (data.coachevent[i].type != "") {
				if (data.coachevent[i].type == "echange" || data.coachevent[i].type == "absent") {
					img = document.createElement("img");
					if (data.coachevent[i].type == "echange") { img.setAttribute("src","/images/smiley.png"); }
					else if (data.coachevent[i].type == "absent") { img.setAttribute("src","/images/stop.png"); }
					subdiv.appendChild(img);
				} 
				divevnt.appendChild(subdiv);
				
//				texte = document.createTextNode(data.coachevent[i].type);
//				subdiv.appendChild(texte);
//				div.appendChild(subdiv);

				divd = document.createElement("div");
				divd.setAttribute("class","cedroite");
				divevnt.appendChild(divd);
				
				///////////////////////////////////////////
				divevtpro = document.createElement("div");
				divevtpro.setAttribute("class","ceprocess")
				
				// edit button
				divmodi = document.createElement("div");
				divmodi.setAttribute("class","cemodify");

				img = document.createElement("img");
				img.setAttribute("src","/images/edit5.png");
				img.setAttribute("title","Modifier");				
				img.setAttribute("class","eventproIcon");				
				img.setAttribute("onclick","showModifyEvent("+data.coachevent[i].id+","+ data.coachevent[i].coachcasefk +")");
				divmodi.appendChild(img);
				divevtpro.appendChild(divmodi);
						
				// delete button		
				divdele = document.createElement("div");
				divdele.setAttribute("class","cedelete");
							
				img = document.createElement("img");
				img.setAttribute("src","/images/delete5.png");
				img.setAttribute("title","Supprimer");
				img.setAttribute("class","eventproIcon");
				img.setAttribute("onclick","confirmDeleteEvent("+data.coachevent[i].id+","+ data.coachevent[i].coachcasefk +")");
				
				divdele.appendChild(img);				
				divevtpro.appendChild(divdele);
				
				divd.appendChild(divevtpro);
				///////////////////////////////////////////
				
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
				divevnt.appendChild(divclear);

				diveventvide = document.createElement("div");
				diveventvide.setAttribute("id","eventvide");
				divevnt.appendChild(diveventvide);
				
				coachcase.appendChild(divevnt);
			}
			}
			
		}
		
	}

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

// get configuration data and assign to local variables (xiao)
function ajaxGetConfig() {

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
		//alert(xmlHttp.responseText);
			dataConfig = eval("("+xmlHttp.responseText+")");
			
			TCasePack = dataConfig.prestations;
			//alert(TCasePack["demarrage"]);	
		}
	}
	
	url="/php/getConfig.php";
	params = "";
	
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
}


/************** Functions used to process accounts *************************/

//show account information
function showInfoAccount(caseid,accountid) {
	// le caseid sert à positionner le formulaire, l'accountid à aller chercher les bonnes infos
	// si le caseid est null alors on est dans le cas d'une consultation d'un seul account
	if (caseid != "") {
		var divcase = document.getElementById(caseid);
		var divinfoaccount = document.getElementById('infoAccount');
		var idparent = $("#infoAccount").parent().get(0).id;
//	var caseid = idparent.substring(2);
//alert(caseid+"#"+accountid);	

	var div5 = divcase.childNodes[5];

		if (idparent != caseid) {
			divinfoaccount.style.display = 'none';
			divcase.insertBefore(divinfoaccount,div5);    // show the form at top of envelop
			$("input:hidden[name='caseid']").val(caseid.substring(2));
		}
	}
//	resetNewEvent();
	ajaxCoachAccount(accountid);
	$("#infoAccount").toggle("blind",{"direction":"up"});
	$("#infoAccountContainer").removeClass('flipped');
	//hide all other forms
	$("#newCase").css("display","none");
	$("#newEvent").css("display","none");
}

// get data of an account from the database
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
			//alert(data.displayname);
			$("#infoAccountRO").empty();
			$("#infoAccountRO").append("<table><tr><td>Raison sociale</td><td>"+data.displayname+"</td></tr><tr><td>Donn&eacute;es administratives</td><td>"+data.administratif+"</td></tr><tr><td>M&eacute;tier</td><td>"+data.metier+"</td></tr><tr><td>Interlocuteur</td><td>"+data.interlocuteur.replace(/\\n/g,'<br>')+"</td></tr><tr><td>Int&eacute;grateur</td><td>"+data.integrateur+"</td></tr><tr><td>Services d&eacute;ploy&eacute;s</td><td>"+data.services.replace(/\\n/g,'<br>')+"</td></tr><tr><td>Projet</td><td>"+data.projet.replace(/\\n/g,'<br>')+"</td></tr><tr><td>Connaissance IT</td><td>"+data.connaissanceit+"</td></tr><tr><td>Commentaires</td><td>"+data.commentaires.replace(/\\n/g,'<br>')+"</td></tr></table>\n<div id=\"buttonModifInfoAccount\">Modifier</div>\n");
			$("#buttonModifInfoAccount").button();
			$("#buttonModifInfoAccount").click( function () { $("#infoAccountContainer").toggleClass('flipped'); } );
			
//alert(data.commentaires+" ### "+data.commentaires.replace('\\n','\n'));
			$("#infoAccountRW").empty();
			$("#infoAccountRW").append("<form name='formInfoAccount' method='PUT' action='/php/processInfoCoachAccount.php'><input type='hidden' name='accountid' value='"+data.accountid+"'><table><tr><td>Raison sociale</td><td><input type='text' name='displayname' value=\""+data.displayname+"\"></td></tr><tr><td>Donn&eacute;es administratives</td><td><input type='text' name='administratif' value='"+data.administratif+"'></td></tr><tr><td>M&eacute;tier</td><td><input type='text' name='metier' value='"+data.metier+"'></td></tr><tr><td>Interlocuteur</td><td><textarea name='interlocuteur'>"+data.interlocuteur+"</textarea></td></tr><tr><td>Int&eacute;grateur</td><td><input type='text' name='integrateur' value='"+data.integrateur+"'></td></tr><tr><td>Services d&eacute;ploy&eacute;s</td><td><textarea name='services'>"+data.services.replace(/\\n/g,'\n')+"</textarea></td></tr><tr><td>Projet</td><td><input type='text' name='projet' value='"+data.projet.replace(/\\n/g,'\n')+"'></td></tr><tr><td>Connaissance IT</td><td><input type='text' name='connaissanceit' value='"+data.connaissanceit+"'></td></tr><tr><td>Commentaires</td><td><textarea name='commentaires'>"+data.commentaires.replace(/\\n/g,'\n')+"</textarea></td></tr></table>\n<div id=\"buttonValidInfoAccount\">Valider</div>\n<div id=\"buttonCancelInfoAccount\">Annuler</div>\n</form>");
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

// send data of an modified account to the database
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
				//alert("vadie");
				$("#infoAccount").toggle("blind",{"direction":"up"},function() {$("#infoAccountContainer").toggleClass('flipped');});
				ajaxCoach();
			} else {
				alert(data.result);
			}

		}
	}

	url="/php/processInfoCoachAccount.php";
	params = "accountid="+$("input:hidden[name='accountid']").val();
	params += "&displayname="+encodeURIComponent($("input:text[name='displayname']").val().replace(/"/g,"'"));
	params += "&administratif="+encodeURIComponent($("input:text[name='administratif']").val().replace(/"/g,"'"));
	params += "&metier="+encodeURIComponent($("input:text[name='metier']").val().replace(/"/g,"'"));
	params += "&interlocuteur="+encodeURIComponent($("textarea[name='interlocuteur']").val().replace(/"/g,"'"));
	params += "&integrateur="+encodeURIComponent($("input:text[name='integrateur']").val().replace(/"/g,"'"));
	params += "&services="+encodeURIComponent($("textarea[name='services']").val().replace(/"/g,"'"));
	params += "&projet="+encodeURIComponent($("input:text[name='projet']").val().replace(/"/g,"'"));
	params += "&connaissanceit="+encodeURIComponent($("input:text[name='connaissanceit']").val().replace(/"/g,"'"));
	params += "&commentaires="+encodeURIComponent($("textarea[name='commentaires']").val().replace(/"/g,"'"));

	xmlHttp.open("POST",url,true);
	
	//Send the proper header information along with the request
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//alert(params);
	xmlHttp.send(params);
}


/***** delete accounts *****/

// pop-up asking whether the user want to delete the account after change the account name of his last case (xiao)
function confirmDeleteAccountAfterModifyCase(accountid) {
	if(confirm("Il n'y a plus de dossiers li\u00E9s au compte que vous avez chang\u00E9, voulez-vous supprimer ce compte-l\u00E0 ?"))
		ajaxDeleteAccount(accountid);
}

// pop-up asking whether the user want to delete the account after delete all of his cases (xiao)
function confirmDeleteAccount(accountid) {
	if(confirm("Succ\u00E8s ! \nIl n'y a plus de dossiers li\u00E9s \u00E0 ce compte, voulez-vous supprimer ce compte-l\u00E0 ?"))
		ajaxDeleteAccount(accountid);
}

//delete this account from the database (xiao)
function ajaxDeleteAccount(accountid) {
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
		//alert (xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			//alert(data.result);
			if (data.result == "ok") {
				alert("Supprimer ce compte avec succ\u00E8s ");
			} else {
				alert(data.result);
			}
		}
	}

	
	url="/php/processAccount.php";

	params = "action=deleteaccount";
	params += "&accountid="+ accountid;
	
	xmlHttp.open("POST",url,true);
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //alert(params);
	xmlHttp.send(params);
	
}


/************** Functions used to process cases *************************/

/***** create cases *****/
//show the form "new case"
function showNewCase() {
	
	//append the form "newCase" to the top of page
	var divcoach = document.getElementById("coach");
	var divnc = document.getElementById('newCase');
	var idparent = $("#newCase").parent().get(0).id;
						
	if(idparent != "coach") {
		divnc.style.display = 'none';
	}
						
	resetNewCase();
	var divrescase = document.getElementById('resCase');
	divcoach.insertBefore(divnc,divrescase);
	
	//change the file used to process this form
	$("#formCase").attr("action","javascript:ajaxNewCase()");
	
	//change the directory where stores the uploaded files(a temporary directory named newcase_tmp)
	$("input:hidden[name='dirofPJ']").val("files/newcase_tmp");
	
	ajaxUpdatePJList();
	
	//clear selected file and hide the button 'Joindre'
	$('#selectedFile').html("");
	$('#fileToUpload').val();
	$('#addButton').css("display","none");
	
	//show the existing account names which matches the input of field "Raison sociale"
	ajaxGetAccountList();
	//$("input:text[name='accountname']").autocomplete({source:accounts});
	$("input:text[name='accountname']").autocomplete({
		source:accounts,
		select: function () {
			$("input:radio[name='casetype']").prop("disabled",false);
			$("input:radio[name='casetype']").button("refresh");
		}
    });
	
	$("#newCase").toggle("blind",{"direction":"up"});
	
	//hide all other forms
	$("#infoAccount").css("display","none");
	$("#newEvent").css("display","none");
}

//send data of new created case to the database
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
		//alert (xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			if (data.result.substring(0,2) == "ok") {
				$("#newCase").toggle("blind",{"direction":"up"});
				
				 //move the new uploaded file to the directory of new created case if exists
				//alert("length = "+$("#PJlist").children().first().children().length);
				if( $("#PJlist").children().first().children().length != 0 )	ajaxMovePJ(data.result.substring(3)); 
				ajaxCoach();
			} else {
				alert(data.result);
			}
		}
	}

	url="/php/processCase.php";

	params = "action=newcase";
	params += "&account="+coachaccount;
	params += "&vhmaccount="+coachvhmaccount;
	
	//replace all " with '
	params += "&accountname="+encodeURIComponent($("input:text[name='accountname']").val().replace(/"/g,"'"));
	
	
	params += "&coach=";
	if ($("input:radio[name='ccnomcoach']:checked").length) { params += $("input:radio[name='ccnomcoach']:checked").val(); }
//	if (coachname) { params += coachname; }
	
	params += "&caseoffer=";

	if (coachoffer != "" && coachoffer != "TOUTES") { params += coachoffer; }
	else { 
		if ($("input:radio[name='caseoffer']:checked").length) {
			params += $("input:radio[name='caseoffer']:checked").val();
		}
	}
	params += "&casetype=";
	if ($("input:radio[name='casetype']:checked").length) { params += $("input:radio[name='casetype']:checked").val(); }
	
	var packid ="";
	for(var i=0; i<dataConfig.offres.length; i++) {
		packid = "input:radio[name='casepack"+dataConfig.offres[i].offre+"']:checked";
		if($(packid).length) {
			params += "&casepackname="+$(packid).val();
		break;
		}
	}
			
//	params += "&msctfc="+$("input:text[name='msctfc']").val();
//	params += "&msctfs="+$("input:text[name='msctfs']").val();

	//replace all " with '
	params += "&amountinput="+ $("input:text[name='amountinput']").val().replace(/"/g,"'");
	
	//replace all " with '
	params += "&details="+encodeURIComponent($("input:text[name='details']").val().replace(/"/g,"'"));
	
	xmlHttp.open("POST",url,true);
	
	//Send the proper header information along with the request
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//	xmlHttp.setRequestHeader("Content-length", params.length);
//	xmlHttp.setRequestHeader("Connection", "close");
	//alert(params);
	xmlHttp.send(params);
}


/***** modify cases *****/
//show the form "modify case" (xiao)
function showModifyCase(caseid) {

 	if(caseid != "") {
		
		// append the form "newcase" to the envelop of modifying case, before all the events	
		var divcase = document.getElementById(caseid);
		var divnc = document.getElementById('newCase');
		console.log(divnc.id);
		var idparent = $("#newCase").parent().get(0).id;
		var div5 = divcase.childNodes[5];
		
		if(idparent != caseid) {
			divnc.style.display = 'none';
			divcase.insertBefore(divnc,div5);
			$("input:hidden[name='caseidNewCase']").val(caseid.substring(2));
			$("input:hidden[name='dirofPJ']").val("files/case"+caseid.substring(2));  //change the directory where stores uploaded files
		}
	} 

	caseid = parseInt(caseid.substring(2));
	ajaxShowInfoCase(caseid); 
	
	//clear selected file and hide the button 'Joindre'
	$('#selectedFile').html("");
	$('#fileToUpload').val();
	$('#addButton').css("display","none");
	
	//auto-complete the existing account names which matches the input of field "Raison sociale"
	ajaxGetAccountList();
	$("input:text[name='accountname']").autocomplete({source:accounts});
	
	//change the file used to process this form
	$("#formCase").attr("action","javascript:ajaxModifyCase("+caseid+")");
	
	$("#newCase").toggle("blind",{"direction":"up"});  
	
	//hide all other forms
	$("#infoAccount").css("display","none");
	$("#newEvent").css("display","none");
}

//get data of an existing case from the database and fill the form "modify case" (xiao)
function ajaxShowInfoCase(caseid) {
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
			//alert(data.PJFiles[0]);
			
	//resetNewCase();
	
	$("input:text[name='accountname']").val(data.accountname);
    $("input:radio[name='caseoffer'][value='"+data.offer+"']").prop("checked",true); 
	$("input:text[name='details']").val(data.details);
	$("input:radio[name='casetype']").prop("disabled",false);
	$("input:radio[name='casetype'][value='"+data.type+"']").prop("checked",true);
	
	var packid ="";
	for(var i=0; i<dataConfig.offres.length; i++) {
		packid = "#casePack" + dataConfig.offres[i].offre;
		$(packid).css("display","none");
	}
	
	if(data.type == "devis"){
		$("#amountdiv").css("display","table-row");
		$("input:text[name='amountinput']").val(data.amountineuro);
	}
	
	
	else if(data.type == "prestation"){
		console.log(data.type);
		$("#amountdiv").css("display","table-row");
		$("input:text[name='amountinput']").val(data.amountineuro);
		
		
		packid = "#casePack" + data.offer;
		$(packid).css("display","table-row");
					
		//console.log(data.packname + " lalala " +TCasePack[data.packname] );
		if(data.packname) {
			packid = "input:radio[name='casepack"+ data.offer +"'][value='"+data.packname+"']";
			$(packid).prop("checked",true);
		} 
		else $("input:radio[name='casepack"+ data.offer +"']").prop("checked",false);
		
		$("input:radio[name='casepack"+ data.offer +"']").button("refresh");
		/* if(data.offer == "FCE"){
			$("#casePackFC").css("display","table-row");
			if(data.packname)  $("input:radio[name='casepackfc'][value='"+data.packname+"']").prop("checked",true);
			else $("input:radio[name='casepackfc']").prop("checked",false);
			//$("input:text[name='amountfc']").val(data.amountineuro);
		}
		*/
		
	}
	else {
		$("#amountdiv").css("display","none");
		$("input:text[name='amountinput']").val("");
	}

	$("input:radio[name='ccnomcoach'][value='"+data.cloudcoach+"']").prop("checked",true);

	//afficher les PJ 
	var fileList = document.getElementById("PJlist");
	while(fileList.firstChild) {
		fileList.removeChild(fileList.firstChild);
	}
	
	
	var ulItem = document.createElement("ul");
	
	for(var i=0; i<data.PJFiles.length; i++) {
		
	var filedir = "files/case" + data.id; 
	var filename = data.PJFiles[i];	
	
	
	var fileItem = document.createElement("li");
	var filenamediv = document.createElement("a");
	filenamediv.innerHTML = data.PJFiles[i];
	filenamediv.setAttribute("title","T\u00E9l\u00E9charger "+ filename);
	
	filenamediv.setAttribute("href", filedir + "/" + filename);
	fileItem.appendChild(filenamediv);
	
	var deleteicone = document.createElement("img");
	deleteicone.setAttribute("src","/images/delete.gif");
	deleteicone.setAttribute("class","deleteFileIcon");
	deleteicone.setAttribute("onclick","confirmDeleteFile(\""+ filedir + "\",\""+ filename +"\",\""+ caseid +"\")");
	fileItem.appendChild(deleteicone);
	
	ulItem.appendChild(fileItem);

	}
		fileList.appendChild(ulItem);

	$("input:radio[name='caseoffer']").button("refresh");
	$("input:radio[name='ccnomcoach']").button("refresh");
	$("input:radio[name='casetype']").button("refresh");
		
		}
	}
	
	
	url="/php/getInfoCase.php";
	params = "caseid="+ caseid;

	url += "?"+params; 
//alert(params);
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
}

//set data of an modified case to the database (xiao)
function ajaxModifyCase(caseid) {
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
		//alert (xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			var responseSubstr = data.result.split("_");
			//alert(responseSubstr);
			if (responseSubstr[0] == "ok") {
				//si le accountname change
				if(responseSubstr[1]) {
					confirmDeleteAccountAfterModifyCase(responseSubstr[1]);
				}
			ajaxCoach();
			} else {
				alert(data.result);
			}
		}
	}
	
	url="/php/processCase.php";

	params = "action=modifycase";
	params += "&caseid=" +caseid;
	params += "&account="+"";
	//params += "&vhmaccount="+coachvhmaccount;
	
	//replace all " with '
	params += "&accountname="+encodeURIComponent($("input:text[name='accountname']").val().replace(/"/g,"'"));
	
	params += "&coach=";
	if ($("input:radio[name='ccnomcoach']:checked").length) { params += $("input:radio[name='ccnomcoach']:checked").val(); }
//	if (coachname) { params += coachname; }
	
	params += "&caseoffer=";
	//alert($("input:radio[name='caseoffer']:checked").length);
	if (coachoffer != "" && coachoffer != "TOUTES") { params += coachoffer; }
	else { 
		if ($("input:radio[name='caseoffer']:checked").length) {
			params += $("input:radio[name='caseoffer']:checked").val();
		}
	}
	params += "&casetype=";
	
	if ($("input:radio[name='casetype']:checked").length) { params += $("input:radio[name='casetype']:checked").val(); }
	

    var packid ="";
	for(var i=0; i<dataConfig.offres.length; i++) {
		packid = "input:radio[name='casepack"+dataConfig.offres[i].offre+"']:checked";
		if($(packid).length) {
			params += "&casepackname="+$(packid).val();
		break;
		}
	}
		
//	params += "&msctfc="+$("input:text[name='msctfc']").val();
//	params += "&msctfs="+$("input:text[name='msctfs']").val();

   //replace all " with '
	params += "&amountinput="+ $("input:text[name='amountinput']").val().replace(/"/g,"'");
	params += "&details="+encodeURIComponent($("input:text[name='details']").val().replace(/"/g,"'"));
	
	xmlHttp.open("POST",url,true);
	
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//alert(params);
	xmlHttp.send(params);
}


/***** delete cases *****/

//pop-up for confirming to delete this case (xiao)
function confirmDeleteCase(caseid){

	if(confirm('\u00CAtes vous s\u00FBr de supprimer ce dossier?')) 
		ajaxDeleteCase(caseid);
}

//delete the case from the database (xiao)
function ajaxDeleteCase(caseid) {
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
		//alert(xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			
			var isAbleToDelete = data.result.substring(0,2);
			if (isAbleToDelete == "no") {
				alert("D\u00E9sol\u00E9, vous ne pouvez pas supprimer un dossier non vide");
			}
			//delete this case with success, then delete its directory where stores its files
			else if(isAbleToDelete == "ok")	{
				dirToDelete = "files/case" + caseid;
				ajaxDeleteDir(dirToDelete);
				ajaxCoach();
				
				if(data.result == "ok_notVideAccount") {}
				else if(data.result == "ok_NoAccount") {}
				// if there are no more cases  according to this account , ask whether or not to delete this account		
				else {	
					var accountID = data.result.substring(15);
					confirmDeleteAccount(accountID);
				}
			} 
			else {
				alert(data.result);
			}
		}
	}

	//alert('ajaxDeleteCase'+caseid);

	url="/php/processCase.php";

	params = "action=deletecase";
	params += "&caseid="+caseid;
	
	xmlHttp.open("POST",url,true);
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //alert(params);
	xmlHttp.send(params);
	
}


/***** reset form *****/
//reset the form "new case" without clicking the button "Reset"
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
	if (coachoffer != "" && coachoffer != "TOUTES")   {
		$("input:radio[name='caseoffer']").val(coachoffer);
		$("#newcaseoffer").css("display","none");
	}
	else { 
		if(!caseofferchange)	$("input:radio[name='caseoffer']").prop("checked",false); 
		caseofferchange = 0;
		$("#newcaseoffer").css("display","table-row"); 
	}
	
	var offreName = "";
	var offreId = "";
	
	// hidden all the casePacks(FCE,FS...) and uncheck them 
	for(var i=0;i<dataConfig.offres.length;i++) {
		offreName = dataConfig.offres[i].offre;
		offreId = "#casePack" + offreName;
		$(offreId).css("display","none");
		offreId = "input:radio[name='casepack"+ offreName +"']";
		//alert(offreId);
		$(offreId).prop("checked",false);
		$(offreId).button("refresh");
	}
	
/* 	$("#casePackFCE").css("display","none");
	$("input:radio[name='casepackfc']").prop("checked",false);
//	$("input:text[name='msctfc']").val("");
	
	$("#casePackFS").css("display","none");
	$("input:radio[name='casepackfs']").prop("checked",false);
//	$("input:text[name='msctfs']").val("");

		
	$("#casePackFCA").css("display","none");
	$("input:radio[name='casepackfca']").prop("checked",false); */

	//montant block
	$("#amountdiv").css("display","none");
	$("input:text[name='amountinput']").val("");
	
	if (coachname != "" && coachname != "TOUS" && coachname != "AUCUN") { 
		$("input:radio[name='ccnomcoach'][value='"+coachname+"']").prop("checked",true);
	} else {
		$("input:radio[name='ccnomcoach']").prop("checked",false);
	}
	$("input:text[name='details']").val("");
	
	$("input:radio[name='caseoffer']").button("refresh");
	$("input:radio[name='ccnomcoach']").button("refresh");
	$("input:radio[name='casetype']").button("refresh");
	
	//clear selected file and hide the button 'Joindre'
	$('#selectedFile').html("");
	$('#fileToUpload').val();
	$('#addButton').css("display","none");
	
	//auto-complete the existing account names which matches the input of field "Raison sociale"
	ajaxGetAccountList();
	$("input:text[name='accountname']").autocomplete({source:accounts});
	
}

//reset the form "new case" when click the button "Reset" (xiao)
function resetNewCasebyButton() {
	//delete files uploaded if they exist
	if( $("#PJlist").children().first().children().length != 0)	{
		var idparent = $("#newCase").parent().get(0).id;
		if(idparent == "coach")	ajaxDeleteDir("files/newcase_tmp");   //newCase
		else ajaxDeleteDir("files/case"+idparent.substring(2));     //modifycase
	}	
	resetNewCase();
}


//show or hide all the events of one case
function showCoachCase(caseid) {
	$("#"+caseid+">.coachevent").toggle("blind",{"direction":"up"});
}


/************** Functions used to process events *************************/

/***** create events *****/
//show the form "new event"
function showNewEvent(caseid) {
	
	//append the form "new event" to the envelop of one case, before all events
	var divcase = document.getElementById(caseid);
	var divnewevent = document.getElementById('newEvent');
	var idparent = $("#newEvent").parent().get(0).id;
	var div5 = divcase.childNodes[5];

	if (idparent != caseid) {
		divnewevent.style.display = 'none';
		divcase.insertBefore(divnewevent,div5);
		$("input:hidden[name='caseid']").val(caseid.substring(2));
	}
	
	$("#buttonCEReset").attr("onclick","resetNewEvent("+true+")");
	
	//change the file used to process the form after submitting
	$("#formEvent").attr("action","javascript:ajaxNewEvent()");
	
	resetNewEvent(true);
	getOrigname();
	$("#newEvent").toggle("blind",{"direction":"up"});
	
	//hide all other forms
	$("#infoAccount").css("display","none");
	$("#newCase").css("display","none");
}

//send data of new created event to the database
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
	params += "&eventdate="+$("input:text[name='eventdate']").val().replace(/"/g," ");
	params += "&origrole=";
	if ($("input:radio[name='origrole']:checked").length) { params += $("input:radio[name='origrole']:checked").val(); }
	params += "&origname="+encodeURIComponent($("input:text[name='origname']").val().replace(/"/g,"'"));
	params += "&medium=";
	if ($("input:radio[name='medium']:checked").length) { params += $("input:radio[name='medium']:checked").val(); }
	params += "&msctid="+$("input:text[name='msctid']").val().replace(/"/g,"'");
	params += "&eventtype=";
	if ($("input:radio[name='eventtype']:checked").length) { params += $("input:radio[name='eventtype']:checked").val(); }
	params += "&details="+encodeURIComponent($("textarea[name='cedetails']").val().replace(/"/g,"'"));
	params += "&cenomcoach=";
	if ($("input:radio[name='cenomcoach']:checked").length) { params += $("input:radio[name='cenomcoach']:checked").val(); }
	params += "&newcasestatus=";
	if ($("input:radio[name='newcasestatus']:checked").length) { params += $("input:radio[name='newcasestatus']:checked").val(); }
	params += "&datesuspended="+encodeURIComponent($("input:text[name='datesuspended']").val().replace(/"/g," "));
	params += "&passedtime="+encodeURIComponent($("input:text[name='passedtime']").val().replace(/"/g," "));
	params += "&casedetails="+encodeURIComponent($("input:text[name='casedetails']").val().replace(/"/g,"'"));
	
	xmlHttp.open("POST",url,true);
	
	//Send the proper header information along with the request
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//	xmlHttp.setRequestHeader("Content-length", params.length);
//	xmlHttp.setRequestHeader("Connection", "close");
//  alert(params);
	xmlHttp.send(params);
}


/***** modify events *****/
//show the form "modify event" (xiao)
function showModifyEvent(currentEventId,caseid) {
	
	//append the form to the envelop of an event
	if(currentEventId != "") {
		var divCurrentevent = document.getElementById(currentEventId);
		var divne = document.getElementById('newEvent');
		var idparent = $("#newEvent").parent().get(0).id;
		var div5 = divCurrentevent.childNodes[5];
		
		if(idparent != currentEventId) {
			divne.style.display = 'none';
			divCurrentevent.insertBefore(divne,div5);
			//$("input:hidden[name='caseid']").val(caseid.substring(2));
		}
	} 
	
	$("#buttonCEReset").attr("onclick","resetNewEvent("+false+")");
	
	//change the file used to process the form after submitting
	$("#formEvent").attr("action","javascript:ajaxModifyEvent("+currentEventId+","+caseid+")");
	
	ajaxShowInfoEvent(currentEventId);
	$("#newEvent").toggle("blind",{"direction":"up"});  
	
	//hide all other forms
	$("#infoAccount").css("display","none");
	$("#newCase").css("display","none");
}

//get data of an existing case from the database and fill the form "modify case" (xiao)
function ajaxShowInfoEvent(eventid) {
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
			
			$("input:text[name='eventdate']").val(data.date);
			$("input:radio[name='medium'][value="+data.medium+"]").prop("checked",true);
			$("textarea[name='cedetails']").val(data.details);
			$("input:radio[name='origrole'][value="+data.origrole+"]").prop("checked",true);
			
			if(data.origrole == "cloudcoach"){
				$("#origname").css("display","none");
			}
			else {
				$("#origname").css("display","block");
				$("input:text[name='origname']").val(data.origname);
			}
				
			updateEventType();
			$("input:radio[name='eventtype'][value="+data.type+"]").prop("checked",true);
		
			$("#datesuspended").css("display","none");
			$("input:text[name='datesuspended']").val("");
		
			$("#cecoachincharge").css("display","none");
			$("#buttonNewCaseStatusTR").css("display","none");
			$("#casedetailsTR").css("display","none");
				
			if($("input:radio[name='medium']:checked").val() == "portail") {
				$("#cemsctid").css("display","table-row");
				$("input:text[name='msctid']").val(""); 
			}
			else	$("#cemsctid").css("display","none");
			
			
			$("input:text[name='passedtime']").val("");
			$("#eventtimepassed").css("display","none");
			//if ($("#typepacktime"+idcase).length) { $("#eventtimepassed").css("display","table-row"); } else { $("#eventtimepassed").css("display","none"); }
	
			
			$("input:radio[name='origrole']").button( "refresh");
			$("input:radio[name='medium']").button( "refresh");
		//	$("input:radio[name='eventtype']").button( "refresh");
		
		}
	}

	url="/php/getInfoEvent.php";
	params = "eventid=" + eventid;

	url += "?"+params; 
	//alert(url);
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
}

//set data of an modified event to the database (xiao)
function ajaxModifyEvent(eventid,caseid) {
	
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
		//alert (xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			if (data.result == "ok") {
				ajaxCoach();
			} else {
				alert(data.result);
			}
		}
	}
	
	url="/php/processCase.php";

	params = "action=modifyevent";
	params += "&eventid=" + eventid;
	params += "&eventdate=" + $("input:text[name='eventdate']").val().replace(/"/g," ");
	params += "&caseid=" + caseid;
	params += "&origrole=" + $("input:radio[name='origrole']:checked").val();
	params += "&origname=" + encodeURIComponent($("input:text[name='origname']").val().replace(/"/g,"'"));
	params += "&medium=" + $("input:radio[name='medium']:checked").val();
	params += "&eventtype=" + $("input:radio[name='eventtype']:checked").val();
	params += "&details="+ encodeURIComponent($("textarea[name='cedetails']").val().replace(/"/g,"'"));
	params += "&msctid="+encodeURIComponent($("input:text[name='msctid']").val().replace(/"/g,"'"));
	
	xmlHttp.open("POST",url,true);
	
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	//alert(params);
	xmlHttp.send(params);
}


/***** delete events *****/
//pop-up for confirming to delete this event (xiao)
function confirmDeleteEvent(eventid,caseid){
	if(confirm("\u00CAtes vous s\u00FBr de supprimer cet événement?"))
		ajaxDeleteEvent(eventid,caseid);
}

//delete this event from the database (xiao)
function ajaxDeleteEvent(eventid,caseid) {
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
		//alert (xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			if (data.result == "ok") {
				ajaxCoach();
			} else {
				alert(data.result);
			}
		}
	}

	url="/php/processCase.php";

	params = "action=deleteevent";
	params += "&eventid="+ eventid;
	params += "&caseid=" + caseid;
	
	xmlHttp.open("POST",url,true);
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //alert(params);
	xmlHttp.send(params);
}



//reset the form "new event"
function resetNewEvent(isNewEvent) {
	
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
	
	if(isNewEvent) {
	
		$("#cecoachincharge").css("display","table-row");
		$("#buttonNewCaseStatusTR").css("display","table-row");
		$("#casedetailsTR").css("display","table-row");
		
		if (coachincharge != "") {
			$("input:radio[name='cenomcoach'][value='"+coachincharge+"']").prop("checked",true);
		} else {
			$("input:radio[name='cenomcoach']").prop("checked",false);
		}
		
		if (casestatus != "") {
	//	alert("#"+casestatus+"#");
			$("input:radio[name='newcasestatus'][value='"+casestatus+"']").prop("checked",true);
			
			if($("input:radio[name='newcasestatus'][value='"+casestatus+"']").val() == "SUSPENDU") {
				
				$("#datesuspended").css("display","table-row");
				$("input:text[name='datesuspended']").val("");
			}
		} else {
			$("input:radio[name='newcasestatus']").prop("checked",false);
		}
		$("input:text[name='casedetails']").val(casedetails);
	}
	
	else{
		$("#cecoachincharge").css("display","none");
		$("#buttonNewCaseStatusTR").css("display","none");
		$("#casedetailsTR").css("display","none");
	}
	
	$("#origname").css("display","none");
	$("input:text[name='origname']").val("");
	$("input:radio[name='medium']").prop("checked",false);
	$("input:radio[name='eventtype']").prop("checked",false);
	$("input:radio[name='eventtype']").prop("disabled",true);
	$("textarea[name='cedetails']").val("");
	
	$("#cemsctid").css("display","none");
	$("input:text[name='msctid']").val(casepackid);
	
	$("input:text[name='passedtime']").val("");
	$("#eventtimepassed").css("display","none");

	
	$("input:radio[name='origrole']").button( "refresh");
	$("input:radio[name='cenomcoach']").button( "refresh");
	$("input:radio[name='medium']").button( "refresh");
//	$("input:radio[name='eventtype']").button( "refresh");
	$("input:radio[name='newcasestatus']").button( "refresh");
}


/************** Functions used to process uploaded files *************************/

//move unloaded file to the directory of one case (xiao)
function ajaxMovePJ(caseid) {
	//alert("ajaxMovePJ");
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
		//alert (xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			if (data.result == "ok") {		
				//alert("Upload Successful");
			} else {
				alert(data.result);
			}
		}
	}
	
	url = "/php/processFile.php";
	params = "action=moveFile";
	params += "&caseid=" + caseid;
	xmlHttp.open("POST",url,true);
	
	//Send the proper header information along with the request
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//	xmlHttp.setRequestHeader("Content-length", params.length);
//	xmlHttp.setRequestHeader("Connection", "close");
	//alert(params);
	xmlHttp.send(params);
	
}

//delete an uploaded file of one case (xiao)
function ajaxDeleteFile(fdir,fname,caseid){
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
		//alert (xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			if (data.result == "ok") {
				ajaxUpdatePJList();
			} else {
				alert(data.result);
			}
		}
	}
		url="/php/processFile.php";
		params = "action=deleteFile"; 
		params += "&filedir=" + fdir;
		params += "&filename=" + fname;
		xmlHttp.open("POST",url,true);
		
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//alert(params);
		xmlHttp.send(params);
		
	
}

//update the list of unloaded files (xiao)
function ajaxUpdatePJList() {
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
		//alert (xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			if (data.result == "ok") {
				
				var fileList = document.getElementById("PJlist");
				while(fileList.firstChild) {
					fileList.removeChild(fileList.firstChild);
				}
				
				var ulItem = document.createElement("ul");
				
				if(idparent == "coach") {
				//show files in dir newcase_tmp
					var filedir = "files/newcase_tmp"; 
				}
				else {
					var filedir = "files/case" + idparent.substring(2); 
				}
				
				for(var i=0; i<data.PJFiles.length; i++) {
					
					var filename = data.PJFiles[i];	
								
					var fileItem = document.createElement("li");
					var filenamediv = document.createElement("a");
					filenamediv.innerHTML = data.PJFiles[i];
					filenamediv.setAttribute("title","T\u00E9l\u00E9charger "+ filename);
					
					filenamediv.setAttribute("href", filedir + "/" + filename);
					fileItem.appendChild(filenamediv);
					
					
					var deleteicone = document.createElement("img");
					deleteicone.setAttribute("src","/images/delete.gif");
					deleteicone.setAttribute("class","deleteFileIcon");
					deleteicone.setAttribute("title","Supprimer "+ filename);
					deleteicone.style.marginLeft = '10px';					
					deleteicone.style.width = '10px';					
					
					deleteicone.setAttribute("onclick","confirmDeleteFile(\""+ filedir + "\",\""+ filename +"\",\""+ idparent.substring(2) +"\")");
					fileItem.appendChild(deleteicone);
					
					ulItem.appendChild(fileItem);
					
				}
					fileList.appendChild(ulItem);

				//clear selected file and hide the button 'Joindre'
					$('#selectedFile').html("");
					$('#fileToUpload').val();
					$('#addButton').css("display","none");
				} else {
				alert(data.result);
			}
		}
	}
	
	url = "/php/processFile.php";
	params = "";
	
	var divnc = document.getElementById('newCase');
	var idparent = $("#newCase").parent().get(0).id;
	
	//in the case of creating case
	if(idparent == "coach") {
		params += "action=updateInNewCase";
	}
	//in the case of modifying case
	else {
		params += "action=updateInModifyCase"; 
		params += "&caseid="+idparent.substring(2);
	}
	
	xmlHttp.open("POST",url,true);
	
	//Send the proper header information along with the request
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//	xmlHttp.setRequestHeader("Content-length", params.length);
//	xmlHttp.setRequestHeader("Connection", "close");
	//alert(params);
	xmlHttp.send(params);
}

//pop-up for confirming to delete this file (xiao)
function confirmDeleteFile(fdir,fname,caseid) {
	if(confirm("\u00CAtes vous s\u00FBr de supprimer ce fichier?")) 
		ajaxDeleteFile(fdir,fname,caseid);
}

//delete an directory in the server (xiao)
function ajaxDeleteDir(dir) {
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
		//alert (xmlHttp.responseText);
			data = eval("("+xmlHttp.responseText+")");
			//alert(data.result);
			if (data.result == "ok") {
				//alert("Delete the directory");
				$("#PJlist").empty();
				// if(data.dirdeleted == "newcase_tmp" )	{
					
				// }
			}
			else if(data.result == "not Exist") {
				
			} else {
				alert(data.result);
			}
		}
	}

	url="/php/processFile.php";

	params = "action=deleteDir";
	params += "&dirname="+dir;
	
	xmlHttp.open("POST",url,true);
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //alert(params);
	xmlHttp.send(params);
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


/* get the list of account names, used to auto-complete the account name (xiao) */
//*attention: this function must be synchronous, because the variable accounts must be assigned 
// by this function first then be used by the function which calls this function
function ajaxGetAccountList () {
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
		
	url="/php/getAccountList.php";
	params = "";

	xmlHttp.open("POST",url,false);
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //alert(params);
	xmlHttp.send(params);
	
	if(xmlHttp.status == 200) {
		data = eval("("+xmlHttp.responseText+")");
			accounts = data.result;
	}
	
}

</script>
