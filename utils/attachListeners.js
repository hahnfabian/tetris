import { drop, dragOver, dragStart } from "./drag.js";

export function attachEventListenersToCourse(courseSquare) {
    // Drag and Drop event listeners
    courseSquare.addEventListener('dragstart', dragStart);
    courseSquare.addEventListener('dragover', dragOver);
    courseSquare.addEventListener('drop', drop);
    courseSquare.addEventListener('click', () => {
        toggleElectiveStatus(courseSquare);
    });
}

export function attachEventListenersToGrid(grid) {
    grid.addEventListener('dragleave', () => grid.classList.remove('highlight'));
    grid.addEventListener('dragover', dragOver);
    grid.addEventListener('drop', drop);
}'dragstart', (event) => dragStart(event, draggedCourse)