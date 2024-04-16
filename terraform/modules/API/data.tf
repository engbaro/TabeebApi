data "archive_file" "lambda_package" {
  type = "zip"
  source_file = "../Lambda/PatientPost/index.js"
  output_path = "../Lambda/PatientPost/index.zip"
}