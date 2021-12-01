<?php
header('Content-Type: application/json; charset=utf-8');

$output=Array("Hello","World");

$JSONoutput = json_encode($output);
echo $JSONoutput;
?>