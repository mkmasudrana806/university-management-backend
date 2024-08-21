"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTimeConflict = void 0;
const hasTimeConflict = (assignedSchedule, newSchedule) => {
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);
    for (const schedule of assignedSchedule) {
        const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
        const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
        if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
            return true;
            break;
        }
    }
    return false;
};
exports.hasTimeConflict = hasTimeConflict;
