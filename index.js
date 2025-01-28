// Create function getLearnerData
// With paramaters (CourseInfo, AssignmentGroup, [LearnerSubmission])

// Main tasks:
// Validate inputs
validateData()
// Filter assignments that aren't due yet
filterDueAssignments()
// Apply late penalties
applyLatePenalties()
// Calculate learner weighted average scores
calculateLearnerScores()
// Format and return output

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);