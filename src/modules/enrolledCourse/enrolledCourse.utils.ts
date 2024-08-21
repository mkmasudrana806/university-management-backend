/**
 * 80 - 100 = A: 4
 * 70 - 79 = B: 3.75
 * 60 - 69 = C: 3.5
 * 40 - 59 = D: 3.0
 * 0 - 39 = F
 */

/**
 *
 * @param totalMarks total marks of a course
 * @returns return return an object containing grade and gradePoints
 */
const calculateGradePoints = (totalMarks = 10) => {
  const result = {
    grade: "NA",
    gradePoints: 0,
  };

  if (totalMarks <= 100 && totalMarks >= 80) {
    result.grade = "A";
    result.gradePoints = 4.0;
  } else if (totalMarks < 80 && totalMarks >= 70) {
    result.grade = "B";
    result.gradePoints = 3.75;
  } else if (totalMarks < 70 && totalMarks >= 60) {
    result.grade = "C";
    result.gradePoints = 3.5;
  } else if (totalMarks < 60 && totalMarks >= 40) {
    result.grade = "D";
    result.gradePoints = 3.0;
  } else if (totalMarks < 40 && totalMarks >= 0) {
    result.grade = "F";
    result.gradePoints = 0;
  }

  return result;
};

export default calculateGradePoints;
