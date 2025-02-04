import { courses } from './data/courses.js';
import { createSemesterGrid } from './components/SemesterGrid.js';
import { createElectivesPool } from './components/ElectivesPool.js';
import { createFreieWahlPool } from './components/FreieWahlPool.js';
import { loadStateFromLocalStorage, saveStateToLocalStorage } from './utils/localStorage.js';
import { attachEventListenersToGrid } from './utils/dragAndDrop.js';

document.addEventListener('DOMContentLoaded', () => {
    const semestersContainer = document.getElementById('semesters');

    // Initialize semesters
    for (let semester = 1; semester <= 7; semester++) {
        const semesterDiv = createSemesterGrid(semester, courses);
        semestersContainer.appendChild(semesterDiv);
    }

    // Initialize electives pool
    createElectivesPool(courses);

    // Initialize Freie Wahl pool
    createFreieWahlPool();

    // Load state from localStorage
    loadStateFromLocalStorage();

    // Attach event listeners to grids
    document.querySelectorAll('.grid').forEach(grid => {
        attachEventListenersToGrid(grid);
    });
});