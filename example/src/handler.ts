export const healthcheck = async (event: any): Promise<{ statusCode: number }> => {
  return {
    statusCode: 200,
  };
};
