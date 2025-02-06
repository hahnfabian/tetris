import { courses } from './data/courses.js';
import { updateInfo } from './utils/updateInfo.js'
import {attachEventListenersToCourse, attachEventListenersToGrid}  from './utils/attachListeners.js'
import { showCourseDetails } from './utils/overlay.js';
import { loadStateFromLocalStorage } from './utils/localStorage.js';
import { dragOver, dragStart, drop } from './utils/drag.js';
import { restoreOpacity } from './utils/restoreOpacity.js';
import { clearPlanner } from './utils/clearPlanner.js';
import { calculateCourseDependencies } from './utils/courseDependencies.js';

const overlay = document.getElementById('overlay');
const closeOverlayButton = document.getElementById('closeOverlay');

// Show the overlay when the open button is clicked

// Hide the overlay when the close button is clicked
closeOverlayButton.addEventListener('click', () => {
    overlay.style.display = 'none';
});

// Close the overlay when clicking outside of the content area
overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
        overlay.style.display = 'none';
    }
});

// Close the overlay when the Escape key is pressed
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        overlay.style.display = 'none';
    }
});

calculateCourseDependencies(courses);



const freieWahlContainer = document.getElementById('freie-wahl');
const freieWahlNameInput = document.getElementById('freie-wahl-name');
const freieWahlCreditsInput = document.getElementById('freie-wahl-credits');
const addFreieWahlButton = document.getElementById('add-freie-wahl');

function addFreieWahlClass(name, credits) {
    if (!name || credits <= 0) {
        return;
    }

    const courseSquare = document.createElement('div');
    courseSquare.className = 'square course course-joined';
    courseSquare.style.setProperty('--credits', credits/3); 
    courseSquare.textContent = `${name} (${credits} LP)`;
    courseSquare.draggable = true;
    courseSquare.id = `course-freiewahl-${Math.random().toString(36).substr(2, 9)}`;
    courseSquare.style.backgroundColor = '#ffcc82';

    // Store data attributes
    Object.entries({
        short_name: name,
        name: name,
        credits: credits,
        credits_needed: 0,
        semester: 'both',
        intendedSemester: null,
        prerequisites: "[]",
        isElective: false,
        isFreieWahl: true
    }).forEach(([key, value]) => courseSquare.dataset[key] = value);

    // Drag and Drop event listeners
    courseSquare.addEventListener('dragstart', dragStart);
    courseSquare.addEventListener('dragover', dragOver);
    courseSquare.addEventListener('drop', drop);

    courseSquare.addEventListener('click', () => {
        showCourseDetails(courseSquare);
    });



    freieWahlContainer.appendChild(courseSquare);

    // Clear input fields after adding
    freieWahlNameInput.value = "";
    freieWahlCreditsInput.value = "";
}

// Event listener for adding new courses
addFreieWahlButton.addEventListener('click', () => {
    const name = freieWahlNameInput.value.trim();
    const credits = parseInt(freieWahlCreditsInput.value, 10);
    addFreieWahlClass(name, credits);
});

// Drag and Drop event listeners for container
freieWahlContainer.addEventListener('dragover', dragOver);
freieWahlContainer.addEventListener('drop', drop);
freieWahlContainer.addEventListener('dragleave', () => freieWahlContainer.classList.remove('highlight'));


// Freie Wahl #ffcc82
const freieWahlContainer2 = document.getElementById('freie-wahl');
for (let freieWahlGröße = 1; freieWahlGröße <= 3; freieWahlGröße++) {
    const courseSquare = document.createElement('div');
    courseSquare.className = 'square course course-joined';
    courseSquare.style.setProperty('--credits', freieWahlGröße); 
    courseSquare.textContent = `${freieWahlGröße*3} LP`;
    courseSquare.draggable = true;
    courseSquare.id = `course-freiewahl-${Math.random().toString(36).substr(2, 9)}`;
    courseSquare.style.backgroundColor = '#ffcc82'

    courseSquare.dataset.short_name = `${freieWahlGröße*3} LP`;
    courseSquare.dataset.name = `Freie Wahl ${freieWahlGröße*3} LP`;
    courseSquare.dataset.credits = freieWahlGröße*3;
    courseSquare.dataset.credits_needed = 0;
    courseSquare.dataset.semester = 'both';
    courseSquare.dataset.intendedSemester = null;
    courseSquare.dataset.prerequisites = "[]";
    courseSquare.dataset.isElective = false;
    courseSquare.dataset.isFreieWahl = true;


    // Drag and Drop event listeners
    courseSquare.addEventListener('dragstart', dragStart);
    courseSquare.addEventListener('dragover', dragOver);
    courseSquare.addEventListener('drop', drop);

    courseSquare.addEventListener('click', () => {
        showCourseDetails(courseSquare);
    });

    freieWahlContainer2.appendChild(courseSquare);
}
freieWahlContainer2.addEventListener('dragover', dragOver);
freieWahlContainer2.addEventListener('drop', drop);
freieWahlContainer2.addEventListener('dragleave', () => freieWahlContainer2.classList.remove('highlight'));




const semestersContainer = document.getElementById('semesters');

// Create a mapping of each course to the courses that depend on it


