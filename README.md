[![Build Status](https://travis-ci.org/hotblac/dognbone.svg?branch=master)](https://travis-ci.org/hotblac/dognbone)

# dognbone
Dog n Bone: A JavaScript browser phone implementation for Twilio.

# Setup
Dog n Bone is an application for Twilio. It requires

* a Twilio account with Account SID and Auth Token,
* a Twilio phone number with voice capability and
* a TwiML app.

All of these can be set up from the Twilio console.

## Twilio Account
Go to https://www.twilio.com/ and click Sign Up. After creating an account, the Account SID and Auth Token are shown on the [console dashboard](https://www.twilio.com/console). 

## Phone Number
Create a Twilio Phone Number from the [Phone Numbers](https://www.twilio.com/console/phone-numbers/incoming) section of the console. Click (+) to buy a new number. Select any number with Voice capability.

## TwiML application
Create a new TwiML application under the [Phone Numbers / Tools](https://www.twilio.com/console/phone-numbers/runtime/twiml-apps) menu of the console. Click (+) to create a new application. Enter 'Dog n Bone' as the Friendly name and leave the URLs blank for now. We'll set the Voice URL after the app is deployed.

After creating the TwiML application, click on it and note its SID.

# Build
Clone the application code (`git clone git@github.com:hotblac/dognbone.git`) or [download the source zip](https://github.com/hotblac/dognbone/archive/develop.zip) and run

`npm run build`

to build the application.

# Run

The application requires environment infomation to be set in the .env file. See [.env.example](https://github.com/hotblac/dognbone/blob/develop/.env.example) for an example .env file. Rename this file as .env and then set the `TWILIO_TWIML_APP_FRIENDLY_NAME` to your TwiML application's friendly name ('Dog n Bone').

The application can then be run locally with

`npm start`

Browse to http://localhost:8080 to check the application is running - it should show a login screen.

## Testing locally with ngrok
Twilio must be able to communicate with the application's voice endpoint at `/api/voice`. To expose this on a local development environment, use [ngrok](https://ngrok.com)

`ngrok http 8080`

This will expose your application on `https://<something>.ngrok.io`. Note the URL and add it as the Voice Request URL of your [TwiML application](https://www.twilio.com/console/phone-numbers/runtime/twiml-apps). The request URL should be of format:

`https://<something>.ngrok.io/api/voice`

You should now be able to login to Dog n Bone on http://localhost:8080, login with your Twilio Account SID and Auth Token (copy them from the [Twilio Console](https://www.twilio.com/console)) and then make a call.

# Deploy to Google App Engine

Dog n Bone is a Node JS application so can be deployed to [Google App Engine](https://cloud.google.com/appengine/) (standard environment). See the [Hello World example](https://cloud.google.com/nodejs/getting-started/hello-world) for instructions on setting up a Google Cloud Platform project and installing the Google Cloud SDK to your local machine.

Before deploying, you'll need to build the application. The Google App Engine descriptor file (app.yaml) is included in the source code.

Once you've set up the CGP project and have the command line tools, Dog n Bone can be deployed with

`gcloud app deploy`

It will deploy to `https://<something>.appspot.com`. Set this URL as the Voice Request URL of your [TwiML application](https://www.twilio.com/console/phone-numbers/runtime/twiml-apps). The request URL should be of format:
                                                                     
`https://<something>.appspot.com/api/voice`


## Deploy to other PaaS vendors

Dog n Bone is a Node JS application so should be good to deploy to other PaaS vendors such as [Heroku](https://www.heroku.com/) or [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/). I've tested only on Google App Engine though so you're on your own for this. Don't forget to:

* Deploy your .env file or otherwise set the `TWILIO_TWIML_APP_FRIENDLY_NAME` environment variable in your deployment.
* Set the Voice Request URL of your [TwiML application](https://www.twilio.com/console/phone-numbers/runtime/twiml-apps) to your deployment's `/api/voice` endpoint.
