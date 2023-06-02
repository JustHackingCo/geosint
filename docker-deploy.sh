#!/bin/bash

docker build -t geosint-main .
docker run -p 443:6958 -d geosint-main

