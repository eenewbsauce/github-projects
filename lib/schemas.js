const joi = require('joi');
const logger = require('bunyan').createLogger({ name: 'github' });

const rootSchema = joi.object().keys({
  id: joi.alternatives().try(joi.number(), joi.string()).required(),
  url: joi.string().optional()
});

const baseSchema = rootSchema.keys({
  name: joi.string().required()
});

const cardSchema = rootSchema.keys({
  title: joi.any().required(),
  content_url: joi.string().optional(),
  labels: joi.array().optional(),
  createdDate: joi.date().optional(),
  creator: joi.object().keys({
    login: joi.string().required()
  }).optional(),
  number: joi.alternatives().try(joi.number(), joi.string()).optional()
})

const columnSchema = baseSchema.keys({
  cards: joi.array().items(cardSchema)
});

class Board {
  constructor(json) {
    joi.validate(json, baseSchema, { stripUnknown: true }, (err, board) => {
      if (err) {
        logger.error('Failed to create Board object');
      }

      Object.assign(this, board);
    });
  }
}

class BoardDetail {
  constructor(json) {
    const schema = baseSchema.keys({
      columns: joi.array().items(columnSchema)
    });

    joi.validate(json, schema, { stripUnknown: true }, (err, boardDetail) => {
      if (err) {
        logger.error('Failed to create BoardDetail object');
      }

      Object.assign(this, boardDetail);
    });
  }
}

class Card {
  constructor(json) {
    joi.validate(json, cardSchema, { stripUnknown: true }, (err, card) => {
      if (err) {
        logger.error('Failed to create Card object');
      }

      Object.assign(this, card);
    });
  }
}

class Column {
  constructor(json) {
    joi.validate(json, columnSchema, { stripUnknown: true }, (err, column) => {
      if (err) {
        logger.error('Failed to create Column object');
      }

      Object.assign(this, column);
    });
  }
}

class CardDetail {
  constructor(json) {
    const schema = cardSchema.keys({
      body: joi.string().required(),
      assignee: joi.string().optional(),
      attachments: joi.array().optional(),
      members: joi.array().optional()
    });

    joi.validate(json, schema, { stripUnknown: true }, (err, cardDetail) => {
      if (err) {
        logger.error('Failed to create CardDetail object');
      }

      Object.assign(this, cardDetail);
    });
  }
}

module.exports = {
  Board: Board,
  BoardDetail: BoardDetail,
  Card: Card,
  Column: Column,
  CardDetail: CardDetail
};
