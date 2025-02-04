import {courses} from './data/courses.js';

// Freie Wahl #ffcc82
const freieWahlContainer = document.getElementById('freie-wahl');
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

    freieWahlContainer.appendChild(courseSquare);
}
freieWahlContainer.addEventListener('dragover', dragOver);
freieWahlContainer.addEventListener('drop', drop);
freieWahlContainer.addEventListener('dragleave', () => freieWahlContainer.classList.remove('highlight'));




const semestersContainer = document.getElementById('semesters');

// Create a mapping of each course to the courses that depend on it
const courseDependencies = {};
courses.forEach(course => {
    course.prerequisites.forEach(prerequisite => {
        if (!courseDependencies[prerequisite]) {
            courseDependencies[prerequisite] = [];
        }
        courseDependencies[prerequisite].push(course.short_name);
    });
});

// Create a grid for each semester (1 to 6)
for (let semester = 1; semester <= 7; semester++) {
    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semester';

    semesterDiv.dataset.number = semester

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
        courseSquare.style.backgroundColor = course.color


        courseSquare.dataset.short_name = course.short_name;
        courseSquare.dataset.name = course.name;
        courseSquare.dataset.credits = course.credits;
        courseSquare.dataset.credits_needed = course.credits_needed;
        courseSquare.dataset.semester = course.semester;
        courseSquare.dataset.intendedSemester = course.intended_semester;
        courseSquare.dataset.prerequisites = JSON.stringify(course.prerequisites);
        courseSquare.dataset.isElective = course.elective;

        // Drag and Drop event listeners
        courseSquare.addEventListener('dragstart', dragStart);
        courseSquare.addEventListener('dragover', dragOver);
        courseSquare.addEventListener('drop', drop);

        gridDiv.appendChild(courseSquare);
    });

    semesterDiv.appendChild(gridDiv);
    semestersContainer.appendChild(semesterDiv);
}

// Space for electives
const electivesDiv = document.getElementById('electives');
const electivesCourses = courses.filter(course => course.elective === true);
electivesCourses.forEach(course => {
    const credits = course.credits / 3; // Each square represents 3 credits
    const courseSquare = document.createElement('div');
    courseSquare.className = 'square course course-joined';
    courseSquare.style.setProperty('--credits', credits); 
    courseSquare.textContent = course.short_name;
    courseSquare.draggable = true;
    courseSquare.id = `course-${course.id}`; // Unique ID for each course

    courseSquare.style.backgroundColor = course.color

    courseSquare.dataset.short_name = course.short_name;
    courseSquare.dataset.name = course.name;
    courseSquare.dataset.credits = course.credits;
    courseSquare.dataset.credits_needed = course.credits_needed;
    courseSquare.dataset.semester = course.semester;
    courseSquare.dataset.intendedSemester = course.intended_semester;
    courseSquare.dataset.prerequisites = JSON.stringify(course.prerequisites);
    courseSquare.dataset.isElective = course.elective;


    // Drag and Drop event listeners
    courseSquare.addEventListener('dragstart', dragStart);
    courseSquare.addEventListener('dragover', dragOver);
    courseSquare.addEventListener('drop', drop);

    electivesDiv.appendChild(courseSquare);
});

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

function dragStart(event) {
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
}

function restoreOpacity() {
    const allSemesterDivs = document.querySelectorAll('.semester');
    allSemesterDivs.forEach(semesterDiv => {semesterDiv.style.opacity = '1';});
}


function dragOver(event) { 
    event.preventDefault();
    event.target.closest('.grid, #electives, #freie-wahl')?.classList.add('highlight');
}

function drop(event) {
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
    updateInfo();

    

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
}



