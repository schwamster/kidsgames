provider "aws" {
  region     = "eu-west-1"
  profile    = "default"
}

terraform {
  backend "s3" {
    bucket = "terraform3bdb243fed004e4ab7ab45eb31de4dc8"
    key    = "states/kidsgame"
    region = "eu-west-1"
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

  acl = "public-read"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::kidsgame.greenelephant.io/*"
        }
    ]
}
EOF
  
}

resource "aws_route53_record" "kidsgame" {
  zone_id = "${data.aws_route53_zone.main.zone_id}"
  name    = "${var.subdomain}.${var.domain}"
  type    = "A"
  alias {
    name = "${aws_cloudfront_distribution.s3_distribution.domain_name}"
    zone_id = "${aws_cloudfront_distribution.s3_distribution.hosted_zone_id}"
    evaluate_target_health = false
  }
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = "${aws_s3_bucket.somebucket.bucket_domain_name}"
    origin_id   = "S3-${aws_s3_bucket.somebucket.bucket}"

    custom_origin_config {
            origin_protocol_policy = "http-only"
            http_port = 80
            https_port = 443
            origin_ssl_protocols = ["TLSv1", "TLSv1.1", "TLSv1.2"]
        }
  }

  enabled             = true
  default_root_object = "index.html"

  custom_error_response {
        error_caching_min_ttl = 3000
        error_code = 404
        response_code = 200
        response_page_path = "/index.html"
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.somebucket.bucket}"

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Distributes content to US and Europe
  price_class = "PriceClass_100"

  restrictions {
        geo_restriction {
            # type of restriction, blacklist, whitelist or none
            restriction_type = "none"
        }
   }

  viewer_certificate {
    acm_certificate_arn = "arn:aws:acm:us-east-1:394296847239:certificate/f9c3ee90-a8fb-4dae-be0d-48aab04a90dc"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  aliases = ["${var.subdomain}.${substr(var.domain, 0, length(var.domain) -1)}"]
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