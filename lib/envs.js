const argv = require('minimist')(process.argv.slice(2));

module.exports = {
  accessToken: argv.test ? 'FAKE_ACCESS_TOKEN' : process.env.GITHUB_ACCESS_TOKEN
};
