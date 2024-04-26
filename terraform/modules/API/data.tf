data "archive_file" "lambda_package" {
  type = "zip"
  source_file = "../Lambda/Patient/index.js"
  output_path = "../Lambda/Patient/index.zip"
}