resource "aws_api_gateway_rest_api" "tabeeb_api" {
  name = "Tabeeb-api"
  description = "My API Gateway"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}


resource "aws_api_gateway_resource" "tabeeb" {
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  parent_id = aws_api_gateway_rest_api.tabeeb_api.root_resource_id
  path_part = "tabeeb"
}
resource "aws_api_gateway_resource" "v1" {
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  parent_id = aws_api_gateway_resource.tabeeb.id
  path_part = "v1"
}
resource "aws_api_gateway_resource" "patient" {
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  parent_id = aws_api_gateway_resource.v1.id
  path_part = "patient"
}

resource "aws_api_gateway_method" "patient_post" {
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  resource_id = aws_api_gateway_resource.patient.id
  http_method = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "patient_post_lambda_integration" {
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  resource_id = aws_api_gateway_resource.patient.id
  http_method = aws_api_gateway_method.patient_post.http_method
  integration_http_method = "POST"
  type = "MOCK"
}

resource "aws_api_gateway_method_response" "patient_post" {
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  resource_id = aws_api_gateway_resource.patient.id
  http_method = aws_api_gateway_method.patient_post.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "patient_post" {
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  resource_id = aws_api_gateway_resource.patient.id
  http_method = aws_api_gateway_method.patient_post.http_method
  status_code = aws_api_gateway_method_response.patient_post.status_code

  depends_on = [
    aws_api_gateway_method.patient_post,
    aws_api_gateway_integration.patient_post_lambda_integration
  ]
}

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    aws_api_gateway_integration.patient_post_lambda_integration,
   // aws_api_gateway_integration.options_integration, # Add this line
  ]

  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  stage_name = "${terraform.workspace}"
}