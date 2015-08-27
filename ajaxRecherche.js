
<script type="text/javascript">

var mois = ["","Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
var jour = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

function ajaxRecherche(event,param) {
var xmlHttp,data,resAccount,resUser,resVDC,resVM,resteAff,urlCible;
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
	data = eval("("+xmlHttp.responseText+")");
	document.getElementById('nbAccount').innerHTML = data.nbAccount;
	document.getElementById('nbUser').innerHTML    = data.nbUser;
	document.getElementById('nbVDC').innerHTML     = data.nbVDC;
	document.getElementById('nbVM').innerHTML      = data.nbVM;
	
	urlCible = "";
	if (data.account.length > 0)   { urlCible = "/php/account3d.php?account="+data.account[0].id; }
	else if (data.user.length > 0) { urlCible = "/php/account3d.php?user="+data.user[0].id; }
	else if (data.vdc.length > 0)  { urlCible = "/php/account3d.php?vdc="+data.vdc[0].id; }
	else if (data.vm.length > 0)   { urlCible = "/php/account3d.php?vm="+data.vm[0].id; }
 	document.getElementById('filter').urlCible     = urlCible;
	
	resAccount = document.getElementById('resAccount');
	while (resAccount.hasChildNodes()) {
	  resAccount.removeChild(resAccount.firstChild);
	}

	for (var j=0; j<data.account.length; j++) {
	  row = document.createElement("tr");
	  row.setAttribute("onclick","window.open('/php/account3d.php?account="+data.account[j].id+"')");
	  cell = document.createElement("td");
	  texte = document.createTextNode(data.account[j].nm);
	  cell.appendChild(texte);
	  row.appendChild(cell);
	  cell = document.createElement("td");
	  texte = document.createTextNode(data.account[j].dnm);
	  cell.appendChild(texte);
	  row.appendChild(cell);
	  resAccount.appendChild(row);
	}
	resteAff = data.nbAccount - data.account.length;
	if (resteAff > 0) { document.getElementById('moreAccounts').innerHTML = resteAff+" éléments non affichés"; } else { document.getElementById('moreAccounts').innerHTML = ""; }

	resUser = document.getElementById('resUser');
	while (resUser.hasChildNodes()) {
	  resUser.removeChild(resUser.firstChild);
	}
	for (var j=0; j<data.user.length; j++) {
	  row = document.createElement("tr");
	  row.setAttribute("onclick","window.open('/php/account3d.php?user="+data.user[j].id+"')");
	  cell = document.createElement("td");
	  texte = document.createTextNode(data.user[j].fn);
	  cell.appendChild(texte);
	  row.appendChild(cell);
	  cell = document.createElement("td");
	  texte = document.createTextNode(data.user[j].ln);
	  cell.appendChild(texte);
	  row.appendChild(cell);
	  cell = document.createElement("td"); 
	  texte = document.createTextNode(data.user[j].login);
	  cell.appendChild(texte);
	  row.appendChild(cell);
	  cell = document.createElement("td"); 
	  texte = document.createTextNode(data.user[j].email);
	  cell.appendChild(texte);
	  row.appendChild(cell);
	  resUser.appendChild(row);
	}
	resteAff = data.nbUser - data.user.length;
	if (resteAff > 0) { document.getElementById('moreUsers').innerHTML = resteAff+" éléments non affichés"; } else { document.getElementById('moreUsers').innerHTML = ""; }

	resVDC = document.getElementById('resVDC');
	while (resVDC.hasChildNodes()) {
	  resVDC.removeChild(resVDC.firstChild);
	}
	for (var j=0; j<data.vdc.length; j++) {
	  row = document.createElement("tr");
	  row.setAttribute("onclick","window.open('/php/account3d.php?vdc="+data.vdc[j].id+"')");
	  cell = document.createElement("td");
	  texte = document.createTextNode(data.vdc[j].vn);
	  cell.appendChild(texte);
	  row.appendChild(cell);
	  cell = document.createElement("td");
	  texte = document.createTextNode(data.vdc[j].an);
	  cell.setAttribute("style","font-style: italic");
	  cell.appendChild(texte);
	  row.appendChild(cell);
	  resVDC.appendChild(row);
	}
	resteAff = data.nbVDC - data.vdc.length;
	if (resteAff > 0) { document.getElementById('moreVDC').innerHTML = resteAff+" éléments non affichés"; } else { document.getElementById('moreVDC').innerHTML = ""; }


	resVM = document.getElementById('resVM');
	while (resVM.hasChildNodes()) {
	  resVM.removeChild(resVM.firstChild);
	}
	for (var j=0; j<data.vm.length; j++) {
	  row = document.createElement("tr");
	  row.setAttribute("onclick","window.open('/php/account3d.php?vm="+data.vm[j].id+"')");
	  cell = document.createElement("td");
	  texte = document.createTextNode(data.vm[j].vn);
	  cell.appendChild(texte);
	  row.appendChild(cell);
	  cell = document.createElement("td");
	  texte = document.createTextNode(data.vm[j].ln);
	  cell.appendChild(texte);
	  row.appendChild(cell);
	  cell = document.createElement("td");
	  texte = document.createTextNode(data.vm[j].de);
	  cell.appendChild(texte);
	  row.appendChild(cell);
	  cell = document.createElement("td");
	  texte = document.createTextNode(data.vm[j].an);
	  cell.setAttribute("style","font-style: italic");
	  cell.appendChild(texte);
	  row.appendChild(cell);
	  resVM.appendChild(row);
	}
	resteAff = data.nbVM - data.vm.length;
	if (resteAff > 0) { document.getElementById('moreVM').innerHTML = resteAff+" éléments non affichés"; } else { document.getElementById('moreVM').innerHTML = ""; }
    }

  }
