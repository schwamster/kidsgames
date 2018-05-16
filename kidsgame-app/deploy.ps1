cd ./infrastructure
terraform init
terraform apply -var 'domain=greenelephant.io.' -var 'subdomain=kidsgame'
cd ..

yarn build
aws s3 sync --delete --acl public-read .\build\ s3://kidsgame.greenelephant.io
aws s3 cp --content-type application/javascript --acl public-read .\build\service-worker.js s3://kidsgame.greenelephant.io
