# github-projects

A module that makes it easy to access Github projects data

## Installation

Export your Github accessToken as an environment variable

```
export GITHUB_ACCESS_TOKEN=your_token
```

Then install

```
npm i github-projects
```

## Usage

### Projects

All examples below require that you require the Projects class

```javascript
const github = require('github-projects');
const projects = new github.Projects(yourOrgName, yourProjectId);
```

Get an entire Project Board with all columns and cards (useful for building your own UI)

```javascript
projects.getBoard(cb);
```

List your projects

```javascript
projects.list((err, projects) => {
    cb(err, projects);
})
```

Get Project By Name

```javascript
projects.getByName(projectName, cb)
```

Get Project by Id

```javascript
projects.getById(projectId, cb)
```

Get columns for a Project

```javascript
projects.columns(project, cb);
```

Get Cards for a Column

```javascript
projects.cardsForColumns(column, allIssues, cb);
```

### Cards

All examples below require that you require the Cards class

```javascript
const github = require('github-projects');
const cards = new github.Cards(yourOrgName, repoName);
```

Create a Card

```javascript
issues.create({
    title: 'A Title for the card',
    column_id: columnId,
    body: 'Card description',
    assignees: ['You', 'me', 'Dupree'],
    labels: ['bug']
}, cb);

```

### Issues

All examples below require that you require the Issues class

```javascript
const github = require('github-projects');
const issues = new github.Issues(yourOrgName, repoName);
```

List all Issues

```javascript
issues.list(cb);
```

listAll (auto-paginates)

```javascript
issues.listAll(cb);
```

Create an Issue

```javascript
issues.create(issue, cb);
```


## Tests

```
npm test
```
