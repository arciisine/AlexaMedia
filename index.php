<?php

//https://www.ourace.com/145-amazon-echo-alexa-with-php-hello-world

$response = json_decode(file_get_contents('php://input'));
$messageType = $response->request->type;

$out   = Process($messageType,$response);
$size = strlen($out);
header('Content-Type: application/json');
header("Content-length: $size");
echo $out;

function Process($messageType, $response){

  $query  = $response->request->intent->slots->query->value;
  $requestId = $response->request->request_id;
  
  switch($messageType) {  
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