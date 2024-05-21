import { Entity } from "electrodb";
import { ElectroEvent } from 'electrodb';
import { client, tableName } from '../../shared/dynamoDB';
const logger = (event: ElectroEvent) => {
  console.log(JSON.stringify(event, null, 4));
};
const patient = new Entity({
  model: {
    entity: "patient",
    service: "tabeeb",
    version: "1",
  },
  attributes: {
    patientId: {
      type: "string",
      partitionKey: true,
    },
    area:{
        type: "string",
        required: true,
        sortKey: true,
    },
    firstName: {
      type: "string",
      required: true,
    },
    lastName: {
      type: "string",
      required: true,
    },
    relationship: {
      type: "string",
      required: true,
    },
    gender: {
        type: "string",
        required: true,
        validate: (value: string) => ["female", "male"].includes(value),
    },
    birthYear: {
      type: "number",
      required: true,
      validate: (value: number) => value >= 1900,
    },
    subId:{
        type: "string",
        required: true,
    },
  },
  indexes: {
    byPatient: {
      pk: {
        // highlight-next-line
        collection: "patient-appointment",
        field: "pk",
        composite: ["patientId"],
        template: "patient#${patientId}"
      },
      sk: {
        // highlight-next-line
        field: "sk",
        composite: ["area"],        
        template: "area#${area}"
      }
    },
    byAccount:{
      index: "gsi1pk-gsi1sk-index",
        pk: {
            field: "gsi1pk",
            composite: ["subId"],
        },
    }
  },
}, { client, table: tableName, logger });

export { patient };