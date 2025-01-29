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