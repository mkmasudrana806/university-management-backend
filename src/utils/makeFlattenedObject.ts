type TFlattenedObject = {
  [key: string]: any;
};

/**
 * make any nested non-primitive object to flattened object
 *
 * @param obj non-primitive object to be flattened
 * @param parentKey optional, by default empty string: ""
 * @param result optional, by default empty object: {}
 * @returns
 */
const makeFlattenedObject = (
  obj: TFlattenedObject,
  parentKey: string = "",
  result: TFlattenedObject = {}
): TFlattenedObject => {
  for (const key in obj) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    if (
      typeof obj[key] === "object" &&
      !Array.isArray(obj[key]) &&
      obj[key] !== null
    ) {
      makeFlattenedObject(obj[key], fullKey, result);
    } else {
      result[fullKey] = obj[key];
    }
  }
  return result;
};

export default makeFlattenedObject;
