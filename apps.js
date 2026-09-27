/* =========================================
   ELEMENTS
========================================= */

const startButton =
    document.getElementById("startWorkout");

const workoutSection =
    document.getElementById("workoutSection");

const historySection =
    document.getElementById("historySection");

const mealSection =
    document.getElementById("mealSection");

const sleepSection =
    document.getElementById("sleepSection");

const progressSection =
    document.getElementById("progressSection");

const progressViewSection =
    document.getElementById("progressViewSection");


const addSetButton =
    document.getElementById("addSet");

const addExerciseButton =
    document.getElementById("addExercise");

const finishWorkoutButton =
    document.getElementById("finishWorkout");

const cancelWorkoutButton =
    document.getElementById("cancelWorkout");


const historyButton =
    document.getElementById("historyButton");

const mealButton =
    document.getElementById("mealButton");

const sleepButton =
    document.getElementById("sleepButton");

const progressButton =
    document.getElementById("progressButton");

const progressViewButton =
    document.getElementById("progressViewButton");



/* =========================================
   DATA
========================================= */

let currentWorkout = [];

let currentSets = [];


let workoutHistory =
    JSON.parse(
        localStorage.getItem("workoutHistory")
    ) || [];


let meals =
    JSON.parse(
        localStorage.getItem("meals")
    ) || [];


let sleepHistory =
    JSON.parse(
        localStorage.getItem("sleepHistory")
    ) || [];


let progressMedia = [];



/* =========================================
   LOCAL STORAGE CLEANUP / MIGRATION
========================================= */

function normalizeWorkouts() {

    workoutHistory =
        workoutHistory.map(function(workout) {

            workout.id =
                workout.id || Date.now() + Math.random();


            workout.exercises =
                workout.exercises || [];


            workout.exercises =
                workout.exercises.map(
                    function(exercise) {

                        /*
                        New format:
                        exercise.sets = [
                            { weight, reps },
                            { weight, reps }
                        ]
                        */

                        if (
                            Array.isArray(
                                exercise.sets
                            )
                        ) {

                            return exercise;

                        }


                        /*
                        Old format:
                        sets = 3
                        reps = 10
                        weight = 95

                        Convert it to the new format.
                        */

                        const oldSets =
                            Number(exercise.sets) || 0;

                        const oldReps =
                            Number(exercise.reps) || 0;

                        const oldWeight =
                            exercise.weight ||
                            "Bodyweight";


                        const newSets = [];


                        for (
                            let i = 0;
                            i < oldSets;
                            i++
                        ) {

                            newSets.push({

                                weight: oldWeight,

                                reps: oldReps

                            });

                        }


                        return {

                            exercise:
                                exercise.exercise,

                            sets:
                                newSets

                        };

                    }
                );


            return workout;

        });


    localStorage.setItem(
        "workoutHistory",
        JSON.stringify(workoutHistory)
    );

}


normalizeWorkouts();



/* =========================================
   SECTION NAVIGATION
========================================= */

function showSection(sectionId) {

    const sections = [

        "dashboardSection",

        "workoutSection",

        "historySection",

        "mealSection",

        "sleepSection",

        "progressSection",

        "progressViewSection"

    ];


    sections.forEach(function(id) {

        const section =
            document.getElementById(id);


        if (section) {

            section.style.display =
                id === sectionId
                    ? "block"
                    : "none";

        }

    });


    if (
        sectionId ===
        "historySection"
    ) {

        displayHistory();

    }


    if (
        sectionId ===
        "mealSection"
    ) {

        displayMeals();

    }


    if (
        sectionId ===
        "sleepSection"
    ) {

        displaySleep();

    }


    if (
        sectionId ===
        "progressSection"
    ) {

        setupProgress();

    }


    if (
        sectionId ===
        "progressViewSection"
    ) {

        loadProgressMedia();

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



/* =========================================
   BACK BUTTONS
========================================= */

document
    .querySelectorAll(".back-button")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                showSection(
                    "dashboardSection"
                );

            }
        );

    });



