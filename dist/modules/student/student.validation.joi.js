"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
// create a student controller: joi validation
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // joi validation schema
        const userNameSchema = joi_1.default.object({
            firstName: joi_1.default.string().max(20).trim().required(),
            middleName: joi_1.default.string().trim().allow(""),
            lastName: joi_1.default.string().trim().required(),
        });
        // Define the guardian schema
        const guardianSchema = joi_1.default.object({
            fatherName: joi_1.default.string().trim().required(),
            fatherContactNo: joi_1.default.string().trim().required(),
            fatherOccupation: joi_1.default.string().trim().allow(""),
            motherName: joi_1.default.string().trim().required(),
            motherContactNo: joi_1.default.string().trim().required(),
            motherOccupation: joi_1.default.string().trim().allow(""),
        });
        // Define the local guardian schema
        const localGuardianSchema = joi_1.default.object({
            name: joi_1.default.string().trim().required(),
            occupation: joi_1.default.string().trim().allow(""),
            contactNo: joi_1.default.string().trim().allow(""),
            address: joi_1.default.string().trim().allow(""),
        });
        // Define the student schema
        const studentSchemaJoi = joi_1.default.object({
            id: joi_1.default.string().optional(),
            name: userNameSchema.required(),
            gender: joi_1.default.string().valid("male", "female", "other").required(),
            dateOfBirth: joi_1.default.string().optional(),
            email: joi_1.default.string().trim().required().email(),
            contactNo: joi_1.default.string().trim().required(),
            emergencyContactNo: joi_1.default.string().trim().required(),
            bloodGroup: joi_1.default.string()
                .valid("A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-")
                .optional(),
            presentAddress: joi_1.default.string().trim().required(),
            permanentAddress: joi_1.default.string().trim().required(),
            guardian: guardianSchema.required(),
            localGuardian: localGuardianSchema.required(),
            profileImg: joi_1.default.string().optional(),
            isActive: joi_1.default.string().valid("active", "blocked").default("active"),
        });
    }
    catch (error) {
    }
});
