cd ./infrastructure
terraform apply -var 'domain=greenelephant.io.' -var 'subdomain=kidsgame'
cd ..

# yarn build-local
# aws s3 sync --delete --acl public-read .\dist\ s3://kidsgame.greenelephant.io
