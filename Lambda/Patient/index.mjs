/*exports.handler = async (event) => {
    // Your Lambda function logic here
  
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
      message: "Hello from Lambda!"
      // Add more data as needed
    })
  };
  
  return response;
  };*/

import { verifyUserCreate, verifyUserUpdate } from './verify.mjs';
import { createPatient, updatePatient, getPatientbyId } from './db.mjs';

export const handler = async (event, context) => {
  let body;
  let requestJSON;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };
  console.log("context", context)
  console.log("event", event)
  let path = '/tabeeb/v1/patient';
  try {
    let validationMessages
    switch (event.httpMethod) {
      /*case `DELETE`:
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = `Deleted patient ${event.pathParameters.id}`;
        break;*/
      case `GET`:
        let result = await getPatientbyId(event.pathParameters.proxy);
        body = JSON.stringify(result);
        break;
      case `PUT`:
        body = JSON.parse(event.body);
        if (!(validationMessages = verifyUserUpdate(body)).success) {
          statusCode = 400;
          body = validationMessages;
        } else {
          try {
            await updatePatient(body, event.pathParameters.proxy);
            body = `Updated patient ${event.pathParameters.proxy} with ${event.body}`;
          } catch (error) {
            console.error("Error updating patient:", error);
            statusCode = 400;
            body = `Updating patient request ended with ${error.message}`;
          }
        }
        break;
      case `POST`:
        body = JSON.parse(event.body);
        if (!(validationMessages = verifyUserCreate(body)).success) {
          statusCode = 400;
          body = validationMessages;
        } else {
          try {
            const result = await createPatient(body);
            body = `Created patient request ended with ${result.success} and messages ${result.messages}`;
            console.log("created patient with name", body.name);
          } catch (error) {
            // app would have crashed and thrown an exception
            console.error("Error creating patient:", error);
            body = `Created patient request ended with ${error}`;
            statusCode = 400;
          }
        }
        break;
      default:
        throw new Error(`Unsupported route: "${event.httpMethod}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    return {
      headers,
      statusCode,
      body
    }
  }
};