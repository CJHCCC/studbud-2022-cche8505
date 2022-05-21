// 点击添加任务
const addTaskBtn = document.getElementById("addTaskList");
var addTaskContent = document.getElementById("addTaskContent");
addTaskContent.style.display = "block";
addTaskContent.style.top = (addTaskBtn.offsetTop+addTaskBtn.offsetHeight)+"px";
addTaskContent.style.left = (addTaskBtn.offsetLeft)+"px";
addTaskBtn.addEventListener("click", function(e){
    var addTaskContent = document.getElementById("addTaskContent");
    addTaskContent.style.display = "block";
    addTaskContent.style.top = (addTaskBtn.offsetTop+addTaskBtn.offsetHeight)+"px";
    addTaskContent.style.left = (addTaskBtn.offsetLeft)+"px";
});



// Basic form DOM elements
const taskform = document.getElementById("taskform");
// const button = document.querySelector("#taskform > button")

// Selector for the tasklist output
var tasklist = document.querySelector("#tasklist > ul");

// DOM elements for the task input fields
var taskInput = document.getElementById("taskInput");
var dueDateInput = document.getElementById("dueDateInput");
var completionTimeInput = document.getElementById("completionTimeInput");
var estimatedTimeInput = document.getElementById("estimatedTimeInput");
var priorityInput = document.getElementById("priorityInput");

// Form submission event listener
taskform.addEventListener("submit", function(event) {
    event.preventDefault();
    let task = taskInput.value;
    let dueDate = dueDateInput.value;
    let completionTime = completionTimeInput.value;
    let estimatedTime = estimatedTimeInput.value;
    let priorityRating = priorityInput.options[priorityInput.selectedIndex].value;
    if (task) {
        addTask(task, dueDate, estimatedTime, priorityRating, completionTime, false);
        var addTaskContent = document.getElementById("addTaskContent");
        addTaskContent.style.display = "none";
    }
})

// Create global array to track tasks
var taskListArray = [];

// Function to add task with user inputs as parameters
function addTask(taskDescription, dueDate, estimatedTime, priorityRating, completionTime, completionStatus) {
    let d = new Date();
    let dateCreated = d.getFullYear();
    let priorityRatingLevel = 0;
    if(priorityRating === 'Low'){
        priorityRatingLevel = 1;
    }else if(priorityRating === 'Medium'){
        priorityRatingLevel = 2;
    }else if(priorityRating === 'High'){
        priorityRatingLevel = 3;
    }
    let task = {
        id: Date.now(),
        taskDescription,
        dueDate,
        dateCreated,
        estimatedTime,
        completionTime,
        priorityRating,
        priorityRatingLevel,
        estimatedTime,
        completionStatus,
    };
    taskListArray.push(task);
    if (sortType == "due"){
        taskListArray.sort(function(a, b){
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    }else if (sortType == "rate"){
        taskListArray.sort(function(a, b){
            return b.priorityRatingLevel - a.priorityRatingLevel;
        });
    }
    tasklist.innerHTML = "";
    taskListArray.forEach(function(task){
        renderTask(task);
    });
}

// Function to display task on screen
function renderTask(task) {

    // Call function - checks if a task has been added
    updateEmptyTask();

    // Create HTML elements
    let item = document.createElement("li");
    item.setAttribute('data-id', task.id);
    item.innerHTML = task.taskDescription + "<br>"+
      "Due: "+ task.dueDate+ " " + task.completionTime+"<br>"+
      "Est. Time: " + task.estimatedTime + "hours" + "<br>"+
      "Priority: " + task.priorityRating + "<br>";

    tasklist.appendChild(item);

    let div = document.createElement("div");
    div.style.display = "flex"; 
    div.style.justifyContent = "space-between";
    // Extra Task DOM elements
    let delButton = document.createElement("button");
    let delButtonText = document.createTextNode("Delete Task");
    delButton.appendChild(delButtonText);
    let finishButton = document.createElement("input");
    finishButton.type = "checkbox";
    finishButton.style.width = "20px";
    finishButton.style.height = "20px";
    item.appendChild(div);
    div.appendChild(delButton);
    div.appendChild(finishButton);


    // Event Listeners for DOM elements
    delButton.addEventListener("click", function(event) {
        event.preventDefault();
        let id = event.target.parentElement.getAttribute('data-id');
        let index = taskListArray.findIndex(task => task.id === Number(id));
        removeItemFromArray(taskListArray, index)
        updateEmptyTask();
        item.remove();
    })

    finishButton.addEventListener("click", function(event){
        // event.preventDefault();
        let id = event.target.parentElement.getAttribute('data-id');
        let item = taskListArray.find(task => task.id === Number(id));
        item.completionStatus = !event.target.value;
    });

    // Clear the input form
    form.reset();
}

// Function to remove item from array
function removeItemFromArray(arr, index) {
    if (index > -1) {
        arr.splice(index, 1)
    }
    return arr;
}

// Function to hide the 'you haven't added any tasks' text
function updateEmptyTask() {
    if (taskListArray.length > 0) {
        document.getElementById('emptyTaskList').style.display = 'none';
    } else {
        document.getElementById('emptyTaskList').style.display = 'block';
    }
}

// due排序
const dueSortBtn = document.getElementById("dueSort")
let sortType = "";
dueSortBtn.addEventListener("click", function(e){
    sortType = "due";
    e.target.style.background = "#000";
    e.target.style.color = "#fff";
    document.getElementById("rateSort").style.background = "";
    document.getElementById("rateSort").style.color = "";
    taskListArray.sort(function(a, b){
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    tasklist.innerHTML = "";
    taskListArray.forEach(function(task){
        renderTask(task);
    });
});

// rate排序
const rateSortBtn = document.getElementById("rateSort");
rateSortBtn.addEventListener("click", function(e){
    sortType = "rate";
    e.target.style.background = "#000";
    dueSortBtn.style.background = "#fff";
    e.target.style.color = "#fff";
    dueSortBtn.style.color = "#000";
    taskListArray.sort(function(a, b){
        return b.priorityRatingLevel - a.priorityRatingLevel;
    });
    tasklist.innerHTML = "";
    taskListArray.forEach(function(task){
        renderTask(task);
    });
});