//  alert(event.keyIdentifier);
  if (event.keyCode == 13 && document.getElementById('filter').urlCible) {
	window.open(document.getElementById('filter').urlCible);
  } else {
	url="/php/chercher.php?filter="+param;
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
  }
}


function urlAccount() {
  var url;
  if (document.getElementById('nbAccount').innerHTML == 0) {
    return "";
  }
  url = "/php/account.php?filtre=" + document.getElementById('filter').value;
  //window.location.replace(url);
  location.href = url;
}

function urlUser() {
  var url;
  if (document.getElementById('nbUser').innerHTML == 0) {
    return "";
  }
  url = "/php/user.php?filtre=" + document.getElementById('filter').value;
  location.href = url;
}

function urlVDC() {
  var url;
  if (document.getElementById('nbVDC').innerHTML == 0) {
    return "";
  }
  url = "/php/vdc.php?filtre=" + document.getElementById('filter').value;
  location.href = url;
}

function urlVM() {
  var url;
  if (document.getElementById('nbVM').innerHTML == 0) {
    return "";
  }
  url = "/php/vm.php?filtre=" + document.getElementById('filter').value;
  location.href = url;
}


function ajaxRating(param) {
	var xmlHttp,data,libelle;

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
			data = eval("("+xmlHttp.responseText+")");
			//alert(xmlHttp.responseText);
			
			divrating = document.getElementById('contentsrating');
			while (divrating.hasChildNodes()) {
				divrating.removeChild(divrating.firstChild);
			}
			for (var j=0; j<data.length; j++) {
				rating = data[j];
				if (rating[0] == "rule") {
					div = document.createElement("div");
					div.setAttribute("class","ratingrule");
					img = document.createElement("img");
					img.setAttribute("src","/images/impact"+rating[6]+".gif");
					img.setAttribute("style","height:16px;padding-right:10px");
					div.appendChild(img);
					img = document.createElement("img");
					img.setAttribute("src","/images/gravity"+rating[3]+".gif");
					img.setAttribute("style","height:16px;padding-right:10px");
					div.appendChild(img);
					texterule = rating[4];
					if (rating[5] != '') { texterule += ": "+rating[5]; }
					if (rating[1] == "account") { pere = rating[1]+rating[2]; }
					else if (rating[1] == "user") { pere = rating[1]+rating[2]; }
					else if (rating[1] == "ordering") { pere = rating[1]+rating[2]; }
					else if (rating[1] == "vsa") { pere = rating[1]+rating[2]; }
					else if (rating[1] == "fw")  { pere = "sec"+rating[2]; texterule = "[FW] "+texterule; }
					else if (rating[1] == "lb")  { pere = "sec"+rating[2]; texterule = "[LB] "+texterule; }
					else if (rating[1] == "vdc") { pere = rating[1]+"self"+rating[2]; }
					else if (rating[1] == "vm")  { pere = rating[1]+rating[2]; }
					texte = document.createTextNode(texterule);
					div.appendChild(texte);					
					document.getElementById(pere).appendChild(div);
				} else {
					div = document.createElement("div");
					div.setAttribute("class","rating"+rating[0]);
					/*
					if (rating[0] == "account") { pere = "contentsrating"; libelle = "Compte"+" "+rating[2]; }
					else if (rating[0] == "ordering") { pere = "account"+rating[3]; libelle = "Contrat"+" "+rating[2]; }
					else if (rating[0] == "vsa") { pere = "ordering"+rating[3]; libelle = "VSA"+" "+rating[2]; }
					else if (rating[0] == "sec") { pere = "ordering"+rating[3]; libelle = "Sécurité"; }
					else if (rating[0] == "vdc") { pere = "ordering"+rating[3]; libelle = "VDC"+" "+rating[2]; }
					else if (rating[0] == "vm")  { pere = "vdc"+rating[3]; libelle = "Serveurs virtuels"; }
					*/
					if (rating[0] == "account") { pere = "contentsrating"; libelle = "Compte "; }
					else if (rating[0] == "user") { pere = "account"+rating[3]; libelle = "Utilisateurs "; }
					else if (rating[0] == "ordering") { pere = "account"+rating[3]; libelle = "Contrat "; }
					else if (rating[0] == "vsa") { pere = "ordering"+rating[3]; libelle = "VSA "; }
					else if (rating[0] == "sec") { pere = "ordering"+rating[3]; libelle = "Sécurité "; }
					else if (rating[0] == "vdc") { pere = "ordering"+rating[3]; libelle = "VDC "; }
					else if (rating[0] == "vm")  { pere = "vdc"+rating[3]; libelle = "Serveurs virtuels "; }
					//else alert(rating[0]);
					texte = document.createTextNode(rating[2]);
					span = document.createElement("span");
					span.setAttribute("class","bold");
					span.appendChild(texte);
					texte = document.createTextNode(libelle);
					div.appendChild(texte);
					div.appendChild(span);
				//alert(pere);
					document.getElementById(pere).appendChild(div);
					if (rating[0] != "account") {
						div = document.createElement("div");
						div.setAttribute("class","ratingcurmax");
						texte = document.createTextNode(rating[5]+" / "+rating[4]);
						div.appendChild(texte);
						document.getElementById(pere).appendChild(div);
					}
					div = document.createElement("div");
					if (rating[0] == "vm")  { div.setAttribute("id",rating[0]+rating[3]); }
					else { div.setAttribute("id",rating[0]+rating[1]); }
					div.setAttribute("class","clearboth");
					document.getElementById(pere).appendChild(div);
					if (rating[0] == "vdc")  {
						div = document.createElement("div");
						div.setAttribute("id",rating[0]+"self"+rating[1]);
						document.getElementById(rating[0]+rating[1]).appendChild(div);
					}
				}
			}
		}
	}
	url="/php/rating.php?account="+param;
	//alert(url);
	xmlHttp.open("GET",url,true);
	xmlHttp.send(null);
	document.getElementById("rating").setAttribute("style","display:block");
}


