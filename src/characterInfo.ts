exports.characterInfo = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'characterInfo',
        input: event,
      },
      null,
      2
    ),
  };
};
