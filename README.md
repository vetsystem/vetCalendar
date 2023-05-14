# Vetcalendar

## Description

This project was created as a school paper and it aims to research usage of [HL7® FHIR® standard](https://www.hl7.org/fhir/) for exchange of medical information in veterinary domain. The result is a prototype of application for scheduling patient appointments in veterinary practice.

It contains three building blocks:

- [HAPI FHIR JPA server](https://github.com/hapifhir/hapi-fhir-jpaserver-starter)
- script to upload initial data
- React application for scheduling appointments

## Table od content

- [Description](#description)
- [Instalation](#installation)
  - [Prerequisites](#prerequisites)
  - [Running via Docker](#running-via-docker)
  - [Starting individual blocks](#starting-individual-blocks)
- [Usage](#usage)

## Installation

### Prerequisites

You should have installed [Docker](https://www.docker.com/), specifically [Docker Engine](https://docs.docker.com/engine/install/) and [Docker Compose plugin](https://docs.docker.com/compose/install/) or [Docker Desktop](https://www.docker.com/products/docker-desktop/), which containts both of them.

Next you need [Git](https://git-scm.com/) for clonning this repository to your local machine or have a zip file of this repository.

### Running via Docker

Clone this repository with git and navigate to directory `/vetcalendar`.

```bash
git clone https://github.com/vetsystem/vetCalendar.git
cd ./vetcalendar
```

Or alternatively extract zip package and navigate to `./vetcalendar` if you have zip package available as a attachement to bachelor thesis.

From this repository run `docker compose up` command to install all docker containers with it'ds dependencies and run FHIR HAPI server, load initial testing data and start scheduling app.

```bash
docker compose up
```

First installation takes couple of minutes so be patient. After installation main scheduling application would by accesible on http://localhost:3000 and FHIR HAPI server on http://localhost:8080.

### Starting individual blocks

For developing purposes you can acces each docker containers separately.

#### HAPI FHIR server

HAPI FHIR server is accesible from [Docker Hub](https://hub.docker.com/r/hapiproject/hapi). It's running options as well as individual configuration could be find on it's [github page](https://github.com/hapifhir/hapi-fhir-jpaserver-starter). For purposes of this application the default setting is enought we just need switch FHIR version to R5, because previous versions aren't compatible with the scheduling app. For running standalone HAPI FHIR server use this command:

```bash
docker pull hapiproject/hapi:latest
docker run -p 8080:8080 -e hapi.fhir.fhir_version=R5 hapiproject/hapi:latest
```

After startup the server would be accessible on http:// localhost:8080 and it's web inteface could be used for managing FHIR Resurces and load custom initial data. Or we can use FHIR endpoint http://localhost:8080/fhir with REST clients as [Postman](https://www.postman.com/).

#### Load initial data

Scheduling application needs to upload initial data because without them it wouldn't work correctly. We need to upload doctors and rooms (FHIR resources Practitioner and Location). This could be done via curl command or using HAPI FHIR server web interface to insert these resources. For loading initial data from this repository check that HAPI FHIR server is running and run this command from `vetcalendar`:

```bash
curl -X POST \
    -H "Content-Type: application/fhir+json; charset=utf-8" \
    --data @testData/VetScheduling-Overall.json \
    "http://localhost:8080/fhir"
```

#### Starting React app in developer mode

React app in development mode provides more development tools in browser extension for React and takes care of reloading pages after changes on codebase. First we need to install app with [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm):

```bash
cd vet-cal
npm install
```

And then run the app with command:

```bash
npm run start
```

The app would be accesible on http://localhost:8080. All possible comands for React app could be find in `vetcalendar/vet-cal/README.md`.

## Usage

TODO
