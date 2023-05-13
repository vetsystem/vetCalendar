function patientTemplate() {
  return {
    resourceType: "Patient",
    active: true,
    name: [
      {
        text: "",
      },
    ],
    birthDate: "",
    extension: [
      {
        url: "http://hl7.org/fhir/StructureDefinition/patient-animal",
        extension: [
          {
            url: "species",
            valueCodeableConcept: {
              coding: [
                {
                  system: "",
                  code: "",
                  display: "",
                },
              ],
            },
          },
        ],
      },
    ],
    contact: [
      {
        name: {
          text: "",
        },
        telecom: [
          {
            value: "",
          },
        ],
      },
    ],
  };
}

export default patientTemplate;
