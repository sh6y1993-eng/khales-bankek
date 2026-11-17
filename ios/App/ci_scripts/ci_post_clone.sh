#!/bin/sh
set -ex
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_INSTALL_CLEANUP=1
if ! command -v node >/dev/null 2>&1; then
  brew install node
fi
cd "$CI_PRIMARY_REPOSITORY_PATH"
npm install --legacy-peer-deps --no-audit --no-fund
npm run build
npx cap sync ios
NEW_BUILD=$((${CI_BUILD_NUMBER:-1} + 1))
sed -i '' "s/CURRENT_PROJECT_VERSION = [0-9]*;/CURRENT_PROJECT_VERSION = $NEW_BUILD;/g" ios/App/App.xcodeproj/project.pbxproj
