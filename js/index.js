
function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    // PhoneGap is loaded and it is now safe to make calls PhoneGap methods
    //
    function onDeviceReady() {
        // Register the event listener
        document.addEventListener("menubutton", onMenuKeyDown, false);
    }

    // Handle the menu button
    //
    function onMenuKeyDown() {
	$( ":mobile-pagecontainer" ).pagecontainer( "change", "#menu",{dataUrl: "/v5/"}); 
    }
 
//declare pid as global var

var pid;
var type;


$( document ).on( "pageshow", function(e, data) {
$('a').removeClass("ui-btn-active");
$('#'+pid).addClass("ui-btn-active");
$( "#nav_menu ul li a" ).removeClass("ui-btn-active")
$( "#nav_menu #"+type).addClass("ui-btn-active")
			
});


$( document ).on( "pagecreate","#Home", function() {	
		if (localStorage.getItem("fav_team") === null) {
			console.log("geen fav_team");
	
		}else{
			var fav_pid = localStorage.getItem("fav_team");
			console.log("fav_team: "+fav_pid);		
		}
		$( "#fav_button" ).hide();		
		$( "#menu" ).page();
		$( "body>[data-role='header']" ).toolbar();
		$('#nav_menu').navbar();
		$('#senioren').listview();
		
		$.getJSON("http://m.ttvp.nl/v4/poule.php?type=teamlijst", function(data) {
		console.log("data ophalen van server voor teamlijst");
		$('#senioren').empty();
		
		
		teams = data.Senioren;
		$('#senioren').append('<li data-role="list-divider">Senioren</li>');
		$.each(teams, function(index, team) {
				
					$('#senioren').append('<li id="panel-'+team.pid+'"><a href="#Poule?pid='+team.pid+'&type=standen"  id="'+team.pid+'">' +team.team_pijnacker+'</a></li>');
				
			});
		teams = data.Duo;
						
		$('#senioren').append('<li data-role="list-divider">Duo</li>');
		$.each(teams, function(index, team) {
			
				$('#senioren').append('<li id="panel-'+team.pid+'"><a href="#Poule?pid='+team.pid+'&type=standen"  id="'+team.pid+'">' +team.team_pijnacker+'</a></li>');
			
		});
			
		$('#senioren').append('<li data-role="list-divider">Jeugd</li>');
		teams = data.Jeugd;
		$.each(teams, function(index, team) {
			
				$('#senioren').append('<li id="panel-'+team.pid+'"><a href="#Poule?pid='+team.pid+'&type=standen" id="'+team.pid+'">' +team.team_pijnacker+'</a></li>');
			
		});
			
		
		
		console.log("klaar met teamlijst");
		console.log("controleren of er een fav team is");
		if (localStorage.getItem("fav_team") === null) {
				console.log("geen fav_team");
				$( ":mobile-pagecontainer" ).pagecontainer( "change", "#menu",{dataUrl: "/v5/"}); 
			}else{
			
				var fav_pid = localStorage.getItem("fav_team");
				
				if (isNaN(fav_pid)){
					console.log("favpid is geen nummer");
					console.log(fav_pid);
					$( ":mobile-pagecontainer" ).pagecontainer( "change", "#menu",{dataUrl: "/v5/"}); 
					
				}else{
					console.log("We gaan nu de fav pagina oproepen: "+fav_pid);
					showCategory(fav_pid,"standen");
					$( "#senioren li" ).attr("data-icon","false");
					$( "#panel-"+pid ).attr("data-icon","star");
				}
			}	
		$('#senioren').listview("refresh");
		
		});
	
	
		
		
});






// Listen for any attempts to call changePage().
$(document).bind( "pagebeforechange", function( e, data ) {
	console.log("pagebeforechange fired");
	if ( typeof data.toPage === "string" ) {

		// We are being asked to load a page by URL, but we only
		// want to handle URLs that request the data for a specific
		// pid.
		var u = $.mobile.path.parseUrl( data.toPage );
		naarpid = url('?pid', u.href);
		naartype = url('?type', u.href);
		
		
		
		
		
		
		re = /^#Poule/;
		
		if ( u.hash.search(re) !== -1 ) {

				// We're being asked to display the items for a specific category.
				// Call our internal method that builds the content for the category
				// on the fly based on our in-memory category data structure.
							
			if (naarpid){
				console.log("ga naar poule: "+naarpid);
				console.log("ga naar poule type: "+naartype);
				showCategory(naarpid,naartype);
				e.preventDefault();		
			}
			
		}
	
	}
	
});
		