function ajaxLog(type,id) {
	var xmlHttp,data;
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

		divlog = document.getElementById('bodylog');
		while (divlog.hasChildNodes()) {
			divlog.removeChild(divlog.firstChild);
		}
		anneePrec = 0;
		moisPrec  = 0;
		jourPrec  = 0;
		for (var j=0; j<data.length; j++) {
			log = data[j];
			dateCour = log[0].split("-");
			dateCour[1] = parseInt(dateCour[1]);  // pour conversion en valeur numérique
			dateCour[2] = parseInt(dateCour[2]);  // pour conversion en valeur numérique
			if (dateCour[0] != anneePrec || dateCour[1] != moisPrec) {
				if (anneePrec > 0) { table.appendChild(tbody); divlog.appendChild(table); }
				div = document.createElement("div");
				div.setAttribute("class","moislog");
				texte = document.createTextNode(mois[dateCour[1]]+" "+dateCour[0]);
				div.appendChild(texte);
				divlog.appendChild(div);
				jourPrec = 0;
			}
			if (dateCour[2] != jourPrec) {
				if (jourPrec > 0) { table.appendChild(tbody); divlog.appendChild(table); }
				d = new Date(dateCour);
				div = document.createElement("div");
				div.setAttribute("class","jourlog");
				texte = document.createTextNode(jour[d.getDay()]+" "+dateCour[2]+" "+mois[dateCour[1]]);
				div.appendChild(texte);
				divlog.appendChild(div);
				table = document.createElement("table");
				table.setAttribute("class","order-table table");
				colgroup = document.createElement("colgroup");
				col = document.createElement("col");
				col.setAttribute("width","60px"); colgroup.appendChild(col);
				col = document.createElement("col");
				col.setAttribute("width","20px"); colgroup.appendChild(col);
				col = document.createElement("col");
				col.setAttribute("width","150px"); colgroup.appendChild(col);
				col = document.createElement("col");
				col.setAttribute("width","230px"); colgroup.appendChild(col);
				col = document.createElement("col");
				col.setAttribute("width","220px"); colgroup.appendChild(col);
				col = document.createElement("col");
				col.setAttribute("width","70px"); colgroup.appendChild(col);
				col = document.createElement("col");
				col.setAttribute("width","50px"); colgroup.appendChild(col);
				col = document.createElement("col");
				col.setAttribute("width","300px"); colgroup.appendChild(col);
				table.appendChild(colgroup);
				tbody = document.createElement("tbody");
			}
			row = document.createElement("tr");
			cell = document.createElement("td");
			texte = document.createTextNode(log[1]);
			cell.appendChild(texte);
			row.appendChild(cell);
			cell = document.createElement("td");
			if (log[2] == "HOSTING") { objet = document.createElement("img"); objet.setAttribute("src","/images/hosting.gif"); objet.setAttribute("style","padding-bottom: 0; vertical-align: bottom"); } else { objet = document.createTextNode(""); }
			cell.appendChild(objet);
			row.appendChild(cell);
			cell = document.createElement("td"); 
			texte = document.createTextNode(log[3]);
			cell.appendChild(texte);
			row.appendChild(cell);
			cell = document.createElement("td"); 
			texte = document.createTextNode(log[4]);
			cell.appendChild(texte);
			row.appendChild(cell);
			if (log[4]) { row.setAttribute("class","logvco"); } else { row.setAttribute("class","loghtml"); }
			cell = document.createElement("td");
//			if (type != "vm") {
				txt = log[5].replace(/\(fce.*\)$/, "");
				texte = document.createTextNode(txt);
				cell.appendChild(texte);
				row.appendChild(cell);
//			}
			cell = document.createElement("td"); 
			texte = document.createTextNode(log[6]);
			if (log[6] != "Success" && log[6] != "") {
				span = document.createElement("span");
				span.setAttribute("style","background:red; padding-left:5px; padding-right:5px; margin: 0; height:100%; color: white");
				span.appendChild(texte);
				//if (log[9]) { span.setAttribute("title",log[9]); }
				cell.appendChild(span);
			} else {
				cell.appendChild(texte);
			}
			cell.setAttribute("style","text-align:center");
			row.appendChild(cell);
			cell = document.createElement("td"); 
			texte = document.createTextNode(log[7]);
			cell.appendChild(texte);
			cell.setAttribute("style","text-align:right");
			row.appendChild(cell);
			cell = document.createElement("td");
			if (log[8]) {
				texte = document.createTextNode(log[8]);
				span = document.createElement("span");
				span.setAttribute("style","background:red; padding-left:5px; padding-right:5px; margin: 0; height:100%; color: white");
				span.appendChild(texte);
				if (log[9]) { span.setAttribute("title",log[9]); }
				cell.appendChild(span);
				cell.setAttribute("style","text-align:center");
			}
			row.appendChild(cell);
			tbody.appendChild(row);
			anneePrec = dateCour[0];
			moisPrec  = dateCour[1];
			jourPrec  = dateCour[2];
		}
		if (anneePrec > 0) { table.appendChild(tbody); divlog.appendChild(table); }
    }
  }
  url="/php/logs.php?type="+type+"&id="+id;
  xmlHttp.open("GET",url,true);
  xmlHttp.send(null);
}


