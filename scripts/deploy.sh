#!/bin/bash

rm -rf ./dist/node_modules
yarn build
yarn install --prod --modules-folder ./dist/node_modules
cd dist
rm deploy.zip
zip -r deploy.zip .
cd ..
yarn install

aws lambda update-function-code \
  --function-name telescope \
  --zip-file fileb://dist/deploy.zip \
  --publish
