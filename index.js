'use strict';


var GithubApi = require('github');
var _ = require('lodash');
var Promise = require('bluebird');

var github = new GithubApi( {
    debug: false,
    // protocol: 'https',
    // host: 'api.github.com',
    // pathPrefix: '/api/v3',
    Promise: require('bluebird'),
    // followRedirects: false,
    // timeout: 5000
});

function extractPullRequest(user, repo, prs) {
    return _.map(prs, function(pr) {
        return {
            user: user,
            repo: repo,
            state: pr.state,
            number: pr.number,
            submitter: pr.user.login, //jshint ignore: line
            createdTime: pr.created_at, //jshint ignore: line
            updatedTime: pr.updated_at, //jshint ignore: line
            closedTime: pr.closed_at, //jshint ignore: line
            mergedTime: pr.merged_at, //jshint ignore: line
        };
    });
}

function getAllPullRequests(user, repo) {
    return new Promise(function(resolve, reject) {
        var prs = [];

        var read = function(res) {
            console.log('.');

            var firstGet = github.pullRequests.getAll({
                    user: user,
                    state: 'all',
                    repo: repo,
                });
            var nextGet = github.getNextPage(res);

            if (!res) {
                firstGet.then(function(res) {
                    var tmp = extractPullRequest(user, repo, res);
                    prs.push(tmp);
                    if (github.hasNextPage(res)) {
                        read(res);
                    } else {
                        resolve(prs);
                    }
                }).catch(function(err) {
                    reject(err);
                });
            } else {
                nextGet.then(function(res) {
                    var tmp = extractPullRequest(user, repo, res);
                    prs.push(tmp);
                    if (github.hasNextPage(res)) {
                        read(res);
                    } else {
                        resolve(prs);
                    }
                }).catch(function(err) {
                    reject(err);
                });
            }
        };
        read();
    });
}

function testGetPages(user, repo) {
    return github.repos.getPages({
        user: user,
        repo: repo
    })
    .then(function(res) {
        console.log(res);
    });
}

getAllPullRequests('RackHD', 'on-tasks').then(function(data) {
    console.log(data);
    process.exit(0);
})
.catch(function(err) {
    console.log(err);
    process.exit(-1);
});
