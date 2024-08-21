import { TErrorScources, TGenericErrorResponse } from "../interface/error";

const handleDuplicateKeyError = (err: any): TGenericErrorResponse => {
  // extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // extracted value will be in the first capturing group
  const extracted_message = match && match[1];
  const errorSources: TErrorScources = [
    {
      path: "",
      message: `${extracted_message} is already exists`,
    },
  ];

  const statusCode = 400;
  return {
    message: "duplicate key error",
    statusCode,
    errorSources,
  };
};

export default handleDuplicateKeyError;
