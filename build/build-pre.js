/**
 * @see https://github.com/angular/angular-cli/issues/5190
 */
const path = require('path');
const colors = require('colors/safe');
const fs = require('fs');
let appVersion = require('../package.json').version;

console.log(colors.cyan('\nRunning pre-build tasks'));

const versionFilePath = path.join(__dirname + '/_versions.ts');

let src = `export const version = '${appVersion}';`;

const git = require('git-describe');
const info = git.gitDescribeSync({ longSemver: true });
let versionWithHash = appVersion;
if (info.hasOwnProperty('hash')) {
  versionWithHash = versionWithHash + '-' + info.hash;
}
src += `export const versionLong = '${versionWithHash}';`;

// ensure version module pulls value from package.json
fs.writeFile(versionFilePath, src, { flat: 'w' }, function (err) {
  if (err) {
    return console.log(colors.red(err));
  }

  console.log(colors.green(`Updating application version ${colors.yellow(appVersion)}`));
  console.log(`${colors.green('Writing version module to ')}${colors.yellow(versionFilePath)}\n`);
});
