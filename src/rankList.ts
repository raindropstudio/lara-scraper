exports.rankList = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'rankList',
        input: event,
      },
      null,
      2
    ),
  };
};
