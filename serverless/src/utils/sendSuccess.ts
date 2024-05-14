type SuccessOptions = { statusCode?: number; data?: { [key: string]: any } };

const success = ({ statusCode = 200, data = {} }: SuccessOptions) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json; charset=utf-8',
    },
    statusCode,
    body: JSON.stringify({ status: 'success', ...data }),
  };
};

export default success;
