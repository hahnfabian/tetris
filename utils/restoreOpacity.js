export function restoreOpacity() {
    const allSemesterDivs = document.querySelectorAll('.semester');
    allSemesterDivs.forEach(semesterDiv => {semesterDiv.style.opacity = '1';});
}