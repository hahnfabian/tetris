// Die Info unten wie viele Credits und so
export function updateInfo() {
    const totalNeeded = 180;
    const wahlpflichtNeeded = 51;
    const freieWahlNeeded = 18;

    const infoDiv = document.getElementById('info-message');
    infoDiv.innerHTML = ""; // Clear previous messages

    const semesters = Array.from(document.querySelectorAll('.semester'));
    let totalCredits = 0;
    let wahlpflichtCredits = 0;
    let freieWahlCredits = 0;
    let foundElectiveBeforeAbschluss = false;
    let foundAbschlussmodul = false;

    semesters.forEach(semester => {
        const coursesInSemester = semester.querySelectorAll('.course');
        coursesInSemester.forEach(course => {
            const courseCredits = parseInt(course.dataset.credits, 10);
            const courseName = course.dataset.name;

            if (course.dataset.isElective === "true") { 
                if (course.classList.contains('isMarkedAsFreieWahl')) {
                    freieWahlCredits += courseCredits;
                } else {
                    wahlpflichtCredits += courseCredits;
                    if (!foundAbschlussmodul) {
                        foundElectiveBeforeAbschluss = true;
                    }
                }
            } else if (course.dataset.isFreieWahl === "true") {
                freieWahlCredits += courseCredits;
            }

            if (courseName === "Abschlussmodul") {
                foundAbschlussmodul = true;
            }

            totalCredits += courseCredits;
        });
    });

    const totalDifference = totalNeeded - totalCredits;
    const wahlpflichtDifference = wahlpflichtNeeded - wahlpflichtCredits;
    const freieWahlDifference = freieWahlNeeded - freieWahlCredits;

    // console.log(`Total Credits: ${totalCredits}, Difference: ${totalDifference}`);
    // console.log(`Wahlpflicht: ${wahlpflichtCredits}/${wahlpflichtNeeded}, Difference: ${wahlpflichtDifference}`);
    // console.log(`Freie Wahl: ${freieWahlCredits}/${freieWahlNeeded}, Difference: ${freieWahlDifference}`);
    // console.log(`Elective before Abschlussmodul: ${foundElectiveBeforeAbschluss}`);

    // Create paragraph elements with class based on fulfillment status
    function createMessage(text, isFulfilled) {
        const p = document.createElement("p");
        p.textContent = text;
        p.classList.add(isFulfilled ? "isFulfilled" : "notFulfilled");
        return p;
    }

    infoDiv.appendChild(createMessage(
        totalCredits === totalNeeded 
            ? "You have all necessary credits." 
            : totalCredits < totalNeeded 
                ? `You have ${totalCredits} credits and need ${Math.abs(totalDifference)} more.` 
                : `You have ${totalCredits} credits, which is ${Math.abs(totalDifference)} more than required.`,
        totalCredits >= totalNeeded
    ));

    infoDiv.appendChild(createMessage(
        wahlpflichtCredits >= wahlpflichtNeeded 
            ? "Wahlpflicht requirement fulfilled." 
            : `You need ${Math.abs(wahlpflichtDifference)} more Wahlpflicht credits.`,
        wahlpflichtCredits >= wahlpflichtNeeded
    ));

    infoDiv.appendChild(createMessage(
        freieWahlCredits >= freieWahlNeeded 
            ? "Freie Wahl requirement fulfilled." 
            : `You need ${Math.abs(freieWahlDifference)} more Freie Wahl credits.`,
        freieWahlCredits >= freieWahlNeeded
    ));

    if (foundAbschlussmodul && !foundElectiveBeforeAbschluss) {
        infoDiv.appendChild(createMessage(
            "Warning: You must have at least one Wahlpflicht course before the Abschlussmodul.",
            false
        ));
    }

    infoDiv.style.display = 'block'; // Show the info message div
}