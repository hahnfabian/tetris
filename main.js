//ERROR: drag over das highlight und so wird nicht entfernt und doppelte alerts
import { courses19 } from './data/courses.js';
import { courses23 } from './data/Informatik2023.js';
import { examplePlan } from './data/examplePlan.js';

let courses = courses19;
let draggedCourse = null;
let showHelp = false;

const overlay = document.getElementById('overlay');
const closeOverlayButton = document.getElementById('closeOverlay');
const freieWahlContainer = document.getElementById('freie-wahl');
const freieWahlNameInput = document.getElementById('freie-wahl-name');
const freieWahlShortNameInput = document.getElementById('freie-wahl-short-name');
const freieWahlCreditsInput = document.getElementById('freie-wahl-credits');
const addFreieWahlButton = document.getElementById('add-freie-wahl');
const semestersContainer = document.getElementById('semesters');
const electivesContainer = document.getElementById('electives');
const moduleFilter = document.getElementById('module-filter');
const clearButton = document.getElementById('clear-button');
let electivesCourses = courses.filter(course => course.elective === true);
const helpButton = document.getElementById('help-button');
const loadExamplePlanButton = document.getElementById('loadExampleButton');
const selectYearButton = document.getElementById('selectYearButton');

if (selectYearButton) {
    selectYearButton.addEventListener('change', (event) => changeYear(event.target.value));
} 


let courseDependencies = {};
courses.forEach(course => {
    course.prerequisites.forEach(prerequisite => {
        if (!courseDependencies[prerequisite]) {
            courseDependencies[prerequisite] = [];
        }
        courseDependencies[prerequisite].push(course.short_name);
    });
});


loadExamplePlanButton.addEventListener('click', loadExamplePlan);
helpButton.addEventListener('click', toggleHelp);

clearButton.addEventListener('click', clearPlanner);
moduleFilter.addEventListener('change', (event) => renderElectives(event.target.value));

// Hide the overlay 
closeOverlayButton.addEventListener('click', () => { overlay.style.display = 'none'; });
overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
        overlay.style.display = 'none';
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        overlay.style.display = 'none';
    }
});

function toggleHelp() {
    const toHide = ['hilfe-plan', 'hilfe-wahlpflicht', 'hilfe-freie-wahl', 'hilfe-optionen'];

    showHelp = !showHelp;
    toHide.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = showHelp ? 'block' : 'none';
        }
    });
    helpButton.textContent = showHelp ? 'Hilfe ausblenden' : 'Hilfe anzeigen';
}

// Function to create a course square
function createCourseSquare(course, isElective = false, isFreieWahl = false) {
    const courseSquare = document.createElement('div');
    courseSquare.className = 'course';
    courseSquare.style.setProperty('--credits', course.credits / 3);
    courseSquare.textContent = course.short_name;
    courseSquare.draggable = true;
    courseSquare.id = `course-${course.short_name}`;
    courseSquare.style.backgroundColor = course.color;

    Object.entries({
        short_name: course.short_name,
        name: course.name,
        credits: course.credits,
        credits_needed: course.credits_needed,
        semester: course.semester,
        intendedSemester: course.intended_semester,
        prerequisites: JSON.stringify(course.prerequisites),
        isElective: isElective,
        isFreieWahl: isFreieWahl,
        recommended_prerequisites: JSON.stringify(course.recommended_prerequisites),
    }).forEach(([key, value]) => courseSquare.dataset[key] = value);

    attachEventListenersToCourse(courseSquare);
    return courseSquare;
}

function attachEventListenersToCourse(courseSquare) {
    courseSquare.addEventListener('dragstart', dragStart);
    courseSquare.addEventListener('dragover', dragOver);
    courseSquare.addEventListener('drop', drop);
    courseSquare.addEventListener('click', () => showCourseDetails(courseSquare));
}

