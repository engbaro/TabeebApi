variable "depends_on_cognito" {
  # the value doesn't matter; we're just using this variable
  # to propagate dependencies.
  type    = any
  default = []
}

variable "lambdaPath" {
  description = "path to lambda files"
  type        = string
  default     = "../../../Lambda"
}

variable "postPath" {
  description = "path to lambda files"
  type        = string
  default     = "/PatientPost"
}