function ajaxChange(account) {
	var xmlHttp,data;
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
		divchange = document.getElementById('bodychange');
		while (divchange.hasChildNodes()) {
			divchange.removeChild(divchange.firstChild);
		}
		anneePrec = 0;
		moisPrec  = 0;
		jourPrec  = 0;
		for (var j=0; j<data.length; j++) {
			log = data[j];
			dateCour = log[0].split("-");
			dateCour[1] = parseInt(dateCour[1]);  // pour conversion en valeur numérique
			dateCour[2] = parseInt(dateCour[2]);  // pour conversion en valeur numérique
			if (dateCour[0] != anneePrec || dateCour[1] != moisPrec) {
				if (anneePrec > 0) { table.appendChild(tbody); divchange.appendChild(table); }
				div = document.createElement("div");
				div.setAttribute("class","moislog");
				texte = document.createTextNode(mois[dateCour[1]]+" "+dateCour[0]);
				div.appendChild(texte);
				divchange.appendChild(div);
				jourPrec = 0;
			}
			if (dateCour[2] != jourPrec) {
				if (jourPrec > 0) { table.appendChild(tbody); divchange.appendChild(table); }
				d = new Date(dateCour);
				div = document.createElement("div");
				div.setAttribute("class","jourlog");
				texte = document.createTextNode(jour[d.getDay()]+" "+dateCour[2]+" "+mois[dateCour[1]]);
				div.appendChild(texte);
				divchange.appendChild(div);
				table = document.createElement("table");
				table.setAttribute("class","order-table table");
				colgroup = document.createElement("colgroup");
				col = document.createElement("col");
				col.setAttribute("width","120px"); colgroup.appendChild(col);
				col = document.createElement("col");
				col.setAttribute("width","150px"); colgroup.appendChild(col);
				col = document.createElement("col");
				col.setAttribute("width","180px"); colgroup.appendChild(col);
				col = document.createElement("col");
				col.setAttribute("width","140px"); colgroup.appendChild(col);
				table.appendChild(colgroup);
				tbody = document.createElement("tbody");
			}
			row = document.createElement("tr");
			cell = document.createElement("td");
			texte = document.createTextNode(log[1]);
			cell.appendChild(texte);
			row.appendChild(cell);
			cell = document.createElement("td");
			texte = document.createTextNode(log[2]);
			cell.appendChild(texte);
			row.appendChild(cell);
			cell = document.createElement("td"); 
			texte = document.createTextNode(log[3]);
			cell.appendChild(texte);
			row.appendChild(cell);
			cell = document.createElement("td"); 
			texte = document.createTextNode(log[4]);
			cell.appendChild(texte);
			row.appendChild(cell);
			tbody.appendChild(row);
			anneePrec = dateCour[0];
			moisPrec  = dateCour[1];
			jourPrec  = dateCour[2];
		}
		if (anneePrec > 0) { table.appendChild(tbody); divchange.appendChild(table); }
    }
  }
  url="/php/changes.php?account="+account;
  xmlHttp.open("GET",url,true);
  xmlHttp.send(null);
}


