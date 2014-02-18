<?php
$con=mysqli_connect("localhost","deb24932_nttb","pingpong12","deb24932_nttb");
// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
  
$pid = $_GET['pid'];
$type = $_GET['type'];
$wnr = $_GET['wnr'];
$debug = $_GET['debug'];
//echo $pid;

$mons = array(
			"jan" => "1", 
			"feb"=> "2", 
			"mrt"=> "3", 
			"apr"=> "4", 
			"mei"=> "5", 
			"jun"=> "6", 
			"jul"=> "7", 
			"aug"=> "8", 
			"sep"=> "9", 
			"okt"=> "10", 
			"nov"=> "11", 
			"dec"=> "12");

if ($type=="standen"){
	$i="1";
	$result = mysqli_query($con,"SELECT * FROM teams_stand WHERE pid ='$pid' ORDER BY stand ASC ");
	while($row = mysqli_fetch_array($result)){
	$tid = $row['tid'];
	if($row['team_naam'] == $row['team_pijnacker'] ){
	$teams[$i]['team_naam'] ="<b>".$row['team_naam']."</b>";
	}else{
	$teams[$i]['team_naam'] =$row['team_naam'];
	}
	$teams[$i]['tid'] =$tid;
	$teams[$i]['punten'] =$row['punten'];
	$teams[$i]['wedstrijden'] = $row['wedstrijden'];


	$i=$i+1;
			
			
	}
	//echo "<pre>";
	//print_r($competitie_lijst);
	//echo "</pre>";
	echo json_encode($teams);

}

if ($type=="teamlijst"){
	
	$result = mysqli_query($con,"SELECT DISTINCT competitie_soort FROM teams_stand ORDER BY competitie_soort DESC ");
	$i="1";
	while($row = mysqli_fetch_array($result)){
	$competitie_soort = $row['competitie_soort'];
		if ($row['competitie_soort'] ==="Duo competitie"){
			$competitie_soort_output = "Duo";
		}
		if ($row['competitie_soort'] ==="Senioren Noord (A+B)"){
			$competitie_soort_output = "Senioren";
		}
		if ($row['competitie_soort'] ==="Senioren TOP klasse"){
			$competitie_soort_output = "Senioren";
		}
		if ($row['competitie_soort'] ==="Jeugd"){
			$competitie_soort_output = "Jeugd";
		}
		$result2 = mysqli_query($con,"SELECT DISTINCT team_pijnacker,pid FROM teams_stand WHERE competitie_soort = '$competitie_soort' ORDER BY team_pijnacker ASC ");
		
		while($row2 = mysqli_fetch_array($result2)){
			$competitie[$competitie_soort_output][$i]['competitie_soort'] = $competitie_soort_output;
			$competitie[$competitie_soort_output][$i]['team_pijnacker'] = $row2['team_pijnacker'];
			$competitie[$competitie_soort_output][$i]['pid'] = $row2['pid'];

			$i=$i+1;
		}
		
	
	
			
			
	}
	
	echo json_encode($competitie);
if ($debug =="ja"){
		echo "<pre>";
		print_r($competitie);
		echo "</pre>";
	}
}
elseif ($type=="wedstrijden"){
	$i="1";
	$week_vorige = 0;
	$result = mysqli_query($con,"SELECT * FROM wedstrijden WHERE pid ='$pid' ORDER BY id ASC ");
	while($row = mysqli_fetch_array($result)){
	$tid = $row['tid'];
	
	
	

	
	
	
	$maand = $row['maand'];
	$datum = $row['datum'];
	$jaar = substr($row['competitie_naam'], -4);
	$maand2 = $mons[$maand];
	$date = mktime(0, 0, 0,$maand2,$datum,$jaar);
	$week = (int)date('W', $date);
	
	if($row['team_uit'] == $row['team_pijnacker'] ){
		$teams[$week][$i]['team_uit'] ="<b>".$row['team_uit']."</b>";
	}else{
		$teams[$week][$i]['team_uit'] =$row['team_uit'];
	}
	if($row['team_thuis'] == $row['team_pijnacker'] ){
		$teams[$week][$i]['team_thuis'] ="<b>".$row['team_thuis']."</b>";
	}else{
		$teams[$week][$i]['team_thuis'] =$row['team_thuis'];
	}
	$teams[$week][$i]['wedstrijdnummer'] =$row['wedstrijdnummer'];
	$teams[$week][$i]['punten_thuis'] =$row['punten_thuis'];
	$teams[$week][$i]['punten_uit'] = $row['punten_uit'];
	$teams[$week][$i]['dag'] = $row['dag'];
	$teams[$week][$i]['datum'] = $row['datum'];
	$teams[$week][$i]['maand'] = $row['maand'];
	$i=$i+1;
			
			
	}
	//echo "<pre>";
	//print_r($competitie_lijst);
	//echo "</pre>";
	echo json_encode($teams);
	if ($debug =="ja"){
		echo "<pre>";
		print_r($teams);
		echo "</pre>";
	}






}
elseif ($type=="percentages"){
	$i="1";
	$result = mysqli_query($con,"SELECT * FROM spelers WHERE pid ='$pid' ORDER BY percentage DESC,gespeeld DESC ");
	while($row = mysqli_fetch_array($result)){
	$tid = $row['tid'];

	
	$spelers[$i]['naam'] =utf8_encode($row['naam']);
	$spelers[$i]['percentage'] =$row['percentage'];
	$spelers[$i]['bondsnummer'] = $row['bondsnummer'];
	$spelers[$i]['gespeeld'] = $row['gespeeld'];
	$spelers[$i]['pijnacker'] = $row['pijnacker'];


	
	
	
	$i=$i+1;
			
			
	}
	//echo "<pre>";
	//print_r($competitie_lijst);
	//echo "</pre>";

	echo json_encode($spelers);
	
		if ($debug =="ja"){
		echo "<pre>";
		print_r($spelers);
		echo "</pre>";
	}








}

