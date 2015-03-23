#!/bin/bash
set -ev
npm run-script lint
npm test
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  npm run-script sauce
fi
