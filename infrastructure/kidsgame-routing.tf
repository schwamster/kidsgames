provider "aws" {
  region     = "eu-west-1"
  profile    = "default"
}

terraform {
  backend "s3" {
    bucket = "terraform3bdb243fed004e4ab7ab45eb31de4dc8"
    key    = "states/kidsgame"
    region = "eu-west-1"
    # dynamodb_table = "terraform-states"
  }
}

variable "domain" {
}

variable "subdomain" {
}

data "aws_route53_zone" "main" {
  name = "${var.domain}"
  private_zone = false
}

resource "aws_s3_bucket" "somebucket" {
  bucket = "${var.subdomain}.${substr(var.domain, 0, length(var.domain) -1)}"

  force_destroy = "true"
  
  website {
    index_document = "index.html"
  }
}

resource "aws_route53_record" "kidsgame" {
  zone_id = "${data.aws_route53_zone.main.zone_id}"
  name    = "${var.subdomain}.${var.domain}"
  type    = "A"
  alias {
    name = "${aws_s3_bucket.somebucket.website_domain}"
    zone_id = "${aws_s3_bucket.somebucket.hosted_zone_id}"
    evaluate_target_health = false
  }
}

output "bucket-id" {
  value = "${aws_s3_bucket.somebucket.id}"
}

output "bucket-domain" {
  value = "${aws_s3_bucket.somebucket.bucket_domain_name}"
}

output "website-endpoint" {
  value = "${aws_s3_bucket.somebucket.website_endpoint}"
}

output "website-url" {
    value = "http://${var.subdomain}.${substr(var.domain, 0, length(var.domain) -1)}"
}