function attachEventListenersToGrid(grid) {
    grid.addEventListener('dragleave', () => grid.classList.remove('highlight'));
    grid.addEventListener('dragover', dragOver);
    grid.addEventListener('drop', drop);
    grid.addEventListener('dragend', restoreOpacity);
}


// This function will populate the overlay with the course's details
function showCourseDetails(course) {
    const overlayContent = document.querySelector('.overlay-content');
    
    // Clear any existing content in the overlay
    overlayContent.innerHTML = '';

    // Add the course details to the overlay
    const courseTitle = document.createElement('h2');
    courseTitle.textContent = course.dataset.name + ' (' + course.dataset.short_name + ')';  // Course name
    overlayContent.appendChild(courseTitle);

    const courseCredits = document.createElement('p');
    courseCredits.textContent = `Credits: ${course.dataset.credits}`;  // Credits
    overlayContent.appendChild(courseCredits);

    const coursePrerequisites = document.createElement('p');
    const prerequisites = JSON.parse(course.dataset.prerequisites);
    coursePrerequisites.textContent = `Voraussetzungen: ${prerequisites.length > 0 ? prerequisites.join(', ') : 'Keine'}`;  // Prerequisites
    overlayContent.appendChild(coursePrerequisites);

    const courseRecommendedPrerequisites = document.createElement('p');
    console.log(course.dataset.recommended_prerequisites)
    const recommendedPrerequisites = JSON.parse(course.dataset.recommended_prerequisites || "[]")
    courseRecommendedPrerequisites.textContent = `Vorwissen empfohlen: ${recommendedPrerequisites.length > 0 ? recommendedPrerequisites.join(', ') : 'Nein'}`;  // Prerequisites
    overlayContent.appendChild(courseRecommendedPrerequisites);

    const creditsPrerequisites = document.createElement('p');
    const creditsNeededOverlay = course.dataset.credits_needed; 
    creditsPrerequisites.textContent = `Benötigte Credits: ${creditsNeededOverlay}`;  // Prerequisites
    overlayContent.appendChild(creditsPrerequisites);

    const courseIsElective = document.createElement('p');
    courseIsElective.textContent = `Wahlpflicht: ${course.dataset.isElective === 'true' ? 'Ja' : 'Nein'}`;  // Elective or not
    overlayContent.appendChild(courseIsElective);

    // Add the toggle button for elective status
    if (course.dataset.isElective === 'true') {
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = course.classList.contains('isMarkedAsFreieWahl') == false ? 'Als Freie Wahl anrechnen lassen' : 'Als Wahlpflicht anrechnen lassen';
        toggleBtn.id = 'toggleElectiveStatus';
        toggleBtn.classList.add('button-spacing');
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
        deleteBtn.classList.add('button-spacing');
        deleteBtn.addEventListener('click', (event) => {
            deleteCourse(course);
            event.stopPropagation();
        });
        overlayContent.appendChild(deleteBtn);
    }


    // Add the Close button to the overlay
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.id = 'closeOverlay';
    closeBtn.classList.add('button-spacing');
    closeBtn.addEventListener('click', (event) => {
        event.stopPropagation();
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
    clearErrorMessage();
}

function addFreieWahlClass(short_name, name, credits) {
    clearErrorMessage();
    if (!name || credits <= 0 || isNaN(credits)) {
        setErrorMessage("Freie Wahl Module brauchen einen Namen und eine Credit Anzahl.");
        return;
    }

    if(!short_name) {
        short_name = name
    }

    const courseSquare = createCourseSquare({
        short_name: `${short_name} (FW)`,
        name: name,
        credits: credits,
        credits_needed: 0,
        semester: 'both',
        intended_semester: null,
        prerequisites: [],
        recommended_prerequisites: [],
        color: '#ffcc82',
    }, false, true);

    freieWahlContainer.appendChild(courseSquare);
    freieWahlNameInput.value = "";
    freieWahlShortNameInput.value ="";
    freieWahlCreditsInput.value = "";

    saveStateToLocalStorage();
}


// Event listener for adding new courses
addFreieWahlButton.addEventListener('click', () => {
    const name = freieWahlNameInput.value.trim();
    const short_name = freieWahlShortNameInput.value.trim();
    const credits = parseInt(freieWahlCreditsInput.value, 10);
    addFreieWahlClass(short_name, name, credits);
});

// // Drag and Drop event listeners for container
// freieWahlContainer.addEventListener('dragover', dragOver);
// freieWahlContainer.addEventListener('drop', drop);
// freieWahlContainer.addEventListener('dragleave', () => freieWahlContainer.classList.remove('highlight'));

attachEventListenersToGrid(freieWahlContainer);

// die 3 basic Freie Wahl kurse #ffcc82
for (let freieWahlGröße = 1; freieWahlGröße <= 3; freieWahlGröße++) {
    const courseSquare = createCourseSquare({
        short_name:  `${freieWahlGröße*3} LP`,
        name:  `Freie Wahl Beispiel ${freieWahlGröße*3} LP`,
        credits: freieWahlGröße*3,
        credits_needed: 0,
        semester: 'both',
        intended_semester: null,
        prerequisites: [],
        recommended_prerequisites: [],
        color: '#ffcc82',
    }, false, true);

    freieWahlContainer.appendChild(courseSquare);
}

function createStarterSemester() {
    // Create a grid for each semester (1 to 6)
    for (let semester = 1; semester <= 7; semester++) {
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'semester';

        semesterDiv.dataset.number = semester;

        const semesterTitle = document.createElement('p');
        semesterTitle.textContent = `${semester}. FS`;
        semesterDiv.appendChild(semesterTitle);

        const creditsDisplay = document.createElement('p');
        creditsDisplay.className = 'credits-display';
        creditsDisplay.textContent = '0 LP';
        semesterDiv.appendChild(creditsDisplay);

        const gridDiv = document.createElement('div');
        gridDiv.className = 'grid';

        // Add courses to the grid
        const semesterCourses = courses.filter(course => course.intended_semester === semester);
        semesterCourses.forEach(course => {
            const courseSquare =  createCourseSquare(course, false, false);

            gridDiv.appendChild(courseSquare);
        });

        semesterDiv.appendChild(gridDiv);
        semestersContainer.appendChild(semesterDiv);
    }

}
    


// Space for electives
function renderElectives(filter = 'all') {
    function getPlacedCourses() {
        const placedCourses = new Set();
        document.querySelectorAll('.semester .course').forEach(course => {
            placedCourses.add(course.dataset.short_name);
        });
        return placedCourses;
    }
    
    electivesContainer.innerHTML = ''; // Clear existing electives
    const placedCourses = getPlacedCourses(); // Get currently placed courses

    electivesCourses.forEach(course => {
        const isSummer = course.semester.includes('summer');
        const isWinter = course.semester.includes('winter');

        if (
            !placedCourses.has(course.short_name) && // Only add if not placed in a semester
            (filter === 'all' || (filter === 'summer' && isSummer) || (filter === 'winter' && isWinter))
        ) {
            const courseSquare = createCourseSquare(course, true, false);

            electivesContainer.appendChild(courseSquare);
        }
    });
}


document.querySelectorAll('.grid').forEach(grid => {
    grid.addEventListener('dragleave', () => grid.classList.remove('highlight'));
    grid.addEventListener('dragover', dragOver);
    grid.addEventListener('drop', drop);
    document.addEventListener('dragend', restoreOpacity);
});

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
            setErrorMessage("Nur Freie-Wahl-Module können in den Freie-Wahl-Pool gelegt werden.");
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
            setErrorMessage("Nur Wahlmodule können in den Wahlmodule-Pool gelegt werden.");
            return;
        }

        // Move the course back to the electives pool
        target.appendChild(draggedCourse);
        draggedCourse = null;
        clearErrorMessage();
        updateInfo();
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
        // console.warn(`Cannot move ${draggedCourse.dataset.name} to semester ${semesterNumber}. Semester type mismatch.`);
        setErrorMessage(`Das Modul "${draggedCourse.dataset.short_name}" kann nicht ins ${isWinterSemester ? "Wintersemester" : "Sommersemester"} verschoben werden, da es für das ${courseSemesterType === "winter" ? "Wintersemester" : "Sommersemester"} vorgesehen ist.`);
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
        // console.warn(`Cannot move ${draggedCourse.dataset.name} to semester ${semesterNumber}. Course prerequisites not met:  ${missingPrerequisites}`);
        setErrorMessage(`Das Modul "${draggedCourse.dataset.short_name}" kann nicht in Semester ${semesterNumber} verschoben werden. Fehlende Voraussetzungen: ${missingPrerequisites}`);
        return;
    } else if (!gotNeededCredits) {
        setErrorMessage(`Das Modul "${draggedCourse.dataset.short_name}" kann nicht in Semester ${semesterNumber} verschoben werden. Es fehlen noch ${creditDifference} Credits.`);
        return;
    }

    // Check if the dragged course is a prerequisite for any other course
    const courseName = draggedCourse.dataset.short_name;
    if (courseDependencies[courseName]) {
        for (const dependent of courseDependencies[courseName]) {
            if (!allCourses.has(dependent)) continue; // Skip if course not found

            const dependentSemester = allCourses.get(dependent);
            if (semesterNumber >= dependentSemester) {
                // console.warn(`Moving ${courseName} will break prerequisites for ${dependent} (currently in semester ${dependentSemester})`);
                setErrorMessage(`Das Verschieben von "${courseName}" würde die Voraussetzungen für "${dependent}" verletzen.`);
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
    updateInfo();
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
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');

    errorDiv.style.animation = 'none'; 
    void errorDiv.offsetWidth;
    errorDiv.style.animation = 'pulse 1.5s 4 forwards';
}


function clearErrorMessage() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.classList.add('hidden');
}

function updateInfo() {
    const totalNeeded = 180;
    const wahlpflichtNeeded = 51;
    const freieWahlNeeded = 18;

    const totalDiv = document.getElementById('info-total');
    const wahlpflichtDiv = document.getElementById('info-wahlpflicht');
    const freieWahlDiv = document.getElementById('info-freie-wahl');
    const warningDiv = document.getElementById('info-mind-ein-wahlpflicht');

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

    // Update the content and styling of the divs
    updateIsInfoFertig(totalDiv, `Gesamt: ${totalCredits} von ${totalNeeded} LP`, totalCredits >= totalNeeded);
    updateIsInfoFertig(wahlpflichtDiv, `Wahlpflicht: ${wahlpflichtCredits} von ${wahlpflichtNeeded} LP`, wahlpflichtCredits >= wahlpflichtNeeded);
    updateIsInfoFertig(freieWahlDiv, `Freie Wahl: ${freieWahlCredits} von ${freieWahlNeeded} LP`, freieWahlCredits >= freieWahlNeeded);

    // Update the warning message
    if (foundAbschlussmodul && foundElectiveBeforeAbschluss) {
        warningDiv.classList.add('hidden');
    } else {
        warningDiv.classList.remove('hidden');
    }

    // Show the info message container
    document.getElementById('info-msg-container').style.display = 'flex';
}

// Helper function to update a div with content and styling
function updateIsInfoFertig(div, text, isFertig) {
    div.textContent = text;
    div.className = isFertig ? "istFertig" : "istNichtFertig";
}


// function createBlock(value, istFertig) {
//     const block = document.createElement("div");
//     block.classList.add(istFertig ? "istFertig" : "istNichtFertig");
    
//     const titleElement = document.createElement("p");
//     titleElement.textContent = value;
//     block.appendChild(titleElement);
    
//     return block;
// }


updateInfo();


//clear 
function clearPlanner() {
    const isConfirmed = window.confirm("Bist du sicher, dass du den Planer zurücksetzen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.");
    if (!isConfirmed) {
        return; // If not confirmed, do nothing
    }

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
            courseSquare.className = 'course';
            courseSquare.style.setProperty('--credits', credits);
            courseSquare.textContent = course.short_name;
            courseSquare.draggable = true;
            courseSquare.id = `course-${course.short_name}`; // Unique ID for each course
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
            courseSquare.dataset.recommended_prerequisites = JSON.stringify(course.recommended_prerequisites);


            // Attach event listeners to the course square
            attachEventListenersToCourse(courseSquare);

            gridDiv.appendChild(courseSquare);
        });

        // Attach event listeners to the grid
        attachEventListenersToGrid(gridDiv);

        semestersContainer.appendChild(semesterDiv);
        updateInfo();
        clearErrorMessage();
    }

    // Reset electives
    electivesContainer.innerHTML = ''; // Clear all electives

    electivesCourses.forEach(course => {
        const credits = course.credits / 3; // Each square represents 3 credits
        const courseSquare = document.createElement('div');
        courseSquare.className = 'course';
        courseSquare.style.setProperty('--credits', credits);
        courseSquare.textContent = course.short_name;
        courseSquare.draggable = true;
        courseSquare.id = `course-${course.short_name}`; // Unique ID for each course
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
        courseSquare.dataset.recommended_prerequisites = JSON.stringify(course.recommended_prerequisites);


        // Attach event listeners to the course square
        attachEventListenersToCourse(courseSquare);

        electivesContainer.appendChild(courseSquare);
    });

    // Update the info message
    updateInfo();
}

