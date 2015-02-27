#!/bin/bash
set -ev
npm test
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  npm run-script sauce
fi
