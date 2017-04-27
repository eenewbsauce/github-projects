const expect = require('chai').expect;
const assert = require('chai').assert;
const sinon = require('sinon');
const github = require('../').github;

const orgName = 'fakeOrg';
const repoName = 'fakeReporName';

const sandbox = sinon.sandbox.create();
const issues = new github.Issues(orgName, repoName);
issues.github = {
  issues: {
    create: () => {},
    getForRepo: () => {}
  }
};
const fakeError = new Error('error!!!');
const fakeIssue = {
  data: {
    url: 'https://api.github.com/repos/qloan/admin-ui/issues/417',
    repository_url: 'https://api.github.com/repos/qloan/admin-ui',
    bleep: true
  }
};
const fakeIssues = {
  data: [
    fakeIssue.data
  ]
};

describe('github ::', function () {
  describe('issues ::', function () {
    describe('create ::', function () {
      it('should create an issue', function (done) {
        sandbox.stub(issues.github.issues, 'create').callsArgWith(1, null, fakeIssue);

        issues.create({
          title: 'tester',
          body: 'test'
        }, (err, data) => {
          assert(!err);
          expect(data.url).to.equal(fakeIssues.data[0].url);

          done();
        });
      });

      it('should callback with error when failing to create an issue', function (done) {
        sandbox.stub(issues.github.issues, 'create').callsArgWith(1, fakeError);

        issues.create({
          title: 'tester',
          body: 'test'
        }, (err, data) => {
          assert(!data);
          expect(err.message).to.equal('error!!!');

          done();
        });
      });
    });

    describe('list ::', function () {
      it('should retrieve list of issues', (done) => {
        sandbox.stub(issues.github.issues, 'getForRepo').callsArgWith(1, null, fakeIssues);

        issues.list((err, data) => {
          assert(!err);
          expect(data[0].bleep).to.be.true;

          done();
        });
      });

      it('should callback with an error when failing to retrieve a list of issues', (done) => {
        sandbox.stub(issues.github.issues, 'getForRepo').callsArgWith(1, fakeError);

        issues.list((err, data) => {
          assert(!data);
          expect(err.message).to.equal('error!!!');

          done();
        });
      });
    });

    describe('listAll ::', function () {
      it('should callback with error if fails to get list of all issues', (done) => {
        sandbox.stub(issues.github.issues, 'getForRepo').callsArgWith(1, fakeError);

        issues.listAll((err, issues) => {
          assert(err);
          assert(!issues);

          done();
        });
      });
    });
  });

  afterEach(function (done) {
    sandbox.restore();
    done();
  });
});
