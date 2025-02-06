import {updateInfo} from './updateInfo.js'
import {attachEventListenersToCourse, attachEventListenersToGrid}  from './attachListeners.js'
//clear 
export function clearPlanner() {
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