var chart1;
//chart1 = new cfx.Chart();

function ajaxLogStats(param) {
	var xmlHttp,data;
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
			data = eval("("+xmlHttp.responseText+")");

			/* !!! A REVOIR => Pas besoin de faire le ménage, mais plutôt n'invoquer le webservice que si divstats n'a pas d'enfant 
			divstats = document.getElementById('bodystats');
			while (divstats.hasChildNodes()) {
				divstats.removeChild(divstats.firstChild);
			}*/
			chart1 = new cfx.Chart();
			chart1.setGallery(cfx.Gallery.Bar);
			chart1.getAllSeries().setStacked(cfx.Stacked.Normal);
			chart1.setDataSource(data);
			var titles = chart1.getTitles();
			var title = new cfx.TitleDockable();
			title.setText("Logs VHM client par type");
			titles.add(title);
			chart1.getAxisX().getLabelsFormat().setFormat(cfx.AxisFormat.Date);
			chart1.getAxisX().getLabelsFormat().setCustomFormat(";MMM-dd");
			chart1.getAxisX().getTitle().setText("Date");
			chart1.getAxisY().getTitle().setText("Nombre d'occurences");
			chart1.getAxisX().setLabelAngle(45);
			//chart1.getAxisX().setAutoScroll(true);
			//chart1.getAxisX().setClientScroll(true);
			//chart1.getAxisX().setScrollView(10,20);
			chart1.getSeries().getItem(0).setText("Consultation");
			chart1.getSeries().getItem(1).setText("Ajout");
			chart1.getSeries().getItem(2).setText("Modification");
			chart1.getSeries().getItem(3).setText("Destruction");
			//chart1.getAxisY().getLabelsFormat().setFormat(cfx.AxisFormat.Currency);
			var divHolder = document.getElementById('ChartLog');
			chart1.create(divHolder);            
		}
	}
	chartlog = document.getElementById('ChartLog');
	if (!chartlog.hasChildNodes()) {
		url="/php/logstats.php?account="+param;
		xmlHttp.open("GET",url,true);
		xmlHttp.send(null);
	}
}