/* =========================================
   START WORKOUT
========================================= */

startButton.addEventListener(
    "click",
    function() {

        currentWorkout = [];

        currentSets = [];


        document.getElementById(
            "workoutName"
        ).value = "";

        document.getElementById(
            "exerciseName"
        ).value = "";

        document.getElementById(
            "weight"
        ).value = "";

        document.getElementById(
            "reps"
        ).value = "";


        document.getElementById(
            "currentSets"
        ).innerHTML = "";

        document.getElementById(
            "exerciseList"
        ).innerHTML = "";


        showSection(
            "workoutSection"
        );

    }
);



/* =========================================
   ADD SET
========================================= */

addSetButton.addEventListener(
    "click",
    function() {

        const weight =
            document.getElementById(
                "weight"
            ).value;


        const reps =
            document.getElementById(
                "reps"
            ).value;


        if (reps === "") {

            alert(
                "Please enter the number of reps."
            );

            return;

        }


        const newSet = {

            weight:
                weight === ""
                    ? "Bodyweight"
                    : Number(weight),

            reps:
                Number(reps)

        };


        currentSets.push(
            newSet
        );


        displayCurrentSets();


        document.getElementById(
            "weight"
        ).value = "";

        document.getElementById(
            "reps"
        ).value = "";

    }
);



/* =========================================
   DISPLAY CURRENT SETS
========================================= */

function displayCurrentSets() {

    const container =
        document.getElementById(
            "currentSets"
        );


    container.innerHTML = "";


    currentSets.forEach(
        function(set, index) {

            const setDiv =
                document.createElement(
                    "div"
                );


            setDiv.className =
                "current-set";


            const weightText =
                set.weight === "Bodyweight"
                    ? "Bodyweight"
                    : set.weight + " lb";


            setDiv.innerHTML = `

                <span>
                    <strong>
                        Set ${index + 1}
                    </strong>
                </span>

                <span>
                    ${weightText}
                    ×
                    ${set.reps}
                </span>

            `;


            container.appendChild(
                setDiv
            );

        }
    );

}



/* =========================================
   ADD EXERCISE
========================================= */

addExerciseButton.addEventListener(
    "click",
    function() {

        const exerciseName =
            document.getElementById(
                "exerciseName"
            ).value.trim();


        if (exerciseName === "") {

            alert(
                "Please enter an exercise name."
            );

            return;

        }


        if (currentSets.length === 0) {

            alert(
                "Please add at least one set."
            );

            return;

        }


        const exercise = {

            exercise:
                exerciseName,

            sets:
                [...currentSets]

        };


        currentWorkout.push(
            exercise
        );


        displayCurrentExercises();


        document.getElementById(
            "exerciseName"
        ).value = "";


        currentSets = [];


        displayCurrentSets();

    }
);



/* =========================================
   DISPLAY CURRENT EXERCISES
========================================= */

function displayCurrentExercises() {

    const container =
        document.getElementById(
            "exerciseList"
        );


    container.innerHTML = "";


    currentWorkout.forEach(
        function(exercise) {

            const exerciseDiv =
                document.createElement(
                    "div"
                );


            exerciseDiv.className =
                "exercise";


            let setsHTML = "";


            exercise.sets.forEach(
                function(set, index) {

                    const weightText =
                        set.weight === "Bodyweight"
                            ? "Bodyweight"
                            : set.weight + " lb";


                    setsHTML += `

                        <div class="exercise-set">

                            Set ${index + 1}:
                            ${weightText}
                            ×
                            ${set.reps}

                        </div>

                    `;

                }
            );


            exerciseDiv.innerHTML = `

                <h3>
                    ${exercise.exercise}
                </h3>

                ${setsHTML}

            `;


            container.appendChild(
                exerciseDiv
            );

        }
    );

}



/* =========================================
   FINISH WORKOUT
========================================= */

