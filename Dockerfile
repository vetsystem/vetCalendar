FROM alpine:latest

RUN apk --no-cache add curl && apk add bash
WORKDIR /home
RUN mkdir vetCal
COPY testData/VetScheduling-Overall.json vetCal/data.json
COPY testData/cmd.sh vetCal/script.sh
RUN chmod +x vetCal/script.sh
CMD ["vetCal/script.sh", "run"]