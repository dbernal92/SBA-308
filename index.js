// The provided course information.
const courseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

// The provided assignment group.
const assignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};

// The provided learner submission data.
const learnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];

// Create function getLearnerData
// With paramaters (CourseInfo, AssignmentGroup, [LearnerSubmission])

// Main tasks:
// Validate inputs
// Function to validate course ID
function validateCourse(courseInfo, assignmentGroup) {
    try {
        if (courseInfo.id !== assignmentGroup.course_id) {
            throw new Error("Course IDs do not match");
        }
        if (typeof courseInfo.id !== typeof assignmentGroup.course_id) {
            throw new Error("Course ID must be a number")
        }
        if ((!courseInfo.id) || (!assignmentGroup.course_id)) {
            throw new Error("Missing course ID")
        }
    } catch (error) {
        console.log("Please check course ID and try again");
    } finally {
        console.log("Course validation complete")
    }
}

// Function to validate assignment information
function validateAssignments(assignmentGroup) {
    try {
        // Validate assignments exist and are an array
        if (!assignmentGroup.assignments || !(assignmentGroup.assignments instanceof Array)) {
            throw new Error("Assignment information missing");
        }
        if (assignmentGroup.assignments.length === 0) {
            throw new Error("No assignments in group");
        }

        // Validate each assignment
        assignmentGroup.assignments.forEach(assignment => {
            if (!assignment.id || typeof assignment.id !== "number") {
                throw new Error("Assignment ID invalid");
            }
            if (!assignment.due_at || isNaN(Date.parse(assignment.due_at))) {
                throw new Error("Assignment date invalid");
            }
            if (typeof assignment.points_possible !== "number" || assignment.points_possible <= 0) {
                throw new Error("Assignment has invalid possible points.");
            }
        });
        console.log("Assignment validation complete");
    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        console.log("Finished checking assignment information");
    }
}

function filterDueDates(assignmentGroup) {
    // Ensure assignments exist and are an array
    if (!assignmentGroup.assignments || !(assignmentGroup.assignments instanceof Array)) {
        throw new Error("Assignments data is missing or invalid.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Sets to beginning of the day/midnight

    return assignmentGroup.assignments.filter(assignment => {
        const dueDate = new Date(assignment.due_at);
        return dueDate <= today; // Only keep assignments due today or earlier
    });
}

function applyLateDeduct(learnerSubmissions, assignmentGroup) {
    if (!(learnerSubmissions instanceof Array)) {
        throw new Error("Invalid learner submissions data.");
    }

    learnerSubmissions.forEach(submission => {
        // Find the matching assignment
        const assignment = assignmentGroup.assignments.find(a => a.id === submission.assignment_id);
        if (!assignment) return; // Skip if assignment is missing

        const dueDate = new Date(assignment.due_at);
        const submittedDate = new Date(submission.submission.submitted_at);

        let latePenalty = 0; // Default to no penalty
        if (submittedDate > dueDate) {
            latePenalty = assignment.points_possible * 0.10;
        }

        // Apply point deduction
        submission.submission.adjusted_score = Math.max(submission.submission.score - latePenalty, 0);
    });

    return learnerSubmissions;
}

function avgWeighted(learnerSubmissions, assignmentGroup) {
    if (!(learnerSubmissions instanceof Array)) {
        throw new Error("Invalid learner submission data.");
    }
    if (!assignmentGroup.assignments || !(assignmentGroup.assignments instanceof Array)) {
        throw new Error("Invalid assignment group data.");
    }

    const learnerScores = {};

    learnerSubmissions.forEach(submission => {
        const assignment = assignmentGroup.assignments.find(a => a.id === submission.assignment_id);
        if (!assignment) {
            return; // Skip if no matching assignment
        }
        if (assignment.points_possible <= 0) {
            return; // Skip if points_possible is 0 or negative
        }
        if (!submission.submission || typeof submission.submission.score !== "number") {
            return; // Skip if submission is missing or invalid
        }

        const adjustedScore = submission.submission.adjusted_score || submission.submission.score;
        const weight = assignment.points_possible;

        if (!(submission.learner_id in learnerScores)) {
            learnerScores[submission.learner_id] = { 
                totalWeightedScore: 0, 
                totalPossiblePoints: 0,
                assignmentScores: {} 
            };
        }

        learnerScores[submission.learner_id].totalWeightedScore += adjustedScore * weight;
        learnerScores[submission.learner_id].totalPossiblePoints += weight;
        learnerScores[submission.learner_id].assignmentScores[assignment.id] = (adjustedScore / weight) * 100;
    });

    const formattedResults = [];

    Object.entries(learnerScores).forEach(([learner_id, data]) => {
        const result = {
            id: Number(learner_id)
        };

        if (data.totalPossiblePoints > 0) {
            result.avg = (data.totalWeightedScore / data.totalPossiblePoints) * 100;
        } else {
            result.avg = 0;
        }

        Object.assign(result, data.assignmentScores);
        formattedResults.push(result);
    });

    return formattedResults;
}

function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    // Validate course and assignment data
    validateCourse(courseInfo, assignmentGroup);
    validateAssignments(assignmentGroup);

    // Create a new object manually instead of modifying the original
    const filteredAssignments = {
        course_id: assignmentGroup.course_id,
        assignments: filterDueDates(assignmentGroup) // Only keep past-due assignments
    };

    // Apply late penalties
    const updatedSubmissions = applyLateDeduct(learnerSubmissions, filteredAssignments);

    // Compute weighted averages and return final results
    return avgWeighted(updatedSubmissions, filteredAssignments);
}