finishWorkoutButton.addEventListener(
    "click",
    function() {

        const workoutName =
            document.getElementById(
                "workoutName"
            ).value.trim();


        if (workoutName === "") {

            alert(
                "Please enter a workout name."
            );

            return;

        }


        if (currentWorkout.length === 0) {

            alert(
                "Please add at least one exercise."
            );

            return;

        }


        const completedWorkout = {

            id:
                Date.now(),

            name:
                workoutName,

            date:
                new Date().toISOString(),

            exercises:
                currentWorkout

        };


        workoutHistory.push(
            completedWorkout
        );


        localStorage.setItem(
            "workoutHistory",
            JSON.stringify(
                workoutHistory
            )
        );


        alert(
            "Workout saved! 💪"
        );


        currentWorkout = [];

        currentSets = [];


        document.getElementById(
            "exerciseList"
        ).innerHTML = "";

        document.getElementById(
            "currentSets"
        ).innerHTML = "";


        updateStats();


        showSection(
            "dashboardSection"
        );

    }
);



/* =========================================
   CANCEL WORKOUT
========================================= */

cancelWorkoutButton.addEventListener(
    "click",
    function() {

        currentWorkout = [];

        currentSets = [];


        document.getElementById(
            "exerciseList"
        ).innerHTML = "";

        document.getElementById(
            "currentSets"
        ).innerHTML = "";


        showSection(
            "dashboardSection"
        );

    }
);



/* =========================================
   WORKOUT HISTORY
========================================= */

historyButton.addEventListener(
    "click",
    function() {

        showSection(
            "historySection"
        );

    }
);



function formatWorkoutDate(dateValue) {

    const date =
        new Date(dateValue);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateValue;

    }


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}



function displayHistory() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    historyList.innerHTML = "";


    if (
        workoutHistory.length === 0
    ) {

        historyList.innerHTML = `

            <p class="muted">
                No workouts saved yet.
            </p>

        `;

        return;

    }


    workoutHistory
        .slice()
        .reverse()
        .forEach(
            function(workout) {

                const workoutDiv =
                    document.createElement(
                        "div"
                    );


                workoutDiv.className =
                    "history-workout";


                let exercisesHTML = "";


                workout.exercises.forEach(
                    function(exercise) {

                        let setsHTML = "";


                        /*
                        New format
                        */

                        if (
                            Array.isArray(
                                exercise.sets
                            )
                        ) {

                            exercise.sets.forEach(
                                function(set, index) {

                                    const weightText =
                                        set.weight ===
                                        "Bodyweight"

                                            ? "Bodyweight"

                                            : set.weight +
                                              " lb";


                                    setsHTML += `

                                        <div class="history-set">

                                            Set ${index + 1}:
                                            ${weightText}
                                            ×
                                            ${set.reps}

                                        </div>

                                    `;

                                }
                            );

                        }


                        exercisesHTML += `

                            <div class="history-exercise">

                                <strong>
                                    ${exercise.exercise}
                                </strong>

                                ${setsHTML}

                            </div>

                        `;

                    }
                );


                workoutDiv.innerHTML = `

                    <h3>
                        ${workout.name}
                    </h3>

                    <div class="history-date">

                        ${formatWorkoutDate(
                            workout.date
                        )}

                    </div>

                    ${exercisesHTML}


                    <button
                        class="secondary-button delete-workout"
                        data-id="${workout.id}"
                    >
                        Delete Workout
                    </button>

                `;


                historyList.appendChild(
                    workoutDiv
                );

            }
        );


    /*
    Delete workouts
    */

    document
        .querySelectorAll(
            ".delete-workout"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const id =
                            Number(
                                button.dataset.id
                            );


                        workoutHistory =
                            workoutHistory.filter(
                                function(workout) {

                                    return (
                                        Number(
                                            workout.id
                                        ) !== id
                                    );

                                }
                            );


                        localStorage.setItem(
                            "workoutHistory",
                            JSON.stringify(
                                workoutHistory
                            )
                        );


                        displayHistory();

                        updateStats();

                        setupProgress();

                    }
                );

            }
        );

}



