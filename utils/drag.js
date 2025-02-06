import { cleanupEmptySemesters } from "./cleanUpSemesters.js";
import { restoreOpacity } from "./restoreOpacity.js";
import { saveStateToLocalStorage } from "./localStorage.js";
import { clearErrorMessage, setErrorMessage } from "./errorHandling.js";
import { updateInfo } from "./updateInfo.js";
import { getCourseDependencies } from "./courseDependencies.js";

let draggedCourse = null;

export function getDraggedCourse()  {
    return draggedCourse;
}

export function setDraggedCourse(course) {
    draggedCourse = course;
}

export function dragStart(event) {
    draggedCourse = event.target;
    event.dataTransfer.setData('text/plain', event.target.id);

    // for reduced opacity 
    const allSemesterDivs = document.querySelectorAll('.semester');
    const draggedSquareSemesterType = draggedCourse.dataset.semester;
    allSemesterDivs.forEach(semesterDiv => {
        const isWinterSemesterDragStart = semesterDiv.dataset.number % 2 !== 0;
        
        // If the dragged course is 'summer' and the div represents 'winter', reduce opacity
        if (draggedSquareSemesterType === 'summer' && isWinterSemesterDragStart) {
            semesterDiv.style.opacity = '0.3'; // Reduce opacity of winter courses
        } 
        // If the dragged course is 'winter' and the div represents 'summer', reduce opacity
        else if (draggedSquareSemesterType === 'winter' && !isWinterSemesterDragStart) {
            semesterDiv.style.opacity = '0.3'; // Reduce opacity of summer courses
        } 
        // If the dragged course is 'both', don't alter opacity
        else if (draggedSquareSemesterType === 'both') {
            semesterDiv.style.opacity = '1'; // Ensure opacity is reset for both cases
        } 
        // Reset opacity for all other cases
        else {
            semesterDiv.style.opacity = '1';
        }
    });
};

export function dragOver(event) { 
    event.preventDefault();
    event.target.closest('.grid, #electives, #freie-wahl')?.classList.add('highlight');
};

