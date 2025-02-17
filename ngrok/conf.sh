#!/bin/bash

ngrok config add-authtoken 2tARqpTaHY17LqWU6gBGRKUBiwm_HBfPTMBCyKy318UhBt42

ngrok http http://localhost:8090


curl 'https://api.telegram.org/bot8122519214:AAFAaxeUUdTVRBe7PHdfsmjZmcfWNVaS1-4/setWebhook' \
  --data-raw '{"url":"https://b104-128-1-33-186.ngrok-free.app"}'