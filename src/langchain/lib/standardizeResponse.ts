export const returnSuccessResponse = <T>(response: T) => {
  return JSON.stringify({
    status: "success",
    ...response,
  });
};

export const returnErrorResponse = (error: any) => {
  return JSON.stringify({
    status: "error",
    message: error.message,
    code: error.code || "UNKNOWN_ERROR",
  });
};
