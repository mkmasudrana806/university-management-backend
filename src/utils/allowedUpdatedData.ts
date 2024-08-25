/**
 *
 * @param allowedFields allowedFields array like ["name", "email", "phone"]
 * @param payload payload to update
 * @purpose make any payload data into allowedFields data object
 * @returns return an object containing only allowed fields to update
 */
const makeUpdatedData = <T>(
  allowedFields: (keyof T)[],
  payload: Partial<T>
) => {
  const updatedData: Partial<T> = {};
  for (const key of allowedFields) {
    if (payload[key]) {
      updatedData[key] = payload[key];
    }
  }
  return updatedData;
};

export default makeUpdatedData;
