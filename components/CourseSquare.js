export function createCourseSquare(course, isFreieWahl = false) {
    const courseSquare = document.createElement('div');
    courseSquare.className = 'square course course-joined';
    courseSquare.style.setProperty('--credits', course.credits / 3);
    courseSquare.textContent = isFreieWahl ? `${course.credits} LP` : course.short_name;
    courseSquare.draggable = true;
    courseSquare.id = isFreieWahl ? `course-freiewahl-${Math.random().toString(36).substr(2, 9)}` : `course-${course.id}`;
    courseSquare.style.backgroundColor = isFreieWahl ? '#ffcc82' : course.color;

    // Dataset properties
    courseSquare.dataset.short_name = isFreieWahl ? `${course.credits} LP` : course.short_name;
    courseSquare.dataset.name = isFreieWahl ? `Freie Wahl ${course.credits} LP` : course.name;
    courseSquare.dataset.credits = course.credits;
    courseSquare.dataset.credits_needed = course.credits_needed || 0;
    courseSquare.dataset.semester = course.semester || 'both';
    courseSquare.dataset.intendedSemester = course.intended_semester || null;
    courseSquare.dataset.prerequisites = JSON.stringify(course.prerequisites || []);
    courseSquare.dataset.isElective = course.elective || false;
    courseSquare.dataset.isFreieWahl = isFreieWahl;

    return courseSquare;
}