/* =========================================
   MEALS
========================================= */

mealButton.addEventListener(
    "click",
    function() {

        showSection(
            "mealSection"
        );

    }
);


document
    .getElementById("addMeal")
    .addEventListener(
        "click",
        function() {

            const mealName =
                document.getElementById(
                    "mealName"
                ).value.trim();


            const mealNotes =
                document.getElementById(
                    "mealNotes"
                ).value.trim();


            if (
                mealName === ""
            ) {

                alert(
                    "Please enter a meal."
                );

                return;

            }


            meals.push({

                id:
                    Date.now(),

                name:
                    mealName,

                notes:
                    mealNotes,

                date:
                    new Date().toISOString()

            });


            localStorage.setItem(
                "meals",
                JSON.stringify(
                    meals
                )
            );


            document.getElementById(
                "mealName"
            ).value = "";

            document.getElementById(
                "mealNotes"
            ).value = "";


            displayMeals();

        }
    );



function displayMeals() {

    const list =
        document.getElementById(
            "mealList"
        );


    list.innerHTML = "";


    if (
        meals.length === 0
    ) {

        list.innerHTML = `

            <p class="muted">
                No meals logged yet.
            </p>

        `;

        return;

    }


    meals
        .slice()
        .reverse()
        .forEach(
            function(meal) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "history-workout";


                div.innerHTML = `

                    <h3>
                        ${meal.name}
                    </h3>

                    <div class="history-date">
                        ${formatWorkoutDate(
                            meal.date
                        )}
                    </div>

                    <p>
                        ${
                            meal.notes ||
                            "No notes"
                        }
                    </p>

                `;


                list.appendChild(
                    div
                );

            }
        );

}



/* =========================================
   SLEEP
========================================= */

sleepButton.addEventListener(
    "click",
    function() {

        showSection(
            "sleepSection"
        );

    }
);


document
    .getElementById("saveSleep")
    .addEventListener(
        "click",
        function() {

            const hours =
                document.getElementById(
                    "sleepHours"
                ).value;


            if (
                hours === ""
            ) {

                alert(
                    "Please enter your hours of sleep."
                );

                return;

            }


            sleepHistory.push({

                id:
                    Date.now(),

                hours:
                    Number(hours),

                date:
                    new Date().toISOString()

            });


            localStorage.setItem(
                "sleepHistory",
                JSON.stringify(
                    sleepHistory
                )
            );


            document.getElementById(
                "sleepHours"
            ).value = "";


            displaySleep();

        }
    );



function displaySleep() {

    const list =
        document.getElementById(
            "sleepList"
        );


    list.innerHTML = "";


    if (
        sleepHistory.length === 0
    ) {

        list.innerHTML = `

            <p class="muted">
                No sleep logged yet.
            </p>

        `;

        return;

    }


    sleepHistory
        .slice()
        .reverse()
        .forEach(
            function(entry) {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "history-workout";


                div.innerHTML = `

                    <h3>
                        ${entry.hours} hours
                    </h3>

                    <div class="history-date">
                        ${formatWorkoutDate(
                            entry.date
                        )}
                    </div>

                `;


                list.appendChild(
                    div
                );

            }
        );

}



/* =========================================
   STRENGTH PROGRESS
========================================= */

progressButton.addEventListener(
    "click",
    function() {

        showSection(
            "progressSection"
        );

    }
);



function getExerciseNames() {

    const names = [];


    workoutHistory.forEach(
        function(workout) {

            workout.exercises.forEach(
                function(exercise) {

                    const name =
                        exercise.exercise.trim();


                    if (
                        name !== "" &&
                        !names.includes(name)
                    ) {

                        names.push(name);

                    }

                }
            );

        }
    );


    return names.sort();

}



