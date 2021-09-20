#!/bin/sh
set -e

# install dependencies needed for i18n
echo "==> Installing dependencies"
npm install --save @formatjs/intl js-cookie

# dev dependencies
echo "==> Installing dev dependencies"
npm install --save-dev @formatjs/cli eslint-plugin-formatjs react-intl-translations-manager glob-fs

echo "==> Finished installing all dependencies"