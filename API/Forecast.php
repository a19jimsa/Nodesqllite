<?php
header('Content-Type: application/json; charset=utf-8');

// Takes raw data from the request and make php object
$data = json_decode(file_get_contents('php://input'));

// Takes raw data from the request and make php object
$data = json_decode(file_get_contents('php://input'));
if(isset($data->ort)){
    $ort=$data->ort;
}else{
    $ort="Grums";
}
if(isset($data->days)){
  $days=$data->days;
}else{
  $days=1;
}

$output=Array();
$outputlst=Array();

$inputdate="2020-06-09";
$fromdate = date('Y-m-d', strtotime($inputdate));
$todate = date('Y-m-d', strtotime($fromdate . ' +'.$days.' day'));

$pdo= new PDO('sqlite:weather.db');
$querystring='SELECT * FROM forecast where fromtime>=:fromdate AND totime<=:todate and name=:name';
$stmt = $pdo->prepare($querystring);
$stmt->bindParam(':fromdate', $fromdate);
$stmt->bindParam(':todate', $todate);
$stmt->bindParam(':name', $ort);
$stmt->execute();

$outputlst=Array();
// Format sql data as json
foreach($stmt as $key => $row){
  $output=Array();
  foreach($row as $akey => $attr){
    if($akey=="auxdata") $akey="forecast";
    if(substr($attr,0,1)=="{"&&!is_int($akey)){
          $attr=json_decode($attr);
          $output[$akey]=$attr;
    }else{
        if(!is_int($akey)) $output[$akey]=$attr;
    }
  }
  array_push($outputlst,$output);
}

$JSONoutput = json_encode($outputlst);
echo $JSONoutput;
?>