function setupProgress() {

    const selector =
        document.getElementById(
            "exerciseSelector"
        );


    const currentValue =
        selector.value;


    selector.innerHTML = `

        <option value="">
            Select an exercise
        </option>

    `;


    getExerciseNames()
        .forEach(
            function(name) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    name;

                option.textContent =
                    name;


                selector.appendChild(
                    option
                );

            }
        );


    if (
        getExerciseNames()
            .includes(currentValue)
    ) {

        selector.value =
            currentValue;

    }


    drawProgressChart(
        selector.value
    );

}



document
    .getElementById(
        "exerciseSelector"
    )
    .addEventListener(
        "change",
        function() {

            drawProgressChart(
                this.value
            );

        }
    );



function getExerciseProgress(
    exerciseName
) {

    const results = [];


    workoutHistory.forEach(
        function(workout) {

            workout.exercises.forEach(
                function(exercise) {

                    if (
                        exercise.exercise.trim()
                            .toLowerCase() !==
                        exerciseName.trim()
                            .toLowerCase()
                    ) {

                        return;

                    }


                    if (
                        !Array.isArray(
                            exercise.sets
                        )
                    ) {

                        return;

                    }


                    let maxWeight = 0;


                    exercise.sets.forEach(
                        function(set) {

                            const weight =
                                Number(
                                    set.weight
                                );


                            if (
                                Number.isFinite(
                                    weight
                                ) &&
                                weight > maxWeight
                            ) {

                                maxWeight =
                                    weight;

                            }

                        }
                    );


                    if (
                        maxWeight > 0
                    ) {

                        results.push({

                            date:
                                workout.date,

                            weight:
                                maxWeight

                        });

                    }

                }
            );

        }
    );


    results.sort(
        function(a, b) {

            return (
                new Date(a.date) -
                new Date(b.date)
            );

        }
    );


    return results;

}



/* =========================================
   DRAW STRENGTH CHART
========================================= */

