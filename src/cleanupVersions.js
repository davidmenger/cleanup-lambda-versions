/*
 * @author David Menger
 */
'use strict';

const aws = require('aws-sdk');

function listFunctions (lambda, nextMarker = null) {
    return new Promise((resolve, reject) => {
        const opts = {
            MaxItems: 999
        };

        if (nextMarker) {
            Object.assign(opts, { Marker: nextMarker });
        }

        lambda.listFunctions(opts, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    });
}

function listVersions (lambda, fnName) {
    return new Promise((resolve, reject) => {
        lambda.listVersionsByFunction({
            FunctionName: fnName,
            MaxItems: 20
        }, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    });
}

function removeVersion (lambda, fnName, version) {
    return new Promise((resolve, reject) => {
        lambda.deleteFunction({ FunctionName: fnName, Qualifier: version }, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    });
}



async function cleanupVersions (region, removeIt = false, nextMarker = null) {
    const lambda = new aws.Lambda({ region });
    const lambdas = await listFunctions(lambda, nextMarker);

    let i = 0;

    for (const fn of lambdas.Functions) {
        const versions = await listVersions(lambda, fn.FunctionName,);

        for (const version of versions.Versions) {
            if (version.Version !== fn.Version) {
                if (removeIt) {
                    try {
                        await removeVersion(lambda, fn.FunctionName, version.Version);
                        i++;
                    } catch (e) {
                        console.log(`Remove failed (${fn.FunctionName} - ${version.Version}): ${e.message}`);
                    }
                } else {
                    console.log(`${fn.FunctionName} - ${version.Version}`);
                    i++;
                }
            }
        }
    }

    if (lambdas.NextMarker) {
        i += await cleanupVersions(region, removeIt, lambdas.NextMarker);
    }

    return i;
}

module.exports = cleanupVersions;