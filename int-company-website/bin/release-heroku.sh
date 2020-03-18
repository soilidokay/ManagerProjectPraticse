#!/usr/bin/env bash

# This script is made to deploy bundle to Heroku without using Git as it's faster and more reliable, following
# this tutorial: https://devcenter.heroku.com/articles/platform-api-deploying-slugs

# IMPORTANT: Replace "loopnext-demo" with your Heroku app name.
HEROKU_APP_NAME='dayoneteams'

# Step 1: Create the source to upload bundle
npm run build
SOURCE=`curl -sS -n -X POST https://api.heroku.com/apps/$HEROKU_APP_NAME/sources -H 'Accept: application/vnd.heroku+json; version=3'`
SOURCE_GET_URL=$(echo $SOURCE | jq -r '.source_blob.get_url')
SOURCE_PUT_URL=$(echo $SOURCE | jq -r '.source_blob.put_url')
echo 'Source created'

# Step 2: Upload bundle to source put_url
curl $SOURCE_PUT_URL -X PUT -H 'Content-Type:' --data-binary @.dist-bundle/bundle.tar.gz
echo 'Bundle uploaded to source put_url'

# Step 3:
BUILD=`curl -sS -n -X POST https://api.heroku.com/apps/$HEROKU_APP_NAME/builds \
-d {\"source_blob\":{\"url\":\"$SOURCE_GET_URL\"}} \
-H 'Accept: application/vnd.heroku+json; version=3' \
-H "Content-Type: application/json"`
echo 'Build created & release finished'
