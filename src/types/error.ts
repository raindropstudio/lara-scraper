export class RequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequestError';
  }
};

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
};

export class PrivateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PrivateError';
  }
};

export class QuestNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuestNotFoundError';
  }
};
