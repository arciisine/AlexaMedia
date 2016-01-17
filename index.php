<?php
  $requestStr = file_get_contents('php://input');
  $request = json_decode($requestStr);
  $out   = process($request);

  $size = strlen($out);
  header('Content-Type: application/json');
  header("Content-length: $size");
  echo $out;

  function to_firebase($url, $query) {
    $ch = curl_init();
    $payload = json_encode( array( "action" => $query ) );    

    curl_setopt_array($ch, array(
      CURLOPT_URL => $url,
      CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
      CURLOPT_POSTFIELDS => $payload,
      CURLOPT_RETURNTRANSFER => true
    ));
    
    //set the url, number of POST vars, POST data
    $result = curl_exec($ch);
    if (curl_errno($ch)) {
        echo 'error:' . curl_error($c);
    }
    curl_close($ch);
  }

  function process($request){
    
    $requestId = $request->request->request_id;
    
    switch($request->request->type) {  
      case "IntentRequest":
        $url = $request->firebaseURL;
        $query = $request->request->intent->slots->query->value;
        to_firebase($url, $query);    
        
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