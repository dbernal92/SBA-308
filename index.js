// The provided course information.
const courseInfo = [
    {
        id: 451,
        name: "Introduction to JavaScript"
    },
    {
        id: 789,
        name: "Advanced JavaScript"
    }
];

// The provided assignment group.
const assignmentGroup = [
    {
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
                due_at: "3156-11-15", // Future date, should be ignored
                points_possible: 500
            },
            {
                id: 4,
                name: "Final Project",
                due_at: "2024-01-29", // Due today
                points_possible: 300
            }
        ]
    },
    {
        id: 67890,
        name: "Advanced JavaScript Challenges",
        course_id: 789,
        group_weight: 30,
        assignments: [
            {
                id: 10,
                name: "Async Await",
                due_at: "2024-01-20",
                points_possible: 200
            },
            {
                id: 11,
                name: "Closures & Scope",
                due_at: "2024-01-10",
                points_possible: 100
            },
            {
                id: 12,
                name: "Higher-Order Functions",
                due_at: "2024-02-01",
                points_possible: 250 // Future assignment, should be ignored
            }
        ]
    }
];

// The provided learner submission data.
const learnerSubmissions = [
    // JavaScript Course Learners
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07", // Late submission, should apply 10% penalty
            score: 140
        }
    },
    {
        learner_id: 150, // New learner with an assignment submitted late
        assignment_id: 4,
        submission: {
            submitted_at: "2024-01-30", // Late by one day
            score: 270
        }
    },
    // Advanced JavaScript Course Learners
    {
        learner_id: 200,
        assignment_id: 10,
        submission: {
            submitted_at: "2024-01-19",
            score: 180
        }
    },
    {
        learner_id: 205,
        assignment_id: 11,
        submission: {
            submitted_at: "2024-01-11", // Late by one day
            score: 90
        }
    },
    {
        learner_id: 210,
        assignment_id: 12,
        submission: {
            submitted_at: "2024-01-31",
            score: 220 // Future assignment, should be ignored
        }
    }
];

// Function to validate course ID
function validateCourse(courseInfo, assignmentGroup) {
    try {
        if (!courseInfo || !assignmentGroup) {
            throw new Error("Course information or assignment group is missing.");
        }
        if (!courseInfo.id || !assignmentGroup.course_id) {
            throw new Error("Missing course ID.");
        }
        if (courseInfo.id !== assignmentGroup.course_id) {
            throw new Error("Course IDs do not match.");
        }
    } catch (error) {
        console.log("Error: Please review and try again.");
    } finally {
        console.log("Course validation complete.");
    }
}

// Function to validate assignment information
function validateAssignments(assignmentGroup) {
    try {
        if (!assignmentGroup.assignments || !(assignmentGroup.assignments instanceof Array)) {
            throw new Error("Assignment information missing.");
        }
        if (assignmentGroup.assignments.length === 0) {
            throw new Error("No assignments in group.");
        }

        assignmentGroup.assignments.forEach(assignment => {
            if (!assignment.id || typeof assignment.id !== "number") {
                throw new Error("Assignment ID invalid.");
            }
            if (!assignment.due_at || isNaN(Date.parse(assignment.due_at))) {
                throw new Error("Assignment date invalid.");
            }
            if (typeof assignment.points_possible !== "number" || assignment.points_possible <= 0) {
                throw new Error("Assignment has invalid possible points.");
            }
        });
        console.log("Assignment validation complete");
    } catch (error) {
        console.log("Error: Please review and try again");
    } finally {
        console.log("Finished checking assignment information.");
    }
}

// Function to filter out assignments that are not yet due
function filterDueDates(assignmentGroup) {
    if (!assignmentGroup.assignments || !(assignmentGroup.assignments instanceof Array)) {
        throw new Error("Assignments data is missing or invalid."); // Set to beginning of day/midnight
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return assignmentGroup.assignments.filter(assignment => {
        if (!assignment.due_at || isNaN(Date.parse(assignment.due_at))) {
            return false;
        }
        const dueDate = new Date(assignment.due_at);
        return dueDate <= today;
    });
}

// Function to apply late penalties (10% deduction)
function applyLateDeduct(learnerSubmissions, assignmentGroup) {
    if (!(learnerSubmissions instanceof Array)) {
        throw new Error("Invalid learner submissions data.");
    }

    learnerSubmissions.forEach(submission => {
        const assignment = assignmentGroup.assignments.find(a => a.id === submission.assignment_id);
        if (!assignment || !submission.submission || !submission.submission.submitted_at) {
            return;
        }

        const dueDate = new Date(assignment.due_at);
        const submittedDate = new Date(submission.submission.submitted_at);

        let latePenalty = 0;
        if (submittedDate > dueDate) {
            latePenalty = assignment.points_possible * 0.10;
        }

        submission.submission.adjusted_score = Math.max(submission.submission.score - latePenalty, 0);
    });

    return learnerSubmissions;
}

// Function to calculate weighted averages
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
        if (!assignment || assignment.points_possible <= 0 || !submission.submission || typeof submission.submission.score !== "number") {
            return;
        }

        const adjustedScore = submission.submission.adjusted_score || submission.submission.score;

        if (!(submission.learner_id in learnerScores)) {
            learnerScores[submission.learner_id] = { 
                totalWeightedScore: 0, 
                totalPossiblePoints: 0,
                assignmentScores: {} 
            };
        }

        learnerScores[submission.learner_id].totalWeightedScore += adjustedScore;
        learnerScores[submission.learner_id].totalPossiblePoints += assignment.points_possible;
        learnerScores[submission.learner_id].assignmentScores[assignment.id] = (adjustedScore / assignment.points_possible) * 100;

    });

    const formattedResults = [];

    for (const learner_id in learnerScores) {
        const data = learnerScores[learner_id];

        console.log(`Processing Learner: ${learner_id}`);
        console.log(`Total Weighted Score: ${data.totalWeightedScore}`);
        console.log(`Total Possible Points: ${data.totalPossiblePoints}`);

        let avgScore = 0;
        if (data.totalPossiblePoints > 0) {
            avgScore = (data.totalWeightedScore / data.totalPossiblePoints) * 100;
        }

        console.log(`Computed Avg: ${avgScore}`); // Debugging line

        const result = { id: Number(learner_id), avg: avgScore };

        for (const key in data.assignmentScores) {
            result[key] = data.assignmentScores[key];
        }

        formattedResults.push(result);
    }

    return formattedResults;
}

// Main function to process learner data
function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    // Validate course and assignment data
    validateCourse(courseInfo, assignmentGroup);
    validateAssignments(assignmentGroup);

    // Create a new object manually instead of modifying the original
    const filteredAssignments = {
        id: assignmentGroup.id,
        name: assignmentGroup.name,
        course_id: assignmentGroup.course_id,
        group_weight: assignmentGroup.group_weight,
        assignments: filterDueDates(assignmentGroup) // Only keep past-due assignments
    };

    // Apply late penalties
    const updatedSubmissions = applyLateDeduct(learnerSubmissions, filteredAssignments);
    
    // Compute weighted averages and return final results
    return avgWeighted(updatedSubmissions, filteredAssignments);
}

// Call getLearnerData for each course to test both in desired format
console.log(getLearnerData(courseInfo[0], assignmentGroup[0], learnerSubmissions));
console.log(getLearnerData(courseInfo[1], assignmentGroup[1], learnerSubmissions));
