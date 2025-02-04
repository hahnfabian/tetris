import { createCourseSquare } from './CourseSquare.js';
import { attachEventListenersToCourse } from '../utils/dragAndDrop.js';

export function createSemesterGrid(semesterNumber, courses) {
    const semesterDiv = document.createElement('div');
    semesterDiv.className = 'semester';
    semesterDiv.dataset.number = semesterNumber;

    const semesterTitle = document.createElement('p');
    semesterTitle.textContent = `${semesterNumber}. FS`;
    semesterDiv.appendChild(semesterTitle);

    const gridDiv = document.createElement('div');
    gridDiv.className = 'grid';

    // Add courses to the grid
    const semesterCourses = courses.filter(course => course.intended_semester === semesterNumber);
    semesterCourses.forEach(course => {
        const courseSquare = createCourseSquare(course);
        attachEventListenersToCourse(courseSquare);
        gridDiv.appendChild(courseSquare);
    });

    semesterDiv.appendChild(gridDiv);
    return semesterDiv;
}