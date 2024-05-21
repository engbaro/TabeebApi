import { Entity } from "electrodb";
import { ElectroEvent } from 'electrodb';
import { client, tableName } from '../../shared/dynamoDB';
const logger = (event: ElectroEvent) => {
  console.log(JSON.stringify(event, null, 4));
};
const daySchedule = new Entity({
  model: {
    entity: "daySchedule",
    service: "tabeeb",
    version: "1",
  },
  attributes: {
    doctorId: {
      type: "string",
    },
    dayScheduleId:{
        type: "string",
        partitionKey: true,
        required: true,
    },
    date: {
        type: "string",
        required: true,
    },
    filled: {
        type: "boolean",
        default: () => false,
    },
    availableSlots:{
        type: "set",
        items: "string",
    },
    start:{
      type:"string",
      required : true,
    },
    end: {
      type:"string",
      required : true,
    },
    takenSlots: {
        type: "set",
        items: "string",
    },
    updatedAt:{
        type: "number",
        watch: "*",
        readOnly: true,
    },
    createdAt: {
        type: "number",
        default: () => Date.now(),
        readOnly: true,
    },
    interval:{
        type: "number",
        required: true,
    }
  },
  indexes: {
    byTimeslot: {
      pk: {
        // highlight-next-line
        field: "pk",
        composite: ["dayScheduleId"],
      },
      sk: {
        // highlight-next-line
        field: "sk",
        composite: [],
      }
    },
    byDoctor:{
      index: "gsi1pk-gsi1sk-index",
        pk: {
            field: "gsi1pk",
            composite: ["doctorId"],
        },
        sk: {
            field: "gsi1sk",
            composite: ["date"],
        }
    }
  },
}, { client, table: tableName, logger });

export { daySchedule };