function drawProgressChart(
    exerciseName
) {

    const canvas =
        document.getElementById(
            "strengthChart"
        );


    const ctx =
        canvas.getContext("2d");


    const container =
        canvas.parentElement;


    canvas.width =
        container.clientWidth - 20;

    canvas.height =
        container.clientHeight - 20;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const summary =
        document.getElementById(
            "progressSummary"
        );


    const details =
        document.getElementById(
            "progressDetails"
        );


    summary.innerHTML =
        "Select an exercise to see your progress.";


    details.innerHTML = "";


    if (
        !exerciseName
    ) {

        return;

    }


    const data =
        getExerciseProgress(
            exerciseName
        );


    if (
        data.length === 0
    ) {

        summary.innerHTML =
            "No weighted sets recorded for this exercise yet.";

        return;

    }


    const weights =
        data.map(
            function(item) {

                return item.weight;

            }
        );


    const minWeight =
        Math.min(...weights);


    const maxWeight =
        Math.max(...weights);


    const firstWeight =
        weights[0];


    const latestWeight =
        weights[weights.length - 1];


    const change =
        latestWeight -
        firstWeight;


    const changeText =
        change > 0
            ? "+" + change + " lb"
            : change + " lb";


    summary.innerHTML = `

        <strong>
            ${exerciseName}
        </strong>

        <br>

        First:
        ${firstWeight} lb

        &nbsp; → &nbsp;

        Latest:
        ${latestWeight} lb

        <br>

        Change:
        ${changeText}

    `;


    /*
    Chart dimensions
    */

    const padding = 45;

    const chartWidth =
        canvas.width -
        padding * 2;

    const chartHeight =
        canvas.height -
        padding * 2;


    const range =
        Math.max(
            maxWeight - minWeight,
            10
        );


    const chartMin =
        Math.max(
            0,
            minWeight -
            range * 0.15
        );


    const chartMax =
        maxWeight +
        range * 0.15;


    /*
    Grid
    */

    ctx.strokeStyle =
        "#ddd";

    ctx.lineWidth = 1;


    for (
        let i = 0;
        i <= 4;
        i++
    ) {

        const y =
            padding +
            (
                chartHeight *
                i /
                4
            );


        ctx.beginPath();

        ctx.moveTo(
            padding,
            y
        );

        ctx.lineTo(
            canvas.width - padding,
            y
        );

        ctx.stroke();


        const value =
            chartMax -
            (
                (
                    chartMax -
                    chartMin
                ) *
                i /
                4
            );


        ctx.fillStyle =
            "#666";

        ctx.font =
            "12px Arial";

        ctx.fillText(
            Math.round(value) +
            " lb",
            5,
            y + 4
        );

    }


    /*
    Line
    */

    ctx.strokeStyle =
        "#111";

    ctx.lineWidth = 3;

    ctx.beginPath();


    data.forEach(
        function(item, index) {

            const x =
                data.length === 1

                    ? canvas.width / 2

                    : padding +
                      (
                          chartWidth *
                          index /
                          (data.length - 1)
                      );


            const y =
                padding +
                chartHeight -
                (
                    (
                        item.weight -
                        chartMin
                    ) /
                    (
                        chartMax -
                        chartMin
                    )
                ) *
                chartHeight;


            if (
                index === 0
            ) {

                ctx.moveTo(
                    x,
                    y
                );

            } else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    ctx.stroke();


    /*
    Points
    */

    data.forEach(
        function(item, index) {

            const x =
                data.length === 1

                    ? canvas.width / 2

                    : padding +
                      (
                          chartWidth *
                          index /
                          (data.length - 1)
                      );


            const y =
                padding +
                chartHeight -
                (
                    (
                        item.weight -
                        chartMin
                    ) /
                    (
                        chartMax -
                        chartMin
                    )
                ) *
                chartHeight;


            ctx.fillStyle =
                "#111";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );


    /*
    Details
    */

    data.forEach(
        function(item, index) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "progress-stat";


            div.innerHTML = `

                <strong>
                    ${formatWorkoutDate(
                        item.date
                    )}
                </strong>

                <br>

                ${item.weight} lb

            `;


            details.appendChild(
                div
            );

        }
    );

}



/* =========================================
   PROGRESS VIEW / INDEXEDDB
========================================= */

let progressDB;


function openProgressDatabase() {

    return new Promise(
        function(resolve, reject) {

            const request =
                indexedDB.open(
                    "SolidFitnessDB",
                    1
                );


            request.onupgradeneeded =
                function(event) {

                    const db =
                        event.target.result;


                    if (
                        !db.objectStoreNames
                            .contains(
                                "progressMedia"
                            )
                    ) {

                        db.createObjectStore(
                            "progressMedia",
                            {
                                keyPath: "id"
                            }
                        );

                    }

                };


            request.onsuccess =
                function(event) {

                    progressDB =
                        event.target.result;

                    resolve(
                        progressDB
                    );

                };


            request.onerror =
                function() {

                    reject(
                        request.error
                    );

                };

        }
    );

}



async function saveProgressFile(
    file,
    date,
    note
) {

    if (
        !progressDB
    ) {

        await openProgressDatabase();

    }


    return new Promise(
        function(resolve, reject) {

            const transaction =
                progressDB.transaction(
                    "progressMedia",
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    "progressMedia"
                );


            const entry = {

                id:
                    Date.now(),

                date:
                    date,

                note:
                    note,

                name:
                    file.name,

                type:
                    file.type,

                file:
                    file

            };


            const request =
                store.add(entry);


            request.onsuccess =
                function() {

                    resolve();

                };


            request.onerror =
                function() {

                    reject(
                        request.error
                    );

                };

        }
    );

}



async function getProgressFiles() {

    if (
        !progressDB
    ) {

        await openProgressDatabase();

    }


    return new Promise(
        function(resolve, reject) {

            const transaction =
                progressDB.transaction(
                    "progressMedia",
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    "progressMedia"
                );


            const request =
                store.getAll();


            request.onsuccess =
                function() {

                    resolve(
                        request.result
                    );

                };


            request.onerror =
                function() {

                    reject(
                        request.error
                    );

                };

        }
    );

}



/* =========================================
   PROGRESS VIEW
========================================= */

progressViewButton.addEventListener(
    "click",
    function() {

        showSection(
            "progressViewSection"
        );

    }
);



document
    .getElementById(
        "saveProgressMedia"
    )
    .addEventListener(
        "click",
        async function() {

            const date =
                document.getElementById(
                    "progressDate"
                ).value;


            const file =
                document.getElementById(
                    "progressFile"
                ).files[0];


            const note =
                document.getElementById(
                    "progressNote"
                ).value.trim();


            if (
                date === ""
            ) {

                alert(
                    "Please select a date."
                );

                return;

            }


            if (
                !file
            ) {

                alert(
                    "Please choose a photo or video."
                );

                return;

            }


            try {

                await saveProgressFile(
                    file,
                    date,
                    note
                );


                alert(
                    "Progress saved!"
                );


                document.getElementById(
                    "progressFile"
                ).value = "";


                document.getElementById(
                    "progressNote"
                ).value = "";


                loadProgressMedia();

            } catch (error) {

                console.error(error);

                alert(
                    "There was a problem saving the progress file."
                );

            }

        }
    );



/* =========================================
   DISPLAY PROGRESS MEDIA
========================================= */

async function loadProgressMedia() {

    const list =
        document.getElementById(
            "progressMediaList"
        );


    list.innerHTML =
        "<p class='muted'>Loading...</p>";


    try {

        progressMedia =
            await getProgressFiles();


        progressMedia.sort(
            function(a, b) {

                return (
                    new Date(b.date) -
                    new Date(a.date)
                );

            }
        );


        displayProgressMedia();

        updateCompareSelectors();

    } catch (error) {

        console.error(error);

        list.innerHTML = `
            <p class="muted">
                Unable to load progress media.
            </p>
        `;

    }

}



function displayProgressMedia() {

    const list =
        document.getElementById(
            "progressMediaList"
        );


    list.innerHTML = "";


    if (
        progressMedia.length === 0
    ) {

        list.innerHTML = `

            <p class="muted">
                No progress photos or videos yet.
            </p>

        `;

        return;

    }


    progressMedia.forEach(
        function(entry) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "progress-media-card";


            const url =
                URL.createObjectURL(
                    entry.file
                );


            let mediaHTML = "";


            if (
                entry.type.startsWith(
                    "video/"
                )
            ) {

                mediaHTML = `

                    <video
                        src="${url}"
                        controls
                    ></video>

                `;

            } else {

                mediaHTML = `

                    <img
                        src="${url}"
                        alt="Progress photo"
                    >

                `;

            }


            card.innerHTML = `

                <div class="progress-media-info">

                    <div>

                        <h4>
                            ${formatWorkoutDate(
                                entry.date
                            )}
                        </h4>

                        <p>
                            ${
                                entry.note ||
                                "No note"
                            }
                        </p>

                    </div>

                </div>

                ${mediaHTML}


                <button
                    class="secondary-button delete-media"
                    data-id="${entry.id}"
                >
                    Delete
                </button>

            `;


            list.appendChild(
                card
            );

        }
    );


    document
        .querySelectorAll(
            ".delete-media"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    async function() {

                        const id =
                            Number(
                                button.dataset.id
                            );


                        await deleteProgressFile(
                            id
                        );


                        loadProgressMedia();

                    }
                );

            }
        );

}



