provider "aws" {
  region = "us-east-1"
}

module "cognito" {
  source = "./modules/Cognito"

}

module "api_gateway" {
  source = "./modules/API"
//  api_gateway_depends_on = [module.lambda.patient_post]
depends_on_cognito = [ module.cognito.cognito_pool_arn ]
}