const courseDependencies = {};

export function calculateCourseDependencies(courses) {
    courses.forEach(course => {
        course.prerequisites.forEach(prerequisite => {
            if (!courseDependencies[prerequisite]) {
                courseDependencies[prerequisite] = [];
            }
            courseDependencies[prerequisite].push(course.short_name);
        });
    });

    Object.freeze(courseDependencies); // Prevent accidental modifications
}


export function getCourseDependencies() {
    return courseDependencies;
}