// Create a grid for each semester (1 to 6)
for (let semester = 1; semester <= 7; semester++) {
    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semester';

    semesterDiv.dataset.number = semester;

    const semesterTitle = document.createElement('p');
    semesterTitle.textContent = `${semester}. FS`;
    semesterDiv.appendChild(semesterTitle);

    const gridDiv = document.createElement('div');
    gridDiv.className = 'grid';

    // Add courses to the grid
    const semesterCourses = courses.filter(course => course.intended_semester === semester);
    semesterCourses.forEach(course => {
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
        courseSquare.addEventListener('dragstart', dragStart);
        courseSquare.addEventListener('dragover', dragOver);
        courseSquare.addEventListener('drop', drop);

        // Add click event listener to open overlay with course details
        courseSquare.addEventListener('click', () => {
            showCourseDetails(courseSquare);
        });

        gridDiv.appendChild(courseSquare);
    });

    semesterDiv.appendChild(gridDiv);
    semestersContainer.appendChild(semesterDiv);
}


function getPlacedCourses() {
    const placedCourses = new Set();
    document.querySelectorAll('.semester .course').forEach(course => {
        placedCourses.add(course.dataset.short_name);
    });
    return placedCourses;
}

// Space for electives
const electivesDiv = document.getElementById('electives');
const electivesCourses = courses.filter(course => course.elective === true);

function renderElectives(filter = 'all') {
    electivesDiv.innerHTML = ''; // Clear existing electives
    const placedCourses = getPlacedCourses(); // Get currently placed courses

    electivesCourses.forEach(course => {
        const isSummer = course.semester.includes('summer');
        const isWinter = course.semester.includes('winter');

        if (
            !placedCourses.has(course.short_name) && // Only add if not placed in a semester
            (filter === 'all' || (filter === 'summer' && isSummer) || (filter === 'winter' && isWinter))
        ) {
            const credits = course.credits / 3;
            const courseSquare = document.createElement('div');
            courseSquare.className = 'square course course-joined';
            courseSquare.style.setProperty('--credits', credits);
            courseSquare.textContent = course.short_name;
            courseSquare.draggable = true;
            courseSquare.id = `course-${course.id}`;
            courseSquare.style.backgroundColor = course.color;

            // Store course data as dataset attributes
            Object.entries({
                short_name: course.short_name,
                name: course.name,
                credits: course.credits,
                credits_needed: course.credits_needed,
                semester: course.semester,
                intendedSemester: course.intended_semester,
                prerequisites: JSON.stringify(course.prerequisites),
                isElective: course.elective
            }).forEach(([key, value]) => courseSquare.dataset[key] = value);

            // Drag and Drop event listeners
            courseSquare.addEventListener('dragstart', dragStart);
            courseSquare.addEventListener('dragover', dragOver);
            courseSquare.addEventListener('drop', drop);

            courseSquare.addEventListener('click', () => {
                showCourseDetails(courseSquare);
            });

            electivesDiv.appendChild(courseSquare);
        }
    });
}
document.getElementById('button-container').addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON' && event.target.dataset.filter) {
        renderElectives(event.target.dataset.filter);
    }
});
renderElectives();

electivesDiv.addEventListener('dragover', dragOver);
electivesDiv.addEventListener('drop', drop);
electivesDiv.addEventListener('dragleave', () => electivesDiv.classList.remove('highlight'));




document.querySelectorAll('.grid').forEach(grid => {
    grid.addEventListener('dragleave', () => grid.classList.remove('highlight'));
    grid.addEventListener('dragover', dragOver);
    grid.addEventListener('drop', drop);
    document.addEventListener('dragend', restoreOpacity);
});

let draggedCourse = null;



















updateInfo();


//local storage
// function saveStateToLocalStorage() {
//     const semesters = Array.from(document.querySelectorAll('.semester'));
//     const state = semesters.map(semester => {
//         const courses = Array.from(semester.querySelectorAll('.course')).map(course => {
//             console.log(course.id + " " + course.classList.value)
//             return {
//                 id: course.id,
//                 short_name: course.dataset.short_name,
//                 name: course.dataset.name,
//                 credits: course.dataset.credits,
//                 credits_needed: course.dataset.credits_needed,
//                 semester: course.dataset.semester,
//                 intendedSemester: course.dataset.intendedSemester,
//                 prerequisites: JSON.parse(course.dataset.prerequisites),
//                 isElective: course.dataset.isElective,
//                 color: course.style.backgroundColor,
//                 isFreieWahl: course.dataset.isFreieWahl,
//                 classnames: course.classList.value
//             };
//         });
//         return {
//             number: semester.dataset.number,
//             courses: courses
//         };
//     });

//     // Save the state to localStorage
//     localStorage.setItem('coursePlannerState', JSON.stringify(state));
// }





document.addEventListener('DOMContentLoaded', () => {
    loadStateFromLocalStorage();

    // Attach event listeners to all grids and courses
    document.querySelectorAll('.grid').forEach(grid => {
        attachEventListenersToGrid(grid);
    });

    document.querySelectorAll('.course').forEach(course => {
        attachEventListenersToCourse(course);
    });

    // Add event listener to the clear button
    const clearButton = document.getElementById('clear-button');
    clearButton.addEventListener('click', clearPlanner);
});


