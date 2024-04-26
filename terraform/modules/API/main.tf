resource "aws_api_gateway_rest_api" "tabeeb_api" {
  name = "Tabeeb-api"
  description = "My API Gateway"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_authorizer" "auth" {
  name = "tabeeb_authorizer"
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  type = "COGNITO_USER_POOLS"
  provider_arns = [var.depends_on_cognito[0]]
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
resource "aws_api_gateway_resource" "patient_proxy" {
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  parent_id = aws_api_gateway_resource.patient.id
  path_part = "{proxy+}"
}


resource "aws_api_gateway_method" "patient_proxy" {
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  resource_id = aws_api_gateway_resource.patient_proxy.id
  http_method = "ANY"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.auth.id

  request_parameters = {
    "method.request.path.proxy" = true
  }
}


resource "aws_api_gateway_integration" "patient_proxy_lambda_integration" {
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  resource_id = aws_api_gateway_resource.patient_proxy.id
  http_method = aws_api_gateway_method.patient_proxy.http_method
  integration_http_method = "POST"
  type = "AWS_PROXY"
  uri = aws_lambda_function.patient.invoke_arn
}

resource "aws_api_gateway_method_response" "patient_proxy" {
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  resource_id = aws_api_gateway_resource.patient_proxy.id
  http_method = aws_api_gateway_method.patient_proxy.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "patient_proxy" {
  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  resource_id = aws_api_gateway_resource.patient_proxy.id
  http_method = aws_api_gateway_method.patient_proxy.http_method
  status_code = aws_api_gateway_method_response.patient_proxy.status_code

  depends_on = [
    aws_api_gateway_method.patient_proxy,
    aws_api_gateway_integration.patient_proxy_lambda_integration
  ]
}

resource "aws_api_gateway_deployment" "deployment" {
  depends_on = [
    aws_api_gateway_integration.patient_proxy_lambda_integration,
    aws_api_gateway_integration.patient_proxy_lambda_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.tabeeb_api.id
  stage_name = "${terraform.workspace}"
}
