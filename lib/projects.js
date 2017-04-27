const GitHubApi = require('github');
const async = require('async');
const R = require('ramda');
const Issues = require('./issues');
const GithubBase = require('./base');

class Projects extends GithubBase {
  constructor(orgName, projectId) {
    super(orgName);
    this.github = new GitHubApi();
    this.github.authenticate({
      type: 'oauth',
      token: this.accessToken
    });
    this.projectId = projectId;
  }

  getBoard(cb) {
    let issuesStore = [];

    async.waterfall(
      [
        (cb) => {
          new Issues().listAll((err, issues) => {
            if (err) {
              return cb(err);
            }

            issuesStore = issues;

            cb(null, this.projectId);
          });
        },
        this.getById.bind(this),
        this.columns.bind(this),
        (project, cb) => {
          async.forEach(project.columns, (column, cb) => {
            this.cardsForColumn(column, issuesStore, (err, cards) => {
              column.cards = cards;

              cb();
            });
          }, (err) => {
              cb(err, project);
          });
        }
      ],
      cb
    );
  }

  getByName(projectName, cb) {
    this.list((err, projects) => {
      if (err) {
        return cb(err);
      }

      let projectMatch = R.find((project) => {
        return project.name.toLowerCase() === projectName.toLowerCase();
      })(projects.data);

      cb(null, projectMatch);
    });
  }

  getById(projectId, cb) {
    this.list((err, projects) => {
      if (err) {
        return cb(err);
      }

      let projectMatch = R.find((project) => {
        return project.id === projectId;
      })(projects);

      cb(null, projectMatch);
    });
  }

  list(cb) {
    this.github.projects.getOrgProjects({ org: this.orgName }, (err, projects) => {
      cb(err, R.path(['data'], projects));
    });
  }

  columns(project, cb) {
    this.github.projects.getProjectColumns({ project_id: project.id }, (err, columns) => {
      if (err) {
        return cb(err);
      }

      project.columns = columns.data;

      cb(null, project);
    });
  }

  cardsForColumn(column, issues, cb) {
    this.github.projects.getProjectCards({ column_id: column.id }, (err, cards) => {
      if (err) {
        return cb(err);
      }

      let mappedCards = cards.data.map((card) => {
        let mappedCard;

        if (R.isNil(card.note)) {
          card.note = 'Missing Issue : (';
          mappedCard = R.find(R.propEq('url', card.content_url))(issues) || card;
        } else {
          mappedCard = card;
        }

        return mappedCard;
      });

      cb(null, mappedCards);
    });
  }
}

module.exports = Projects;
