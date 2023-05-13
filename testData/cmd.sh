#!/bin/bash
until $(curl --output /dev/null --silent --head --fail http://localhost:8080); do
    printf '.'
    sleep 5
done
curl -X POST \
    -H "Content-Type: application/fhir+json; charset=utf-8" \
    --data @/home/vetCal/data.json \
    "http://localhost:8080/fhir"