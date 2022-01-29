#!/bin/bash
curl -X POST \
    -H "Content-Type: application/fhir+json; charset=utf-8" \
    --data @VetScheduling-Overall.json \
    "http://localhost:8080/fhir"
