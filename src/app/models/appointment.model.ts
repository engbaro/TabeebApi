import { client, tableName } from '../../shared/dynamoDB';
import { Entity } from "electrodb";
import Joi from 'joi';
import enums from '../enums';
const appointment = new Entity(
    {
      model: {
        entity: "appointment",
        version: "1",
        service: "tabeeb",
      },
      attributes: {
        doctorId: {
          type: "string",
          required: true
        },
        patientId: {
          type: "string",
          required: true
        },
        appointmentId: {
          type: "string",
          required: true
        },
        price: {
          type: "number",
          required: true,
        },
        scheduleDate: {
          type: "string",
          required:true,
        },
        scheduleTime: {
            type: "string",
        },
        reasonToVisit: {
            type: "string",
        },
        status: {
          type: Object.values(enums.APPT_STATUS) as string[],
          required: true,
        },
        createdAt: {
          type: "number",
          default: () => Date.now(),
          readOnly: true,
        },
        updatedAt: {
          type: "number",
          watch:"*",
          set: () =>  Date.now(),
          readOnly: true,
        },
        paymentStatus: {
            type: ["Paid", "Unpaid"] as const,
            required: true,
            default: () => "Unpaid",
        },
        prescription: {
          type: "set",
          items: "string",
        },
        actionBy: {
          type: "string",
        },
        area: {
          type: "string",
          required: true,
          default: () => "iraq",
        },
        comment: {
          type: "string",
        }
      },
      indexes: {
        byAppointment: {
          pk: {
            // highlight-next-line
            field: "pk",
            composite: ["appointmentId"],
          },
          sk: {
            // highlight-next-line
            field: "sk",
            composite: ["area"],
          },
        },
        byDoctor: {
          // highlight-next-line
          index: "gsi1pk-gsi1sk-index",
          pk: {
            // highlight-next-line
            field: "gsi1pk",
            composite: ["doctorId"],
          },
          sk: {
            // highlight-next-line
            field: "gsi1sk",
            composite: ["scheduleDate"],
          },
        },
        byPatient: {
          // highlight-next-line
          collection: "patient-appointment",
          index: "gsi2pk-gsi2sk-index",
          pk: {
            // highlight-next-line
            field: "gsi2pk",
            composite: ["patientId"],
          },
          sk: {
            // highlight-next-line
            field: "gsi2sk",
            composite: ["scheduleDate"],
          },
        },
      },
      // add your DocumentClient and TableName as a second parameter
    },
    { client, table: tableName },
  );

  // Add Joi validation
const appointmentSchema = Joi.object({

    patientId: Joi.string().uuid().required(),
    doctorId: Joi.string().uuid().required(),
    price: Joi.number().required(),
    scheduleDate: Joi.string().isoDate(),
    scheduleTime: Joi.string().pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/),
    reasonToVisit: Joi.string(),
    status: Joi.string().valid('Pending', 'Started', 'Done').required(),
    createdAt: Joi.number(),
    pescription: Joi.array().items(Joi.string()),
    paymentStatus: Joi.string().valid('Paid', 'Unpaid').required(),
});

 export { appointment, appointmentSchema }; 
//payment