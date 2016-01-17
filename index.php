<?php

$requestStr = file_get_contents('php://input');
$request = json_decode($requestStr);
$out   = process($request);

$size = strlen($out);
header('Content-Type: application/json');
header("Content-length: $size");
echo $out;

function process($request){
  
  $query  = $request->request->intent->slots->query->value;
  $requestId = $request->request->request_id;
  
  switch($request->request->type) {  
    case "IntentRequest":
      return '
        {
          "version": "1.0",
          "response": {
            "card": {
              "type": "Simple",
              "title": "Media Control",
              "content": "' . $query . '"
            },
            "shouldEndSession": true
          }        
        }';    
  }
}