async function deleteProgressFile(
    id
) {

    if (
        !progressDB
    ) {

        await openProgressDatabase();

    }


    return new Promise(
        function(resolve, reject) {

            const transaction =
                progressDB.transaction(
                    "progressMedia",
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    "progressMedia"
                );


            const request =
                store.delete(id);


            request.onsuccess =
                function() {

                    resolve();

                };


            request.onerror =
                function() {

                    reject(
                        request.error
                    );

                };

        }
    );

}



/* =========================================
   COMPARISON SELECTORS
========================================= */

function updateCompareSelectors() {

    const first =
        document.getElementById(
            "compareOne"
        );


    const second =
        document.getElementById(
            "compareTwo"
        );


    first.innerHTML = `

        <option value="">
            Select first entry
        </option>

    `;


    second.innerHTML = `

        <option value="">
            Select second entry
        </option>

    `;


    progressMedia.forEach(
        function(entry) {

            const label =
                formatWorkoutDate(
                    entry.date
                );


            const option1 =
                document.createElement(
                    "option"
                );


            option1.value =
                entry.id;

            option1.textContent =
                label;


            const option2 =
                document.createElement(
                    "option"
                );


            option2.value =
                entry.id;

            option2.textContent =
                label;


            first.appendChild(
                option1
            );

            second.appendChild(
                option2
            );

        }
    );

}



