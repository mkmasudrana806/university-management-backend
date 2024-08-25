"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * @param allowedFields allowedFields array like ["name", "email", "phone"]
 * @param payload payload to update
 * @purpose make any payload data into allowedFields data object
 * @returns return an object containing only allowed fields to update
 */
const makeUpdatedData = (allowedFields, payload) => {
    const updatedData = {};
    for (const key of allowedFields) {
        if (payload[key]) {
            updatedData[key] = payload[key];
        }
    }
    return updatedData;
};
exports.default = makeUpdatedData;