// Load the data for a specific category, based on
// the URL passed in. Generate markup for the items in the
// category, inject it into an embedded page, and then make
// that page the current active page.
function showCategory(gaanpid,gaantype){	
	
	pid=gaanpid;
	type=gaantype;
	console.log("Page laten zien:"+type+"-"+pid);
	if ($('#tikk-'+type+'-'+pid).length == 0) {
		console.log("Page bestaat nog niet Nieuwe page maken: "+type+"-"+pid);
		
		
		
		
		if (type=="standen"){
			
			$('#page_body').append('<div data-role="page" id="tikk-'+type+'-'+pid+'"><div data-role="content"><ul id="team_'+type+'_tik_'+pid+'" data-role="listview"></ul></div></div>');
			
			$.getJSON("http://m.ttvp.nl/v3/poule.php?type="+type+"&pid="+pid, function() {
			
			})
			.done(function(data) {
				console.log( "Data is opgehaald: " +pid );
				var teams = data;
				$('#team_'+type+'_tik_'+pid).empty();
				$.each(teams, function(index, team) {
					$('#team_'+type+'_tik_'+pid).append('<li>'+team.team_naam+'<span class="ui-li-count">'+team.wedstrijden+' - '+team.punten+'</span></li>');
				});
				
				change__Page(type,pid,"");
			})
			.fail(function() {
			alert( "Kan data niet ophalen" );
			
				
			
			});
	
		}else if(type=="wedstrijden"){
			
			$('#page_body').append('<div data-role="page" id="tikk-'+type+'-'+pid+'"><div data-role="content"><div id="btnw"><button style="display: none" class="npbw">Alle wedstrijden</button><button class="npbw">Alleen Pijnacker</button></div></br><ul id="team_'+type+'_tik_'+pid+'" data-role="listview"></ul></div></div>');

			$.getJSON("http://m.ttvp.nl/v3/poule.php?type="+type+"&pid="+pid, function() {
			
			})
			.done(function(data) {
				console.log( "Data is opgehaald: " +pid );
				var wedstrijden = data;
				$('#team_'+type+'_tik_'+pid).empty();
				$.each(wedstrijden, function(index, wedstrijdweek) {
				
				$('#team_'+type+'_tik_'+pid).append('<li data-role="list-divider">Week: '+index+'</li>');
					
					$.each(wedstrijdweek, function(index, wedstrijd) {
						var thuis = wedstrijd.team_thuis;
						var thuis_p = thuis.substr(0,3);
						var uit = wedstrijd.team_uit;
						var uit_p = uit.substr(0,3);
						if(thuis_p=="<b>" || uit_p=="<b>"){
							$('#team_'+type+'_tik_'+pid).append('<li><p>'+wedstrijd.dag+' '+wedstrijd.datum+' '+wedstrijd.maand+' '+wedstrijd.team_thuis+' - '+wedstrijd.team_uit+'</p><span class="ui-li-count">'+wedstrijd.punten_thuis+' - '+wedstrijd.punten_uit+'</span></li>');
						}else{
							$('#team_'+type+'_tik_'+pid).append('<li class="npw"><p>'+wedstrijd.dag+' '+wedstrijd.datum+' '+wedstrijd.maand+' '+wedstrijd.team_thuis+' - '+wedstrijd.team_uit+'</p><span class="ui-li-count">'+wedstrijd.punten_thuis+' - '+wedstrijd.punten_uit+'</span></li>');

						}
					});
				});
				
				change__Page(type,pid,"");
			});
		
		
		
		}else if(type=="percentages"){
			$('#page_body').append('<div data-role="page" id="tikk-'+type+'-'+pid+'"><div data-role="content"><div id="btnp"><button style="display: none" class="npbp">Alleen Pijnacker</button><button class="npbp">Alle spelers</button></div></br><ul id="team_'+type+'_tik_'+pid+'" data-role="listview"></ul></div></div>');

			
			$.getJSON("http://m.ttvp.nl/v3/poule.php?type="+type+"&pid="+pid, function() {
			
			})
			.done(function(data) {
				console.log( "Data is opgehaald: " +pid );
				var spelers = data;
				$('#team_'+type+'_tik_'+pid).empty();
				$.each(spelers, function(index, speler) {
				
					if(speler.pijnacker=="0"){
						if (speler.gespeeld >0){
							$('#team_'+type+'_tik_'+pid).append('<li style="display:none" class="npp"><p>'+speler.naam+' - '+speler.team+'</p><span class="ui-li-count">'+speler.percentage+'%</span></li>');
						}
						else{
							$('#team_'+type+'_tik_'+pid).append('<li style="display:none" class="npp"><p>'+speler.naam+' - '+speler.team+'</p></li>');
						}
					}else{
						if (speler.gespeeld >0){
							$('#team_'+type+'_tik_'+pid).append('<li class="npp"><p>'+speler.bondsnummer+' '+speler.naam+'</p><span class="ui-li-count">'+speler.percentage+'%</span></li>');
							$('#team_'+type+'_tik_'+pid).append('<li style="display:none" class="npp"><p><b>'+speler.naam+' - '+speler.team+'</b></p><span class="ui-li-count">'+speler.percentage+'%</span></li>');
						}
						else{
							$('#team_'+type+'_tik_'+pid).append('<li class="npp"><p>'+speler.bondsnummer+' '+speler.naam+'</p></li>');
							$('#team_'+type+'_tik_'+pid).append('<li style="display:none" class="npp"><p><b>'+speler.naam+' - '+speler.team+'<b/></p></li>');
						}
			
					}
					
					
				});
				
				change__Page(type,pid,"");
			
			});
		
		
		
		}
	
	}else{
		console.log("page bestaat al: "+pid);
		change__Page(type,pid,"update");
	}
}

