resource "aws_dynamodb_table" "tabeeb-dynamodb-table" {
  name           = "Tabeeb"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "PK"
  range_key      = "SK"

  attribute {
    name = "PK"
    type = "S"
  }
    attribute {
    name = "SK"
    type = "S"
  }


  attribute {
    name = "Name"
    type = "S"
  }


    attribute {
    name = "GSI1PK"
    type = "S"
  }

    attribute {
    name = "GSI1SK"
    type = "S"
  }

  attribute {
    name = "Phone"
    type = "N"
  }


   global_secondary_index {
    name               = "PhoneIndex"
    hash_key           = "Phone"
    range_key          = "Name"      
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "KEYS_ONLY"
   }

  global_secondary_index {
    name               = "ApptIndex"
    hash_key           = "GSI1PK"
    range_key          = "GSI1SK"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "INCLUDE"
    non_key_attributes = ["Timestamp", "PK", "SK", "Type", "Information", "Link", "PaymentType", "PaymentAmount", "IsFollowUp", "PrimaryAppt", "Attachments"]
  }

  tags = {
    Name        = "dynamodb-table-tabeeb"
    Environment = "dev"
  }
}