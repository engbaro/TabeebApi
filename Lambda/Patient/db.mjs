import { DynamoDBClient} from '@aws-sdk/client-dynamodb';
import { v4 } from 'uuid';

import pkg from '@aws-sdk/lib-dynamodb';

const {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand,
  UpdateCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} = pkg;

const client = new DynamoDBClient({region: process.env.AWS_REGION || 'us-east-1'});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "Tabeeb";

/**
 * Creates a new patient in the database 
 * @param {*} patient 
 * @returns 
 */
const createPatient =  async function (patient) {

  if ((await checkPatientExist(patient)).success) {
    return {success: false, messages: ["Patient with this phone number already exists."]};
  }
  const params = {
    TableName: tableName,
    Item: {
      PK: "Patient#" + v4(),
      SK: "Area#IRAQ",
      Name: patient.name,
      PaymentMethod: patient.paymentMethod,
      Address: patient.address,
      Phone: patient.phone,
      Email: patient.email,
      CreditCard: patient.creditCard,
      BirthYear: patient.birthYear,
      Gender: patient.gender
    },
  };

  try {
    await dynamo.send(new PutCommand(params));
    console.log(`Patient created successfully with name ${patient.name} and phone no ${patient.phone}`);
    return {success: true, messages: []};
  } catch (error) {
    console.error("Error creating patient:", error);
    return {success: false, messages:[error.message]};
  }
}

/**
 * Updates a patient in the database
 * @param {*} patient 
 */
const updatePatient = async function (patient, id) {
  let updateExpression = 'set ';
  let expressionAttributeValues = {};

  if (!id) {
    throw new Error('Patient ID is required to update patient.');
  }
  for (let property in patient) {
    if (property === 'phone') {
      throw new Error('Phone number cannot be updated.');
    }
    updateExpression += `${property.capitalize()} = :${property}, `;
    expressionAttributeValues[`:${property}`] = patient[property];
  }

  // Remove trailing comma and space
  updateExpression = updateExpression.slice(0, -2);

  console.log(`ABRAR Update expression: ${updateExpression}`);
  console.log(`ABRAR Expression attribute values: ${JSON.stringify(expressionAttributeValues)}`);
  const param = {
    TableName: tableName,
    Key: {
      PK: "Patient#" + id,
      SK: "Area#IRAQ",
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  };
  console.log(`ABRAR PARAM: ${JSON.stringify(param)}`);
  await dynamo.send(
    new UpdateCommand(param)
  );
}

/**
 * Gets the patient by ID
 * @param {*} id 
 * @returns 
 */
const getPatientbyId = async function (id) {
  try {
    let body = await dynamo.send(
       new GetCommand({
         TableName: tableName,
         Key: {
           PK: "Patient#" + id,
           SK: "Area#IRAQ"
         },
       })
     );
    console.log(body);
    return body.Item;
  } catch (error) {
    console.log("Error getting patient:", error);
    return {success: false, messages:[error.message]};
  }
}


Object.defineProperty(String.prototype, 'capitalize', {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

/**
 * Check if a patient already exists in the database
 * @param {*} patient 
 * @returns
 * try to query the database with phone number with and without extension
 */
async function checkPatientExist(patient) {
  // try to use global secondary index in the future
  const params = {
    TableName: tableName,
    FilterExpression: "Phone = :Phone",
    ExpressionAttributeValues: {
      ":Phone": patient.phone
    }
  };
  const queryResult = await dynamo.send(new ScanCommand(params));
  if (queryResult.Items && queryResult.Items.length > 0) {
    console.log(`Patient with phone number ${patient.phone} already exists.`);
    return { success: true, messages: ["Patient with this phone number already exists."] };
  }
   return { success: false, messages: ["Patient doesn't exist."] };
}

export {createPatient, updatePatient, getPatientbyId};