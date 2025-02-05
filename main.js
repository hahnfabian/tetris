import {courses} from './data/courses.js';



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

// This function will populate the overlay with the course's details
function showCourseDetails(course) {
    const overlayContent = document.querySelector('.overlay-content');
    
    // Clear any existing content in the overlay
    overlayContent.innerHTML = '';

    // Add the course details to the overlay
    const courseTitle = document.createElement('h2');
    courseTitle.textContent = course.dataset.name;  // Course name
    overlayContent.appendChild(courseTitle);

    const courseShortName = document.createElement('p');
    courseShortName.textContent = `Short Name: ${course.dataset.short_name}`;  // Short name
    overlayContent.appendChild(courseShortName);

    const courseCredits = document.createElement('p');
    courseCredits.textContent = `Credits: ${course.dataset.credits}`;  // Credits
    overlayContent.appendChild(courseCredits);

    const coursePrerequisites = document.createElement('p');
    const prerequisites = JSON.parse(course.dataset.prerequisites);
    coursePrerequisites.textContent = `Prerequisites: ${prerequisites.length > 0 ? prerequisites.join(', ') : 'None'}`;  // Prerequisites
    overlayContent.appendChild(coursePrerequisites);

    const courseIsElective = document.createElement('p');
    courseIsElective.textContent = `Elective: ${course.dataset.isElective === 'true' ? 'Yes' : 'No'}`;  // Elective or not
    overlayContent.appendChild(courseIsElective);

    // Add the toggle button for elective status
    if (course.dataset.isElective === 'true') {
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = course.classList.contains('isMarkedAsFreieWahl') == false ? 'Als Freie Wahl anrechnen lassen' : 'Als Wahlpflicht anrechnen lassen';
        toggleBtn.id = 'toggleElectiveStatus';
        toggleBtn.addEventListener('click', (event) => {
            // console.log("Toggle function executed", course);
            event.stopPropagation();
            toggleElectiveStatus(course);
        });
        overlayContent.appendChild(toggleBtn);
    } else if (course.dataset.isFreieWahl === 'true') {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Kurs löschen";
        deleteBtn.id = 'deleteFreieWahlBtn';
        deleteBtn.addEventListener('click', () => {
            deleteCourse(course);
        });
        overlayContent.appendChild(deleteBtn);
    }


    // Add the Close button to the overlay
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.id = 'closeOverlay';
    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
    });
    overlayContent.appendChild(closeBtn);

    // Show the overlay
    overlay.style.display = 'flex';
}

function toggleElectiveStatus(course) {
    course.classList.toggle('isMarkedAsFreieWahl');
    // Update the overlay with the new status
    showCourseDetails(course);
    updateInfo();
    saveStateToLocalStorage();
}

function deleteCourse(course) {
    course.remove();
    overlay.style.display = 'none';
    updateInfo();
    saveStateToLocalStorage();
}



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
    const totalNeeded = 180;
    const wahlpflichtNeeded = 51;
    const freieWahlNeeded = 18;

    const infoDiv = document.getElementById('info-message');
    infoDiv.innerHTML = ""; // Clear previous messages

    const semesters = Array.from(document.querySelectorAll('.semester'));
    let totalCredits = 0;
    let wahlpflichtCredits = 0;
    let freieWahlCredits = 0;
    let foundElectiveBeforeAbschluss = false;
    let foundAbschlussmodul = false;

    semesters.forEach(semester => {
        const coursesInSemester = semester.querySelectorAll('.course');
        coursesInSemester.forEach(course => {
            const courseCredits = parseInt(course.dataset.credits, 10);
            const courseName = course.dataset.name;

            if (course.dataset.isElective === "true") { 
                if (course.classList.contains('isMarkedAsFreieWahl')) {
                    freieWahlCredits += courseCredits;
                } else {
                    wahlpflichtCredits += courseCredits;
                    if (!foundAbschlussmodul) {
                        foundElectiveBeforeAbschluss = true;
                    }
                }
            } else if (course.dataset.isFreieWahl === "true") {
                freieWahlCredits += courseCredits;
            }

            if (courseName === "Abschlussmodul") {
                foundAbschlussmodul = true;
            }

            totalCredits += courseCredits;
        });
    });

    const totalDifference = totalNeeded - totalCredits;
    const wahlpflichtDifference = wahlpflichtNeeded - wahlpflichtCredits;
    const freieWahlDifference = freieWahlNeeded - freieWahlCredits;

    // console.log(`Total Credits: ${totalCredits}, Difference: ${totalDifference}`);
    // console.log(`Wahlpflicht: ${wahlpflichtCredits}/${wahlpflichtNeeded}, Difference: ${wahlpflichtDifference}`);
    // console.log(`Freie Wahl: ${freieWahlCredits}/${freieWahlNeeded}, Difference: ${freieWahlDifference}`);
    // console.log(`Elective before Abschlussmodul: ${foundElectiveBeforeAbschluss}`);

    // Create paragraph elements with class based on fulfillment status
    function createMessage(text, isFulfilled) {
        const p = document.createElement("p");
        p.textContent = text;
        p.classList.add(isFulfilled ? "isFulfilled" : "notFulfilled");
        return p;
    }

    infoDiv.appendChild(createMessage(
        totalCredits === totalNeeded 
            ? "You have all necessary credits." 
            : totalCredits < totalNeeded 
                ? `You have ${totalCredits} credits and need ${Math.abs(totalDifference)} more.` 
                : `You have ${totalCredits} credits, which is ${Math.abs(totalDifference)} more than required.`,
        totalCredits >= totalNeeded
    ));

    infoDiv.appendChild(createMessage(
        wahlpflichtCredits >= wahlpflichtNeeded 
            ? "Wahlpflicht requirement fulfilled." 
            : `You need ${Math.abs(wahlpflichtDifference)} more Wahlpflicht credits.`,
        wahlpflichtCredits >= wahlpflichtNeeded
    ));

    infoDiv.appendChild(createMessage(
        freieWahlCredits >= freieWahlNeeded 
            ? "Freie Wahl requirement fulfilled." 
            : `You need ${Math.abs(freieWahlDifference)} more Freie Wahl credits.`,
        freieWahlCredits >= freieWahlNeeded
    ));

    if (foundAbschlussmodul && !foundElectiveBeforeAbschluss) {
        infoDiv.appendChild(createMessage(
            "Warning: You must have at least one Wahlpflicht course before the Abschlussmodul.",
            false
        ));
    }

    infoDiv.style.display = 'block'; // Show the info message div
}




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
let saveTimeout;
function saveStateToLocalStorage() {
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
            courseSquare.dataset.isFreieWahl = false;

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
        courseSquare.dataset.isFreieWahl = false;

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
    courseSquare.addEventListener('click', () => {
        toggleElectiveStatus(courseSquare);
    });
}
function attachEventListenersToGrid(grid) {
    grid.addEventListener('dragleave', () => grid.classList.remove('highlight'));
    grid.addEventListener('dragover', dragOver);
    grid.addEventListener('drop', drop);
}