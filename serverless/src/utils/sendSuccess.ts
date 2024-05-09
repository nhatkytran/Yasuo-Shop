type SuccessOptions = { statusCode?: number; data?: { [key: string]: any } };

const success = ({ statusCode = 200, data = {} }: SuccessOptions) => {
  return {
    headers: { 'Access-Control-Allow-Origin': '*' },
    statusCode,
    body: JSON.stringify({ status: 'success', ...data }),
  };
};

export default success;