/* =========================================
   COMPARE
========================================= */

document
    .getElementById(
        "compareButton"
    )
    .addEventListener(
        "click",
        function() {

            const firstId =
                Number(
                    document.getElementById(
                        "compareOne"
                    ).value
                );


            const secondId =
                Number(
                    document.getElementById(
                        "compareTwo"
                    ).value
                );


            if (
                !firstId ||
                !secondId
            ) {

                alert(
                    "Please select two progress entries."
                );

                return;

            }


            if (
                firstId === secondId
            ) {

                alert(
                    "Please select two different entries."
                );

                return;

            }


            const first =
                progressMedia.find(
                    function(entry) {

                        return (
                            entry.id ===
                            firstId
                        );

                    }
                );


            const second =
                progressMedia.find(
                    function(entry) {

                        return (
                            entry.id ===
                            secondId
                        );

                    }
                );


            if (
                !first ||
                !second
            ) {

                return;

            }


            const comparison =
                document.getElementById(
                    "comparison"
                );


            comparison.innerHTML = "";


            comparison.appendChild(
                createComparisonCard(
                    first
                )
            );


            comparison.appendChild(
                createComparisonCard(
                    second
                )
            );

        }
    );



function createComparisonCard(
    entry
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "comparison-card";


    const url =
        URL.createObjectURL(
            entry.file
        );


    let mediaHTML = "";


    if (
        entry.type.startsWith(
            "video/"
        )
    ) {

        mediaHTML = `

            <video
                src="${url}"
                controls
            ></video>

        `;

    } else {

        mediaHTML = `

            <img
                src="${url}"
                alt="Progress comparison"
            >

        `;

    }


    card.innerHTML = `

        <h4>
            ${formatWorkoutDate(
                entry.date
            )}
        </h4>

        <p>
            ${entry.note || ""}
        </p>

        ${mediaHTML}

    `;


    return card;

}



/* =========================================
   DASHBOARD STATS
========================================= */

function updateStats() {

    let totalExercises = 0;

    let totalSets = 0;


    workoutHistory.forEach(
        function(workout) {

            totalExercises +=
                workout.exercises.length;


            workout.exercises.forEach(
                function(exercise) {

                    if (
                        Array.isArray(
                            exercise.sets
                        )
                    ) {

                        totalSets +=
                            exercise.sets.length;

                    }

                }
            );

        }
    );


    document.getElementById(
        "workoutCount"
    ).textContent =
        workoutHistory.length;


    document.getElementById(
        "exerciseCount"
    ).textContent =
        totalExercises;


    document.getElementById(
        "setCount"
    ).textContent =
        totalSets;

}



/* =========================================
   INITIALIZE
========================================= */

updateStats();

displayHistory();

displayMeals();

displaySleep();

setupProgress();

openProgressDatabase();
if ("serviceWorker" in navigator) {

window.addEventListener("load", function() {

navigator.serviceWorker.register("./service-worker.js");

});

}