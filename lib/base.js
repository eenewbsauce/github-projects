const envs = require('./envs');

class GithubBase {
  constructor(orgName, repoName) {
    this.accessToken = envs.accessToken;
    this.orgName = orgName;

    if (repoName) {
      this.repoName = repoName;
    }
  }
}

module.exports = GithubBase;