export function drop(event) {
    event.preventDefault();

    restoreOpacity();

    const target = event.target.closest('.grid, #electives, #freie-wahl');

    if (!target || !draggedCourse) return;
    target.classList.remove('highlight');

    if (target.id === 'freie-wahl') {
        const isFreieWahl = draggedCourse.dataset.isFreieWahl === "true";

        if (!isFreieWahl) {
            setErrorMessage("Cannot put non Freie Wahl in Freie Wahl pool.");
            return;
        }

        target.appendChild(draggedCourse);
        draggedCourse = null;
        clearErrorMessage();
        updateInfo();

        saveStateToLocalStorage();
        return;
    }

    if (target.id === 'electives') {
        const isElective = draggedCourse.dataset.isElective === "true";
        if (!isElective) {
            setErrorMessage("Cannot put non elective in elective pool.");
            return;
        }

        // Move the course back to the electives pool
        target.appendChild(draggedCourse);
        draggedCourse = null;
        clearErrorMessage();
        updateInfo();

        // Save the state to localStorage
        saveStateToLocalStorage();
        return;
    }

    const targetSemesterDiv = target.closest('.semester');
    const semesterNumber = parseInt(targetSemesterDiv.dataset.number);
    const isWinterSemester = semesterNumber % 2 !== 0;
    const courseSemesterType = draggedCourse.dataset.semester;

    // Check if the course can be placed in the target semester based on its semester type
    if (
        (isWinterSemester && courseSemesterType === "summer") ||  // Winter semester but course is for summer
        (!isWinterSemester && courseSemesterType === "winter")    // Summer semester but course is for winter
    ) {
        console.warn(`Cannot move ${draggedCourse.dataset.name} to semester ${semesterNumber}. Semester type mismatch.`);
        setErrorMessage(`Cannot move ${draggedCourse.dataset.name} to semester ${semesterNumber}. Semester type mismatch.`);
        return;
    }

    // Extract prerequisites and credits needed for the course being moved
    const prerequisites = JSON.parse(draggedCourse.dataset.prerequisites);
    const creditsNeeded = parseInt(draggedCourse.dataset.credits_needed);

    // Get all previous semesters (semesters before the target semester)
    const previousSemesters = Array.from(document.querySelectorAll('.semester'))
        .filter(semester => parseInt(semester.dataset.number) < semesterNumber);

    const allSemesters = Array.from(document.querySelectorAll('.semester'));
    const allCourses = new Map();
    allSemesters.forEach((semester, semesterIndex) => {
        const coursesInSemester = semester.querySelectorAll('.course');
        coursesInSemester.forEach(course => {
            allCourses.set(course.dataset.short_name, semesterIndex + 1);
        });
    });

    // Track completed courses and total credits from previous semesters
    const completedCourses = new Set();
    let totalCreditsByPreviousSemester = 0;

    previousSemesters.forEach(semester => {
        const coursesInSemester = semester.querySelectorAll('.course');
        coursesInSemester.forEach(course => {
            completedCourses.add(course.dataset.short_name);

            // Ensure dataset.credits exists and is a valid number
            const courseCredits = parseInt(course.dataset.credits, 10);
            if (!isNaN(courseCredits)) {
                totalCreditsByPreviousSemester += courseCredits;
            } else {
                console.warn(`Invalid credits for course: ${course.dataset.short_name}`, course.dataset.credits);
            }
        });
    });

    // Check if prerequisites are met
    const prerequisitesMet = prerequisites.every(prerequisite => completedCourses.has(prerequisite));
    const missingPrerequisites = prerequisites.filter(prerequisite => !completedCourses.has(prerequisite));

    // Check if credits needed are met
    const gotNeededCredits = totalCreditsByPreviousSemester >= creditsNeeded;
    const creditDifference = creditsNeeded - totalCreditsByPreviousSemester;

    // If prerequisites or credits are not met, block the move
    if (!prerequisitesMet) {
        console.warn(`Cannot move ${draggedCourse.dataset.name} to semester ${semesterNumber}. Course prerequisites not met:  ${missingPrerequisites}`);
        setErrorMessage(`Cannot move ${draggedCourse.dataset.name} to semester ${semesterNumber}. Course prerequisites not met: ${missingPrerequisites}`);
        return;
    } else if (!gotNeededCredits) {
        console.warn(`Cannot move ${draggedCourse.dataset.name} to semester ${semesterNumber}. You need ${creditDifference} more credits.`);
        setErrorMessage(`Cannot move ${draggedCourse.dataset.name} to semester ${semesterNumber}. You need ${creditDifference} more credits.`);
        return;
    }

    // Check if the dragged course is a prerequisite for any other course
    const courseName = draggedCourse.dataset.short_name;
    const courseDependencies = getCourseDependencies();
    if (courseDependencies[courseName]) {
        for (const dependent of courseDependencies[courseName]) {
            if (!allCourses.has(dependent)) continue; // Skip if course not found

            const dependentSemester = allCourses.get(dependent);
            if (semesterNumber >= dependentSemester) {
                console.warn(`Moving ${courseName} will break prerequisites for ${dependent} (currently in semester ${dependentSemester})`);
                setErrorMessage(`Moving ${courseName} will break prerequisites for ${dependent}`);
                return;
            }
        }
    }

    // If all checks pass, move the course to the target semester
    target.appendChild(draggedCourse);
    draggedCourse = null;
    clearErrorMessage();

    // Check if the course was dropped into the last semester
    const lastSemester = document.querySelector('.semester:last-child');
    if (targetSemesterDiv === lastSemester) {
        // Create a new semester
        const newSemesterNumber = parseInt(lastSemester.dataset.number) + 1;
        const newSemesterDiv = document.createElement('div');
        newSemesterDiv.className = 'semester';
        newSemesterDiv.dataset.number = newSemesterNumber;

        const newSemesterTitle = document.createElement('p');
        newSemesterTitle.textContent = `${newSemesterNumber}. FS`;
        newSemesterDiv.appendChild(newSemesterTitle);

        const newGridDiv = document.createElement('div');
        newGridDiv.className = 'grid';
        newSemesterDiv.appendChild(newGridDiv);

        // Append the new semester to the semesters container
        semestersContainer.appendChild(newSemesterDiv);
        newGridDiv.addEventListener('dragleave', () => newGridDiv.classList.remove('highlight'));
        newGridDiv.addEventListener('dragover', dragOver);
        newGridDiv.addEventListener('drop', drop);
    }

    // Check and clean up empty semesters
    cleanupEmptySemesters();
    saveStateToLocalStorage();
    updateInfo();
}