// Function to check and remove excess empty semesters
function cleanupEmptySemesters() {
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


function setErrorMessage(msg) {
  const errorDiv = document.getElementById('error-message');
  if (msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block'; // Show the error message div
  } else {
    errorDiv.style.display = 'none'; // Hide the error message div
  }
}


function clearErrorMessage() {
  setErrorMessage(''); // Clears the message by passing an empty string
}


function updateInfo() {
    const infoDiv = document.getElementById('info-message')

    const semesters = Array.from(document.querySelectorAll('.semester'));
    let totalCredits = 0;

    semesters.forEach(semester => {
        const coursesInSemester = semester.querySelectorAll('.course');
        coursesInSemester.forEach(course => {
            const courseCredits = parseInt(course.dataset.credits, 10);
            if (!isNaN(courseCredits)) {
                totalCredits += courseCredits;
            } else {
                console.warn(`Invalid credits for course: ${course.dataset.short_name}`, course.dataset.credits);
            }
        });
    });

    const differenceAbsolute = Math.abs(180 - totalCredits)

    console.log(`Total Credits: ${totalCredits}, differnece abs: ${differenceAbsolute}`)

    if (totalCredits === 180) {
        infoDiv.textContent = "You have all necessary Credits."
    } else if (totalCredits < 180) {
        infoDiv.textContent = `You have ${totalCredits} Credits and need ${differenceAbsolute} more.`
    } else if (totalCredits > 180) {
        infoDiv.textContent = `You have ${totalCredits} Credits which is ${differenceAbsolute} more than you need.`
    }
    
    infoDiv.style.display = 'block'; // Show the error message div
}
updateInfo();


//local storage
function saveStateToLocalStorage() {
    const semesters = Array.from(document.querySelectorAll('.semester'));
    const state = semesters.map(semester => {
        const courses = Array.from(semester.querySelectorAll('.course')).map(course => {
            return {
                id: course.id,
                short_name: course.dataset.short_name,
                name: course.dataset.name,
                credits: course.dataset.credits,
                credits_needed: course.dataset.credits_needed,
                semester: course.dataset.semester,
                intendedSemester: course.dataset.intendedSemester,
                prerequisites: JSON.parse(course.dataset.prerequisites),
                isElective: course.dataset.isElective,
                color: course.style.backgroundColor
            };
        });
        return {
            number: semester.dataset.number,
            courses: courses
        };
    });

    // Save the state to localStorage
    localStorage.setItem('coursePlannerState', JSON.stringify(state));
}

function loadStateFromLocalStorage() {
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
            courseSquare.className = 'square course course-joined';
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

            // Drag and Drop event listeners
            attachEventListenersToCourse(courseSquare);

            gridDiv.appendChild(courseSquare);

            // Track electives placed in semesters
            if (courseData.isElective === 'true') {
                placedElectives.add(courseData.short_name);
            }
        });

        semestersContainer.appendChild(semesterDiv);
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

        // Drag and Drop event listeners
        attachEventListenersToCourse(courseSquare);

        electivesDiv.appendChild(courseSquare);
    });

    // Add event listeners to the new grids
    document.querySelectorAll('.grid').forEach(grid => {
        attachEventListenersToGrid(grid);
    });
}


//clear 
function clearPlanner() {
    // Clear localStorage
    localStorage.removeItem('coursePlannerState');

    // Reset the UI to its initial state
    const semestersContainer = document.getElementById('semesters');
    semestersContainer.innerHTML = ''; // Clear all semesters

    // Reinitialize the semesters
    for (let semester = 1; semester <= 7; semester++) {
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'semester';
        semesterDiv.dataset.number = semester;

        const semesterTitle = document.createElement('p');
        semesterTitle.textContent = `${semester}. FS`;
        semesterDiv.appendChild(semesterTitle);

        const gridDiv = document.createElement('div');
        gridDiv.className = 'grid';
        semesterDiv.appendChild(gridDiv);

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

            // Attach event listeners to the course square
            attachEventListenersToCourse(courseSquare);

            gridDiv.appendChild(courseSquare);
        });

        // Attach event listeners to the grid
        attachEventListenersToGrid(gridDiv);

        semestersContainer.appendChild(semesterDiv);
        updateInfo();
    }

    // Reset electives
    const electivesDiv = document.getElementById('electives');
    electivesDiv.innerHTML = ''; // Clear all electives

    const electivesCourses = courses.filter(course => course.elective === true);
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

        // Attach event listeners to the course square
        attachEventListenersToCourse(courseSquare);

        electivesDiv.appendChild(courseSquare);
    });

    // Update the info message
    updateInfo();
}

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


function attachEventListenersToCourse(courseSquare) {
    // Drag and Drop event listeners
    courseSquare.addEventListener('dragstart', dragStart);
    courseSquare.addEventListener('dragover', dragOver);
    courseSquare.addEventListener('drop', drop);
}
function attachEventListenersToGrid(grid) {
    grid.addEventListener('dragleave', () => grid.classList.remove('highlight'));
    grid.addEventListener('dragover', dragOver);
    grid.addEventListener('drop', drop);
}