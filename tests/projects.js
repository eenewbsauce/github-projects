const expect = require('chai').expect;
const assert = require('chai').assert;
const sinon = require('sinon');
const async = require('async');
const github = require('../').github;

const sandbox = sinon.sandbox.create();
const projects = new github.Projects();

projects.github = {
  projects: {
    getOrgProjects: () => {},
    getProjectColumns: () => {},
    getProjectCards: () => {}
  }
};

const fakeColumn = {
  id: 628215
};

const errorMessage = 'Error!!!';

const fakeError = new Error(errorMessage);

const fakeProjects = {
  data: ['proj1', 'proj2', 'proj3']
};

const fakeColumns = {
  data: ['col1', 'col2', 'col3']
};

const fakeCards = {
  data: [
    {
      content_url: 'https://api.github.com/repos/qloan/admin-ui/issues/501'
    },
    {
      content_url: 'https://api.github.com/repos/qloan/admin-ui/issues/502'
    }
  ]
};

const fakeIssues = [
  {
    id: 1,
    url: 'https://api.github.com/repos/qloan/admin-ui/issues/501'
  },
  {
    id: 2,
    url: 'https://api.github.com/repos/qloan/admin-ui/issues/502'
  }
];

const fakeProject = {
  id: 353652,
  columns: fakeColumns.data
};

describe('github ::', function () {
  describe('projects ::', function () {
    describe('list ::', function () {
      it('should get all projects for the org', (done) => {
        sandbox.stub(projects.github.projects, 'getOrgProjects').callsArgWith(1, null, fakeProjects);

        projects.list((err, data) => {
          assert(!err);
          assert(data);
          expect(data).to.be.an.array;
          expect(data[0]).to.equal('proj1');

          done();
        });
      })

      it('should callback with error if fails', (done) => {
        sandbox.stub(projects.github.projects, 'getOrgProjects').callsArgWith(1, fakeError);

        projects.list((err, data) => {
          assert(err);
          assert(!data);
          expect(err.message).to.equal(errorMessage);

          done();
        });
      })
    });

    describe('columns ::', function () {
      it('should get all columns for the project', (done) => {
        sandbox.stub(projects.github.projects, 'getProjectColumns').callsArgWith(1, null, fakeColumns);

        projects.columns(fakeProject, (err, data) => {
          assert(!err);
          assert(data);
          expect(data.id).to.equal(fakeProject.id);
          expect(data.columns).to.be.an.array;
          expect(data.columns[0]).to.equal('col1');

          done();
        });
      })

      it('should callback with error if fails', (done) => {
        sandbox.stub(projects.github.projects, 'getProjectColumns').callsArgWith(1, fakeError);

        projects.columns(fakeProject, (err, data) => {
          assert(err);
          assert(!data);
          expect(err.message).to.equal(errorMessage);

          done();
        });
      });
    });

    describe('cards ::', function () {
      it('should get all cards for a project', (done) => {
        sandbox.stub(projects.github.projects, 'getProjectCards').callsArgWith(1, null, fakeCards);

        projects.cardsForColumn(fakeColumn, fakeIssues, (err, data) => {
          assert(!err);
          assert(data);
          expect(data).to.be.an.array;
          expect(data[0].id).to.equal(1);

          done();
        });
      });

      it('should callback with an error if it fails', (done) => {
        sandbox.stub(projects.github.projects, 'getProjectCards').callsArgWith(1, fakeError);

        projects.cardsForColumn(fakeColumn, fakeIssues, (err, data) => {
          assert(err);
          assert(!data);
          expect(err.message).to.equal(errorMessage);

          done();
        });
      })
    });

    describe('getBoard ::', function () {
      it('should build the board for a project', (done) => {
        sandbox.stub(async, 'waterfall').callsArgWith(1, null, fakeProject);

        projects.getBoard((err, data) => {
          assert(!err);
          assert(data);
          expect(data).to.be.an.object;
          expect(data).to.have.a.property('id');
          expect(data).to.have.a.property('columns');
          expect(data.columns).to.be.an.array;

          done();
        });
      });

      it('should callback with an error if it fails', (done) => {
        sandbox.stub(async, 'waterfall').callsArgWith(1, fakeError);

        projects.getBoard((err, data) => {
          assert(err);
          assert(!data);
          expect(err.message).to.equal(errorMessage);

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
