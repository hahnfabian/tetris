import { createCourseSquare } from './CourseSquare.js';
import { attachEventListenersToCourse } from '../utils/dragAndDrop.js';

export function createElectivesPool(courses) {
    const electivesDiv = document.getElementById('electives');
    const electivesCourses = courses.filter(course => course.elective === true);

    electivesCourses.forEach(course => {
        const courseSquare = createCourseSquare(course);
        attachEventListenersToCourse(courseSquare);
        electivesDiv.appendChild(courseSquare);
    });

    return electivesDiv;
}