function change__Page(gatype,gapid,updaten){	
	console.log("we gaan de page veranderen: "+gapid);
	pid=gapid;
	type=gatype;
	$( "#nav_menu #standen").attr("href", "#Poule?pid="+pid+"&type=standen");
	$( "#nav_menu #wedstrijden").attr("href", "#Poule?pid="+pid+"&type=wedstrijden");
	$( "#nav_menu #percentages").attr("href", "#Poule?pid="+pid+"&type=percentages");
	
	
	$( ":mobile-pagecontainer" ).pagecontainer( "change", "#tikk-"+gatype+"-"+ gapid,{dataUrl: "/v5/"}); 
	
	$( "#fav_button" ).show();
	$( "#nav_menu" ).show();
	
	if (localStorage.getItem("fav_team") == gapid) {
		console.log("dit is de fav page");
		$( "#fav_button" ).buttonMarkup({ icon: "star" });
	}	else{
		console.log("dit is niet de fav page");
		$( "#fav_button" ).buttonMarkup({ icon: "" });
	}
	
	$("#fav_button").on("tap",function(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		localStorage.setItem('fav_team', pid);
		console.log("opslaan fav: "+pid);
		$( "#fav_button" ).buttonMarkup({ icon: "star" });
		$( "#senioren a" ).removeClass("ui-icon-star");
		$( "#senioren a" ).removeClass("ui-btn-icon-right");
		$( "#"+pid ).addClass("ui-icon-star");
		$( "#"+pid ).addClass("ui-btn-icon-right");
			
	});
	
	
	$(".npbp").on("tap",function(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		$(".npp").toggle();
		$(".npbp").toggle();
		
		
	});
	
	$(".npbw").on("tap",function(e){
	    e.preventDefault();
		e.stopImmediatePropagation();
		$(".npw").toggle();
		$(".npbw").toggle();
		
		
	});
	
	
	$( "#nav_menu ul li a" ).removeClass("ui-btn-active")
	$( "#nav_menu #"+type).addClass("ui-btn-active")
	
	
	
	
	
	
	if (updaten=="update"){
	
		if (type=="standen"){
				
				
				$.getJSON("http://m.ttvp.nl/v3/poule.php?type="+type+"&pid="+pid, function() {
				
				})
				.done(function(data) {
					console.log( "Data is opgehaald: " +pid );
					var teams = data;
					$('#team_'+type+'_tik_'+pid).empty();
					$.each(teams, function(index, team) {
						$('#team_'+type+'_tik_'+pid).append('<li>'+team.team_naam+'<span class="ui-li-count">'+team.wedstrijden+' - '+team.punten+'</span></li>');
					});
				$('#team_'+type+'_tik_'+pid).listview('refresh');		
				});
		
			}else if(type=="wedstrijden"){
				
				
				$.getJSON("http://m.ttvp.nl/v3/poule.php?type="+type+"&pid="+pid, function() {
				
				})
				.done(function(data) {
					console.log( "Data is opgehaald: " +pid );
					var wedstrijden = data;
					$('#team_'+type+'_tik_'+pid).empty();
					$.each(wedstrijden, function(index, wedstrijdweek) {
					
					$('#team_'+type+'_tik_'+pid).append('<li data-role="list-divider">Week: '+index+'</li>');
						
						$.each(wedstrijdweek, function(index, wedstrijd) {
							var thuis = wedstrijd.team_thuis;
							var thuis_p = thuis.substr(0,3);
							var uit = wedstrijd.team_uit;
							var uit_p = uit.substr(0,3);
							if(thuis_p=="<b>" || uit_p=="<b>"){
								$('#team_'+type+'_tik_'+pid).append('<li><p>'+wedstrijd.dag+' '+wedstrijd.datum+' '+wedstrijd.maand+' '+wedstrijd.team_thuis+' - '+wedstrijd.team_uit+'</p><span class="ui-li-count">'+wedstrijd.punten_thuis+' - '+wedstrijd.punten_uit+'</span></li>');
							}else{
								$('#team_'+type+'_tik_'+pid).append('<li class="npw"><p>'+wedstrijd.dag+' '+wedstrijd.datum+' '+wedstrijd.maand+' '+wedstrijd.team_thuis+' - '+wedstrijd.team_uit+'</p><span class="ui-li-count">'+wedstrijd.punten_thuis+' - '+wedstrijd.punten_uit+'</span></li>');

							}
						});
					});
				$('#team_'+type+'_tik_'+pid).listview('refresh');		
				});
			
			
			
			}else if(type=="percentages"){
			
			
				
				$.getJSON("http://m.ttvp.nl/v3/poule.php?type="+type+"&pid="+pid, function() {
				
				})
				.done(function(data) {
					console.log( "Data is opgehaald: " +pid );
					var spelers = data;
					$('#team_'+type+'_tik_'+pid).empty();
					$.each(spelers, function(index, speler) {
					
						if(speler.pijnacker=="0"){
							if (speler.gespeeld >0){
								$('#team_'+type+'_tik_'+pid).append('<li style="display:none" class="npp"><p>'+speler.naam+' - '+speler.team+'</p><span class="ui-li-count">'+speler.percentage+'%</span></li>');
							}
							else{
								$('#team_'+type+'_tik_'+pid).append('<li style="display:none" class="npp"><p>'+speler.naam+' - '+speler.team+'</p></li>');
							}
						}else{
							if (speler.gespeeld >0){
								$('#team_'+type+'_tik_'+pid).append('<li class="npp"><p>'+speler.bondsnummer+' '+speler.naam+'</p><span class="ui-li-count">'+speler.percentage+'%</span></li>');
								$('#team_'+type+'_tik_'+pid).append('<li style="display:none" class="npp"><p><b>'+speler.naam+' - '+speler.team+'</b></p><span class="ui-li-count">'+speler.percentage+'%</span></li>');
							}
							else{
								$('#team_'+type+'_tik_'+pid).append('<li class="npp"><p>'+speler.bondsnummer+' '+speler.naam+'</p></li>');
								$('#team_'+type+'_tik_'+pid).append('<li style="display:none" class="npp"><p><b>'+speler.naam+' - '+speler.team+'<b/></p></li>');
							}
				
						}
						
						
					});
					
				$('#team_'+type+'_tik_'+pid).listview('refresh');	
				});
			
			
			
		}
	
	}
	
	
	
	
	
	
	
	
	


}



	