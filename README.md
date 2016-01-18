Amzon Echo and Fire TV Stick Integration
========================================

Sample phrases that would work:
  - `Alexa ask tv to pause`
    - Issues pause key press 
  - `Alexa ask tv to rewind`
    - Issues rewind key press 3x (fast rewind)
  - `Alexa ask tv to play ice age`
    - Launches default app (Netflix)
    - Navigates to search screen
    - Types in `ice age`
    - Plays first search result found
  - `Alexa ask tv to play gotham on hulu`
    - Launches Hulu
    - Navigates to search screen
    - Types in `gotham`
    - Plays first search result found
  
Apps currently supporting search and play:
  - Hulu 
  - Netflix

The search and play feature relies on adb input events, and so timing is sensitive.  It may require some variation depending on FireTV vs FireTV stick.  This may even work with chromecast (or any other system accesible via adb).  

Setup
---------------------------------------

###Requirements
Things you will need:
  - Amazon Echo (With developer mode turned on)
  - Amazon Web Services Account (free)
  - Amazon Developer Account (free)
  - Firebase Account (free)
  - Local machine with network access to Fire TV Stick
  - FireTV Stick with Developer mode turned on
  - NodeJS
  - nmap
  - adb (Android Development Kit)

###Architecture of Application 
![Architecture of Application](/resources/data-flow.png?raw=true "Architecture of Application")

###Configure Alexa Skills App(https://developer.amazon.com/edw/home.html#/skills/list)
  - Add New Skill
  - Pick a good invocation name, I use "tv"
  - Endpoint
    - We will be using AWS Lambda to host the speech handler
    - Will setup later
  - Intent Schema (Use `$projectRoot/reousrces/intent.schema`)
  - Create a new Custom Slot Type
    - Name is ACTION
    - Contents is in `$projectRoot/resources/action.type.slot`
  - Sample Utterances
    - Use utterances in resources/utterances.sample
  - Everything else is optional, as you will not be publishing your app
  
###Create Firebase Access (https://firebase.com)
  - Utilize `$projectRoot/resources/firebase-rules.json`
  - Generate new secret key under secrets menu
  
###Write Configuration JSON
  - Setup fill out `$projectRoot/resources/config.sample.json` to `$projectRoot/resources/config.json`
  - Copy or symlink `$projectRoot/resources/config.json` to 
    - `$projectRoot/client/` folder 
    - `$projectRoot/lambda/` folder 

###Create Amazon Lambda 
  - Generate zip file: `cd lambda; zip ../lambda.zip *; cd -`
  - Go to https://console.aws.amazon.com/lambda/home
  - Make sure you are in North East Region (Required for Alexa)
  - Create a Lambda Function
  - Skip blueprint
  - Give it a Name
  - Runtime is Node.js
  - Upload a .ZIP file (Select `$projectRoot/lambda.zip`)
  - You will also need to create a 'Basic execution role' if you don't have one already
  - After creating the Lambda, go to the Event Sources tab and "Add event source"
    - Event source type should be "Alexa Skills Kit"
  - Under Actions, Configure test event
    - User `$projectRoot/resources/test-event.json`
    - Fill in your app id 
  - Run Test
    - You should now start to see events showing up in your firebase console
  - Configure your Alexa Skill
    - Put your Lambda ARN into the skill configuration
    - You should now be able to communicate with your Alexa using the invocation name you have
    - The events should show up in firebase.

###Run Local NodeJS ADB Connection
  - Run `npm install` to prep application
  - Run `node client/` to run application
    - It uses nmap to find IP address of firetv stick
    - You should see the message that it is connected to IP
  - The client should now read and delete the firebase messages as they come in
     - This means your firebase data store should generally be empty
  - If all goes well your echo commands should trigger the proper sequence of adb operations
     
     
Next Steps
------------------------------------------------
  * Install the node client on my Raspberry Pi to act as Firebase event listener
    * Should allow me to use this with other Skills if I make more
    * Verify code works properly on nodejs version available for Raspberry Pi
  * Figure out how to play Amazon Videos
  * Wait for Amazon to finally integrate this functionality into Echo
  * Add support for other Applications
    * ...
  * Figure out if using `adb shell input text` is possible for Hulu
  * Figure out if there is anyway to get the information of the running video
  * Figure out if integrating with chromecast would be feasible
     * Should just be a different set of `adb` commands