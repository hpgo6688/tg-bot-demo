#!/bin/bash

pkill -f "ngrok http http://localhost:8090"
pkill -f "go run main.go"