document.addEventListener('DOMContentLoaded', () => {
    totalReload();
});

function totalReload() {
    const state = localStorage.getItem('coursePlannerState');
    if (state) {
        loadStateFromLocalStorage();
    } else {
        createStarterSemester();
        renderElectives();
    }
    
    document.querySelectorAll('.grid').forEach(grid => {
        attachEventListenersToGrid(grid);
    });

    document.querySelectorAll('.course').forEach(course => {
        attachEventListenersToCourse(course);
    });

    attachEventListenersToGrid(electivesContainer);
}


document.getElementById('downloadPdfButton').addEventListener('click', downloadSemesterPlanAsPdf);

function downloadSemesterPlanAsPdf() {
    const infoMessage = document.getElementById('info-msg-container');

    // Create a temporary div to hold the content
    const tempContainer = document.createElement('div');

    // Add the "Module-Tetris" header
    const header = document.createElement('h1');
    header.textContent = 'Module-Tetris';
    header.style.textAlign = 'center';
    header.style.fontSize = '24px';
    header.style.marginBottom = '20px';
    tempContainer.appendChild(header);

    // Extract text from all <p> inside #info-msg-container
    infoMessage.querySelectorAll('div').forEach(div => {
        const cloned = div.cloneNode(true); // Clone the <p> element
        tempContainer.appendChild(cloned);
    });

    // Clone #semesters and append it to the temporary container
    const semestersClone = document.getElementById('semesters').cloneNode(true);
    semestersClone.style.fontSize = '12px'; // Make semester content smaller
    tempContainer.appendChild(semestersClone);

    // Add footer with hyperlink
    const footer = document.createElement('p');
    footer.style.marginTop = '20px';
    footer.style.fontSize = '12px';
    footer.style.textAlign = 'center';
    footer.innerHTML = 'Dieser Semesterplan wurde auf <a href="https://jfhahn.de/tetris" target="_blank">jfhahn.de/tetris</a> erstellt.';
    tempContainer.appendChild(footer);

    // Define PDF options
    const options = {
        margin: [10, 10, 10, 10],
        filename: 'semester_plan.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate and save PDF
    html2pdf().from(tempContainer).set(options).save();
}




// LocalStorage stuff


let saveTimeout;
function saveStateToLocalStorage() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const semesters = Array.from(document.querySelectorAll('.semester'));
        const state = semesters.map(semester => {
            const courses = Array.from(semester.querySelectorAll('.course')).map(course => ({
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
                recommended_prerequisites: JSON.parse(course.dataset.recommended_prerequisites || "[]"),
                classnames: course.classList.value
            }));
            return {
                number: semester.dataset.number,
                courses: courses
            };
        });

        localStorage.setItem('coursePlannerState', JSON.stringify(state));
    }, 200);
}

