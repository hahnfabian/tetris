export function dragStart(event) {
    draggedCourse = event.target;
    event.dataTransfer.setData('text/plain', event.target.id);
    // Add opacity logic here
}

export function dragOver(event) {
    event.preventDefault();
    event.target.closest('.grid, #electives, #freie-wahl')?.classList.add('highlight');
}

export function drop(event) {
    event.preventDefault();
    // Add drop logic here
}

export function attachEventListenersToCourse(courseSquare) {
    courseSquare.addEventListener('dragstart', dragStart);
    courseSquare.addEventListener('dragover', dragOver);
    courseSquare.addEventListener('drop', drop);
}

export function attachEventListenersToGrid(grid) {
    grid.addEventListener('dragleave', () => grid.classList.remove('highlight'));
    grid.addEventListener('dragover', dragOver);
    grid.addEventListener('drop', drop);
}