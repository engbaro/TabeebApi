resource "aws_lambda_function" "patient" {
  filename = "../Lambda/Patient/index.zip"
  function_name = "patient"
  role = aws_iam_role.lambda_role.arn
  handler = "index.handler"
  runtime = "nodejs20.x"
  source_code_hash = data.archive_file.lambda_package.output_base64sha256
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
    {
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }
  ]
})
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role = aws_iam_role.lambda_role.name
}

resource "aws_iam_role_policy_attachment" "lambda_access_dynamo_db" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
  role = aws_iam_role.lambda_role.name
}

resource "aws_lambda_permission" "apigw_lambda" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.patient.function_name
  principal = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_rest_api.tabeeb_api.execution_arn}/*/*/tabeeb/v1/patient/{proxy+}"
}
