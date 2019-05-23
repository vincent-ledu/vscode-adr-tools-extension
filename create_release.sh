#!/bin/bash

### Usage: ./create_release.sh v0.0.3
## check if README.md contains version description
## check if CHANGELOG.md contains version description
## update package.json version number
## create github tag and push it.

NEW_VERSION=$1
FOUND_README=1
FOUND_CHANGELOG=1

echo "Creating version $NEW_VERSION..."
echo "Check if README.md contains version description"
if grep -q "^### $NEW_VERSION$" "README.md"; then
    echo "version found in README.md. ok";
    FOUND_README=0;
else
    echo "ERROR: version not found in README.md.";
    FOUND_README=1;
fi

echo "Check if CHANGELOG.md contains version description"
if grep -q "^## \[$NEW_VERSION\]$" "CHANGELOG.md"; then
    echo "version found in CHANGELOG.md. ok";
    FOUND_CHANGELOG=0;
else
    echo "ERROR: version not found in CHANGELOG.md.";
    FOUND_CHANGELOG=1;
fi

if [ "$FOUND_README" = "0" ] && [ "$FOUND_CHANGELOG" = "0" ] ; then
    echo "go push new version on github"
    git tag -a $NEW_VERSION -m "releasing version $NEW_VERSION" git push origin --tags
else
    exit 1
fi