var chart2;

function ajaxVSAStats(param) {
	var xmlHttp,data;
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
			data = eval("("+xmlHttp.responseText+")");
			/* !!! A REVOIR => Pas besoin de faire le ménage, mais plutôt n'invoquer le webservice que si divstats n'a pas d'enfant 
			divstats = document.getElementById('bodystats');
			while (divstats.hasChildNodes()) {
				divstats.removeChild(divstats.firstChild);
			}*/

chart2 = new cfx.Chart();
chart2.setGallery(cfx.Gallery.Step);
chart2.getView3D().setEnabled(true);
chart2.getView3D().setAngleX(45);
chart2.setDataSource(data);
var titles = chart2.getTitles();
var title = new cfx.TitleDockable();
title.setText("Evolution des caractéristiques VSA");
titles.add(title);			
chart2.getAxisX().setLabelAngle(45);
			
/*			
			chart2 = new cfx.Chart();
			chart2.setGallery(cfx.Gallery.Lines);
			chart2.setDataSource(data);
chart2.getData().setSeries(5);
//var series2 = chart1.getSeries().getItem(1);
//var series1 = chart1.getSeries().getItem(0);
			chart2.getSeries().getItem(0).setText("BP Internet");
			chart2.getSeries().getItem(1).setText("BP Internet max");
			chart2.getSeries().getItem(2).setText("BP Intranet");
			chart2.getSeries().getItem(3).setText("nb @IP Pub");
			chart2.getSeries().getItem(4).setText("nb zones");
			chart2.getView3D().setEnabled(true);
			chart2.getView3D().setAngleX(45);
			chart2.getAllSeries();
var axis1 = chart2.getAxisY();        var series1 = chart2.getSeries().getItem(0);    var series2 = chart2.getSeries().getItem(1);    var series3 = chart2.getSeries().getItem(2);    var series4 = chart2.getSeries().getItem(3);    var series5 = chart2.getSeries().getItem(4);    series1.setAxisY(axis1);    series2.setAxisY(axis1);    series3.setAxisY(axis1);    series4.setAxisY(axis1);    series5.setAxisY(axis1);  			//PopulateCarProduction(chart1);
			var titles = chart2.getTitles();
			var title = new cfx.TitleDockable();
			title.setText("Evolution des caractéristiques VSA");
			titles.add(title);
/*
			chart2 = new cfx.Chart();
			chart2.setGallery(cfx.Gallery.Bar);
			chart2.getAllSeries().setStacked(cfx.Stacked.Normal);
			chart2.setDataSource(data);
			var titles = chart2.getTitles();
			var title = new cfx.TitleDockable();
			title.setText("Logs VHM par type");
			titles.add(title);
			chart2.getAxisX().getLabelsFormat().setFormat(cfx.AxisFormat.Date);
			chart2.getAxisX().getLabelsFormat().setCustomFormat(";MMM-dd");
			chart2.getAxisX().getTitle().setText("Date");
			chart2.getAxisY().getTitle().setText("Nombre d'occurences");
			chart2.getAxisX().setLabelAngle(45);
			//chart1.getAxisX().setAutoScroll(true);
			//chart1.getAxisX().setClientScroll(true);
			//chart1.getAxisX().setScrollView(10,20);
			chart2.getSeries().getItem(0).setText("Consultation");
			chart2.getSeries().getItem(1).setText("Ajout");
			chart2.getSeries().getItem(2).setText("Modification");
			chart2.getSeries().getItem(3).setText("Destruction");
			//chart1.getAxisY().getLabelsFormat().setFormat(cfx.AxisFormat.Currency);
			*/
			var divHolder = document.getElementById('ChartVSA');
			chart2.create(divHolder);            
		}
	}
	chartVSA = document.getElementById('ChartVSA');
	if (!chartVSA.hasChildNodes()) {
		url="/php/vsastats.php?account="+param;
		xmlHttp.open("GET",url,true);
		xmlHttp.send(null);
	}
}

