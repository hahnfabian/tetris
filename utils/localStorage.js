import { attachEventListenersToCourse, attachEventListenersToGrid } from "./attachListeners.js";
import { updateInfo } from "./updateInfo.js";
import { courses } from "../data/courses.js";

let saveTimeout;
export function saveStateToLocalStorage() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const semesters = Array.from(document.querySelectorAll('.semester'));
        const state = semesters.map(semester => {
            const courses = Array.from(semester.querySelectorAll('.course')).map(course => {
                // console.log("Saving:", course.id, course.classList.value);
                return {
                    id: course.id,
                    short_name: course.dataset.short_name,
                    name: course.dataset.name,
                    credits: course.dataset.credits,
                    credits_needed: course.dataset.credits_needed,
                    semester: course.dataset.semester,
                    intendedSemester: course.dataset.intendedSemester,
                    prerequisites: JSON.parse(course.dataset.prerequisites || "[]"),
                    isElective: course.dataset.isElective === "true",
                    color: course.style.backgroundColor,
                    isFreieWahl: course.dataset.isFreieWahl === "true",
                    classnames: course.classList.value
                };
            });
            return {
                number: semester.dataset.number,
                courses: courses
            };
        });

        localStorage.setItem('coursePlannerState', JSON.stringify(state));
        // console.log("State saved:", state);
    }, 200); // Adjust delay if needed
}



export function loadStateFromLocalStorage() {
    const state = localStorage.getItem('coursePlannerState');
    if (!state) return; // No saved state found

    const semestersData = JSON.parse(state);

    // Clear existing semesters
    const semestersContainer = document.getElementById('semesters');
    semestersContainer.innerHTML = '';

    // Track which electives are already placed in semesters
    const placedElectives = new Set();

    // Recreate semesters and courses from the saved state
    semestersData.forEach(semesterData => {
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'semester';
        semesterDiv.dataset.number = semesterData.number;

        const semesterTitle = document.createElement('p');
        semesterTitle.textContent = `${semesterData.number}. FS`;
        semesterDiv.appendChild(semesterTitle);

        const gridDiv = document.createElement('div');
        gridDiv.className = 'grid';
        semesterDiv.appendChild(gridDiv);

        // Add courses to the grid
        semesterData.courses.forEach(courseData => {
            const courseSquare = document.createElement('div');
            courseSquare.className = courseData.classnames;
            courseSquare.style.setProperty('--credits', courseData.credits / 3);
            courseSquare.textContent = courseData.short_name;
            courseSquare.draggable = true;
            courseSquare.id = courseData.id;
            courseSquare.style.backgroundColor = courseData.color;

            courseSquare.dataset.short_name = courseData.short_name;
            courseSquare.dataset.name = courseData.name;
            courseSquare.dataset.credits = courseData.credits;
            courseSquare.dataset.credits_needed = courseData.credits_needed;
            courseSquare.dataset.semester = courseData.semester;
            courseSquare.dataset.intendedSemester = courseData.intendedSemester;
            courseSquare.dataset.prerequisites = JSON.stringify(courseData.prerequisites);
            courseSquare.dataset.isElective = courseData.isElective;
            courseSquare.dataset.isFreieWahl = courseData.isFreieWahl;

            // Drag and Drop event listeners
            attachEventListenersToCourse(courseSquare);

            gridDiv.appendChild(courseSquare);

            // Track electives placed in semesters
            if (courseData.isElective === 'true') {
                placedElectives.add(courseData.short_name);
            }
        });

        semestersContainer.appendChild(semesterDiv);
        updateInfo();
    });

    // Reset electives pool, excluding placed electives
    const electivesDiv = document.getElementById('electives');
    electivesDiv.innerHTML = ''; // Clear all electives

    const electivesCourses = courses.filter(course => course.elective === true && !placedElectives.has(course.short_name));
    electivesCourses.forEach(course => {
        const credits = course.credits / 3; // Each square represents 3 credits
        const courseSquare = document.createElement('div');
        courseSquare.className = 'square course course-joined';
        courseSquare.style.setProperty('--credits', credits);
        courseSquare.textContent = course.short_name;
        courseSquare.draggable = true;
        courseSquare.id = `course-${course.id}`; // Unique ID for each course
        courseSquare.style.backgroundColor = course.color;

        courseSquare.dataset.short_name = course.short_name;
        courseSquare.dataset.name = course.name;
        courseSquare.dataset.credits = course.credits;
        courseSquare.dataset.credits_needed = course.credits_needed;
        courseSquare.dataset.semester = course.semester;
        courseSquare.dataset.intendedSemester = course.intended_semester;
        courseSquare.dataset.prerequisites = JSON.stringify(course.prerequisites);
        courseSquare.dataset.isElective = course.elective;
        courseSquare.dataset.isFreieWahl = false;

        // Drag and Drop event listeners
        attachEventListenersToCourse(courseSquare);

        electivesDiv.appendChild(courseSquare);
    });

    // Add event listeners to the new grids
    document.querySelectorAll('.grid').forEach(grid => {
        attachEventListenersToGrid(grid);
    });
}