elseif ($type=="wedstrijd"){
	
	
	$result = mysqli_query($con,"SELECT * FROM wedstrijden WHERE wnr ='$wnr' ");
	while($row = mysqli_fetch_array($result)){
	
		$wnr = $row['wnr'];
		$pid = $row['pid'];
		$dag = $row['dag'];
		$datum = $row['datum'];
		$maand = $row['maand'];
		$tijd = $row['tijd'];
		$team_thuis = $row['team_thuis'];
		$team_thuis_sql = mysqli_real_escape_string($con,$row['team_thuis']);
		$team_uit = $row['team_uit'];
		$result2 = mysqli_query($con,"SELECT * FROM teams_stand WHERE team_naam ='$team_thuis_sql' AND pid='$pid'  ");
		
		while($row2 = mysqli_fetch_array($result2)){
		
		
		$gebouw = $row2['gebouw'];
		$straatnaam = $row2['straatnaam'];
		$postcode_plaats = $row2['postcode_plaats'];
		$telefoonnummer = $row2['telefoonnummer'];

		
				
				
		}
		//echo "<pre>";
		//print_r($competitie_lijst);
		//echo "</pre>";
		echo "$team_thuis   -    $team_uit<br><br>Wedstrijdnummer: $wnr <br>Datum: $dag $datum $maand <br>Tijd: $tijd <br><br>Locatie:<br>$gebouw<br>";
		echo "<a href='geo:0,0?q=$straatnaam, $postcode_plaats, nederland'>$straatnaam</a><br>$postcode_plaats<br>$telefoonnummer</a>";
		
		
	

	}





}
elseif ($type=="team"){
	
	
	$result = mysqli_query($con,"SELECT * FROM teams_stand WHERE pid ='$pid' AND team_naam LIKE 'Pijnacker%' ");
	while($row = mysqli_fetch_array($result)){

	$team['team_naam'] = $row['team_naam'];
	$team['competitie_soort'] = $row['competitie_soort'];
	$team['stand'] = $row['stand'];

	}

echo json_encode($team);
	
		if ($debug =="ja"){
		echo "<pre>";
		print_r($spelers);
		echo "</pre>";
	}



}


	?>