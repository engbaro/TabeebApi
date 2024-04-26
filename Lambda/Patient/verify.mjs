import { updateSchema, createSchema } from "./patientSchema.mjs";

function verifyUserCreate(body) {
  let result = { messages: [], success: true }
  const verificationResult = createSchema.validate(body);
  const cardVerification = verifyCard(body);

  if (verificationResult.error) {
    result.messages.push(verificationResult.error.details[0].message);
    result.success = false;
  }
  if (!cardVerification) {
    result.messages.push("Invalid credit card information");
    result.success = false;
  }
  return result;
}
function verifyUserUpdate(body) {
  let result = { messages: [], success: true }
  const verificationResult = updateSchema.validate(body);
  const cardVerification = verifyCard(body);

  if (verificationResult.error) {
    result.messages.push(verificationResult.error.details[0].message);
    result.success = false;
  }
  if (!cardVerification) {
    result.messages.push("Invalid credit card information");
    result.success = false;
  }
  return result;
}


let verifyCard = function (patient) {
  // code for card verification goes here
  return true;
}
export { verifyUserCreate, verifyUserUpdate };

