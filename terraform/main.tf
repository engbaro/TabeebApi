provider "aws" {
  region = "us-east-1"
}

module "gateway_api" {
  source = "./modules/API"
}