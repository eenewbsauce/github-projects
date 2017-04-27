const GitHubApi = require('github');
const async = require('async');
const Issues = require('./issues');
const GithubBase = require('./base');

class Cards extends GithubBase {
  constructor(orgName, repoName) {
    super(orgName, repoName);
    this.github = new GitHubApi();
    this.issues = new Issues(orgName, repoName);
    this.github.authenticate({
      type: 'oauth',
      token: this.accessToken
    });
  }

  create(card, cb) {
    async.waterfall([
      this.issues.create.bind(this.issues, card),
      (issue, cb) => {
        this.github.projects.createProjectCard({
          column_id: card.column_id,
          content_id: issue.id,
          content_type: 'Issue'
        }, cb);
      }
    ], cb);
  }
}

module.exports = Cards;