function loadStateFromLocalStorage() {
    const state = localStorage.getItem('coursePlannerState');
    if (!state) return;

    const semestersData = JSON.parse(state);
    const placedElectives = new Set();

    semestersContainer.innerHTML = '';
    semestersData.forEach(semesterData => {
        let creditsCounter = 0;

        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'semester';
        semesterDiv.dataset.number = semesterData.number;

        const semesterTitle = document.createElement('p');
        semesterTitle.textContent = `${semesterData.number}. FS`;
        semesterDiv.appendChild(semesterTitle);

        const gridDiv = document.createElement('div');
        gridDiv.className = 'grid';
        semesterDiv.appendChild(gridDiv);

        semesterData.courses.forEach(courseData => {
            const courseSquare = createCourseSquare({
                short_name: courseData.short_name,
                name: courseData.name,
                credits: courseData.credits,
                credits_needed: courseData.credits_needed,
                semester: courseData.semester,
                intended_semester: courseData.intendedSemester,
                prerequisites: courseData.prerequisites,
                recommended_prerequisites: courseData.recommended_prerequisites,
                color: courseData.color,
            }, courseData.isElective, courseData.isFreieWahl);

            courseSquare.id = courseData.id;
            courseSquare.className = courseData.classnames;
            gridDiv.appendChild(courseSquare);

            if (courseData.isElective) {
                placedElectives.add(courseData.short_name);
            }

            creditsCounter = creditsCounter + courseData.credits;
        });
        

        attachEventListenersToGrid(semesterDiv);

        semestersContainer.appendChild(semesterDiv);
    });

    electivesContainer.innerHTML = '';
    courses.filter(course => course.elective === true && !placedElectives.has(course.short_name)).forEach(course => {
        const courseSquare = createCourseSquare(course, true);
        electivesContainer.appendChild(courseSquare);
    });

    updateInfo();
}


