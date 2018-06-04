/*
 * @author David Menger
 */
'use strict';

const cleanupVersions = require('../src');

console.log();

let region = process.argv[process.argv.length-1];
let confirm = false;

if (region === 'confirm' && process.argv.length > 1) {
    confirm = true;
    region = process.argv[process.argv.length-2];
}

if (!region.match(/^[a-z]+\-[a-z]+\-[1-9]$/)) {
    console.info('Usage: $ cleanup-lambda-versions <aws region>\n');
    process.exit(1);
}

if (confirm) {
    console.log('\n removing... (it takes some time)');
}

cleanupVersions(region, confirm)
    .then(no => {
        if (confirm) {
            console.log(`Cleaned up ${no} versions`);
        } else {
            console.log(`\nfor removing all theese ${no} versions use: $ cleanup-lambda-versions <aws region> confirm \n`)
        }
    })
    .catch(e => console.error('Cleanup failed', e));
