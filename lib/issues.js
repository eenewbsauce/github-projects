const GitHubApi = require('github');
const async = require('async');
const R = require('ramda');
const GithubBase = require('./base');

class Issues extends GithubBase {
  constructor(orgName, repoName) {
    super(orgName, repoName);
    this.github = new GitHubApi();
    this.github.authenticate({
      type: 'oauth',
      token: this.accessToken
    });
  }

  create(issue, cb) {
    const extendedIssue = Object.assign(issue, {
      owner: this.orgName,
      repo: this.repoName
    });

    this.github.issues.create(extendedIssue, function(err, issue) {
      cb(err, R.path(['data'], issue));
    });
  }

  list(cb) {
    this.github.issues.getForRepo(this.extendQueryObj(), function(err, issues) {
      cb(err, R.path(['data'], issues));
    });
  }

  listAll(cb, queryObj = { page: 1, per_page: 100, state: 'all' }) {
    let issueStore = [];
    let truthTest = true;
    let extendedQueryObj = this.extendQueryObj(queryObj);

    async.whilst(() => {
      return truthTest;
    }, (cb) => {
      this.github.issues.getForRepo(extendedQueryObj, (err, issues) => {
        if (err) {
          return cb(err);
        }

        truthTest = R.path(['data', 'length'], issues) === queryObj.per_page;
        Array.prototype.push.apply(issueStore, issues.data);
        queryObj.page++;

        cb();
      });
    }, (err) => {
      if (err) {
        return cb(err);
      }

      cb(null, issueStore);
    });
  }

  extendQueryObj(queryObj = {}) {
    return Object.assign(queryObj, {
      owner: this.orgName,
      repo: this.repoName
    });
  }
}

module.exports = Issues;