function ajaxFW(param) {
	var xmlHttp,data;
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
			//data = eval("("+xmlHttp.responseText+")");
			alert(xmlHttp.responseText);
			
			/* !!! A REVOIR => Pas besoin de faire le ménage, mais plutôt n'invoquer le webservice que si divstats n'a pas d'enfant 
			divstats = document.getElementById('bodystats');
			while (divstats.hasChildNodes()) {
				divstats.removeChild(divstats.firstChild);
			}*/
			divfw = document.getElementById('bodyfw');
			texte = document.createTextNode(xmlHttp.responseText);
			divfw.appendChild(texte);
		}
	}
	divfw = document.getElementById('bodyfw');
//	if (!divfw.hasChildNodes()) {
		url="/php/fwrulesvm.php?vmid="+param;
	alert(url);
		xmlHttp.open("GET",url,true);
		xmlHttp.send(null);
//	}
}


// from website http://css-tricks.com/complete-guide-table-element/
(function(document) {
	'use strict';

	var LightTableFilter = (function(Arr) {

		var _input;

		function _onInputEvent(e) {
			_input = e.target;
			var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
			Arr.forEach.call(tables, function(table) {
				Arr.forEach.call(table.tBodies, function(tbody) {
					Arr.forEach.call(tbody.rows, _filter);
				});
			});
		}

		function _filter(row) {
			var text = row.textContent.toLowerCase(), val = _input.value.toLowerCase();
			row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
		}

		return {
			init: function() {
				var inputs = document.getElementsByClassName('light-table-filter');
				Arr.forEach.call(inputs, function(input) {
					input.oninput = _onInputEvent;
				});
			}
		};
	})(Array.prototype);

	document.addEventListener('readystatechange', function() {
		if (document.readyState === 'complete') {
			LightTableFilter.init();
		}
	});

})(document);

</script>
