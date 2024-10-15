const teacherName = document.querySelector("#tname");
const quantityInput = document.querySelector('#quantity');
const addButton = document.querySelector(".button");
const rows = document.querySelectorAll("tr");
const tds = document.querySelectorAll(".td");
const prevRowButton = document.querySelector('#up');
const nextRowButton = document.querySelector('#down');
const deleteButton = document.querySelector("#delete");
const errorMessage = document.querySelector('.error');
const clearTableButton = document.querySelector(".clear");

const tableData = [
    {
        tName : "თორნიკე ბურჯანაძე",
        subject : "ვებ გვერდის მარკირება და სტილებით გაფორმება",
        hours : 15,
        id : "001"
    },
    {
        tName : "ხათუნა დოლიძე",
        subject :  "მეწარმეობა",
        hours : 4,
        id : "002"
    }
];

let currentRowIndex = 2;    

const highlightCurrentRow = function() {
    rows.forEach(row => row.classList.remove("current-row"));
    
    rows[currentRowIndex].classList.add("current-row");
    console.log(currentRowIndex)
};


const saveTableToLocalStorage = function() {
    const tableContent = [];

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll(".td");
        const rowData = Array.from(cells).map(cell => cell.textContent);
        tableContent.push(rowData);
    });

    localStorage.setItem("tableContent", JSON.stringify(tableContent));
};

const loadTableFromLocalStorage = function() {
    const storedTable = localStorage.getItem("tableContent");

    if (storedTable) {
        const tableContent = JSON.parse(storedTable);

        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll(".td");
            if (tableContent[rowIndex]) {
                tableContent[rowIndex].forEach((cellContent, cellIndex) => {
                    if (cells[cellIndex]) {
                        cells[cellIndex].textContent = cellContent || "";
                    }
                });
            }
        });
    }
};


const addSubject = function() {
    const teacher = teacherName.value;
    const quantity = parseInt(quantityInput.value) || 1;

    const teacherData = tableData.find(obj => obj.tName === teacher);

    if (teacherData && currentRowIndex < rows.length) {
        let addedCount = 0;
        let cells = rows[currentRowIndex].querySelectorAll(".td");

       
        const selectedCell = document.querySelector(".selected");

    
        let startIndex = -1;
        
        if (selectedCell) {
            startIndex = Array.from(cells).indexOf(selectedCell);
        }

        
        if (startIndex !== -1 && startIndex < cells.length) {
            for (let i = startIndex; i < cells.length && addedCount < quantity; i++) {
                let cell = cells[i];

               
                if (cell.classList.contains('skip')) {
                    continue; 
                }

                if (!cell.textContent.trim()) {
                    cell.textContent = teacherData.subject;
                    addedCount++;
                }
            }
            saveTableToLocalStorage(); // save to localstorage
        } else {
            errorMessage.textContent = "აირჩიეთ უჯრა და ხაზი ჩასაწერად";

            setTimeout(() => {
                errorMessage.textContent = "";
            }, 5000)
        }
    } else {
        errorMessage.textContent = "მასწავლებელი ვერ მოიძებნა";
        setTimeout(() => {
            errorMessage.textContent = "";
        }, 5000)
    }
};

document.body.addEventListener('click', function(event) {
    if (!event.target.closest('td')) {
        tds.forEach(td => td.classList.remove('selected'));
    }
});

tds.forEach(td => {
    td.addEventListener('click', function(event) {
        event.stopPropagation();

        tds.forEach(cell => cell.classList.remove('selected'));

 
        this.classList.add('selected');
    });

    td.addEventListener('dblclick', function() {
        this.classList.toggle('skip'); 
    });
});



const clearTd = function() {
    deleteButton.addEventListener("click", () => {
        const selectedCell = document.querySelector(".selected");
        if (selectedCell) {
            selectedCell.textContent = ""; // Clear content
            saveTableToLocalStorage(); // Save the updated table to localStorage
        }
    });
};



// clear entire table
const clearWholeTable = function() {
    if (confirm("ნამდვილად გინდათ მთილანი ცხრილის წაშლა?")) {
        tds.forEach(td => {
            td.textContent = "";
        });

        
        localStorage.removeItem("tableContent");

        
        errorMessage.textContent = "ცხრილი წარმატებით წაიშალა.";
        setTimeout(() => {
            errorMessage.textContent = "";
        }, 5000);
    }
};

// Attach event listener to the clear table button
clearTableButton.addEventListener("click", clearWholeTable);

clearTd();


const moveToNextRow = function() {
    if (currentRowIndex < rows.length - 1) {
        currentRowIndex++; 
        highlightCurrentRow();
    } 
};

const moveToPrevRow = function() {
    if (currentRowIndex > 0) {
        currentRowIndex--; 
        highlightCurrentRow();
    } 
};


//loop working hours as options

const selectEl = document.querySelectorAll('select');


const options = [
    {value : "001", text : "9:00 - 9:40"},
    {value : "001", text : "9:45 - 10:30"},
    {value : "001", text : "9:00 - 9:40"},
    {value : "001", text : "9:00 - 9:40"},
    {value : "001", text : "9:00 - 9:40"},
]

const displaySelects = function() {
    selectEl.forEach(select => {
        options.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.textContent = optionData.text;

            select.appendChild(option)
        });
    });
};


loadTableFromLocalStorage();
highlightCurrentRow();
// displaySelects();

// Attach event listeners
addButton.addEventListener("click", addSubject);
nextRowButton.addEventListener("click", moveToNextRow);
prevRowButton.addEventListener("click", moveToPrevRow); 
clearTableButton.addEventListener("click", clearWholeTable);



