import { createCourseSquare } from './CourseSquare.js';
import { attachEventListenersToCourse } from '../utils/dragAndDrop.js';

export function createFreieWahlPool() {
    const freieWahlContainer = document.getElementById('freie-wahl');

    for (let freieWahlGröße = 1; freieWahlGröße <= 3; freieWahlGröße++) {
        const course = {
            credits: freieWahlGröße * 3,
            short_name: `${freieWahlGröße * 3} LP`,
            name: `Freie Wahl ${freieWahlGröße * 3} LP`,
            isFreieWahl: true
        };

        const courseSquare = createCourseSquare(course, true);
        attachEventListenersToCourse(courseSquare);
        freieWahlContainer.appendChild(courseSquare);
    }

    return freieWahlContainer;
}