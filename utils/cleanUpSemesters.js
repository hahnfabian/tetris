 // Function to check and remove excess empty semesters
export function cleanupEmptySemesters() {
    const semesters = Array.from(document.querySelectorAll('.semester'));
    let lastNonEmptyIndex = -1;

    // Find the last non-empty semester
    for (let i = semesters.length - 1; i >= 0; i--) {
        const semester = semesters[i];
        const coursesInSemester = semester.querySelectorAll('.course');
        if (coursesInSemester.length > 0) {
            lastNonEmptyIndex = i;
            break;
        }
    }

    // Remove all empty semesters after the last non-empty one, except one
    for (let i = semesters.length - 1; i > lastNonEmptyIndex + 1; i--) {
        semesters[i].remove();
    }
}
