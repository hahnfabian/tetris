import { updateInfo } from "./updateInfo.js";
import { saveStateToLocalStorage } from "./localStorage.js";

// This function will populate the overlay with the course's details
export function showCourseDetails(course) {
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