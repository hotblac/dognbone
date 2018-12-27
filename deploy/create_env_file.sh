#!/bin/bash

# Create a .env file from environment variables
echo TWILIO_TWIML_APP_SID=$TWILIO_TWIML_APP_SID >> .env
echo TWILIO_NUMBER=$TWILIO_NUMBER >> .env