document.getElementById('downloadJSONButton').addEventListener('click', () => {
    const state = localStorage.getItem('coursePlannerState');
    if (!state) {
        // alert('No state to save!');
        return;
    }

    const blob = new Blob([state], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'semester_plan.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

document.getElementById('loadJSONButton').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            try {
                const state = JSON.parse(content);
                localStorage.setItem('coursePlannerState', JSON.stringify(state));
                totalReload();
            } catch (error) {
                alert('Invalid JSON file!');
            }
        };
        reader.readAsText(file);
    };

    input.click();
});

function loadExamplePlan() {
    const userConfirmed = confirm("Das wird deinen momentanen Plan überschreiben. Möchtest du fortfahren?");

    if (userConfirmed) {
        localStorage.setItem('coursePlannerState', JSON.stringify(examplePlan));
        totalReload();
    }
}


function changeYear(year = '19') {
    console.log("Changing year to: " + year);
    if (year === '19') {
        courses = courses19;
    } else if (year === '23') {
        courses = courses23;
    } else {
        console.error('Invalid year selected');
        return;
    }
    setCourses(courses);
    clearPlanner();
    renderElectives();
}

function setCourses(newCourses) {
    electivesCourses = newCourses.filter(course => course.elective === true);
    courseDependencies = {};
    newCourses.forEach(course => {
        course.prerequisites.forEach(prerequisite => {
            if (!courseDependencies[prerequisite]) {
                courseDependencies[prerequisite] = [];
            }
            courseDependencies[prerequisite].push(course.short_name);
        });
    });
}