var addTasksBtn = document.getElementById('addTasks');
var removeWindowMinimize = document.getElementById('removeWindowMinimize');
var toggleArticleAddTask = document.getElementById('toggleArticle');
var addNewTaskSection = document.getElementById('addNewTaskSection');
var textNewTask = document.getElementById('textNewTask');
var deleteTaskButton = document.querySelectorAll('.close');
var inputs = document.getElementsByTagName('input');
var dbIdCounter = 0;


addTasksBtn.addEventListener('click', function() {
    toggleArticleAddTask.style.display = 'block';
});
removeWindowMinimize.addEventListener('click', function() {
    toggleArticleAddTask.style.display = 'none';
});

textNewTask.addEventListener('keydown', addNewTaskDiv);
function addNewTaskDiv(event) {
    var todoInputText = textNewTask.value;
    if (event.keyCode === 13 && textNewTask.value !== '') {

        var div = document.createElement('div');
        var input = document.createElement('input');
        var p = document.createElement('p');
        var span = document.createElement('span');

        addNewTaskSection.appendChild(div);
        div.appendChild(input);
        div.appendChild(p);
        div.appendChild(span);

        div.classList.add('tasks');
        input.setAttribute('type', 'checkbox');
        p.innerText = textNewTask.value;
        span.innerText = '[x]';
        span.classList.add('close');

        textNewTask.value = '';

        var deleteTaskButton = document.querySelectorAll('.close');
        for (i = 0; i < deleteTaskButton.length; i++) {
            deleteTaskButton[i].addEventListener('click', removeDiv)
        }

        var inputs = document.getElementsByTagName('input');
        for( var i = 0; i < inputs.length; i++) {
            if(inputs[i].type === 'checkbox') {
                inputs[i].addEventListener('click', doneTask);
            }
        }
        console.log(dbIdCounter);
        db.transaction(function (tx) { // добавили данные в БД
            tx.executeSql('INSERT INTO TODO (id, task) VALUES (?, ?)', [dbIdCounter, todoInputText]);
        });
        dbIdCounter++;
        console.log(dbIdCounter);
    }
}

for (var i =0; i < deleteTaskButton.length; i++) {
    deleteTaskButton[i].addEventListener('click', removeDiv)
}
function removeDiv() {
    var removeDiv = this.parentElement;
    addNewTaskSection.removeChild(removeDiv);
}


for( var i = 0; i < inputs.length; i++) {
    if(inputs[i].type === 'checkbox') {
        inputs[i].addEventListener('click', doneTask);
    }
}
function doneTask() {
    console.log('hello');
    var parentDiv = this.parentElement;
    parentDiv.classList.toggle('opacity-div-task');
    var siblingElement = this.nextElementSibling;
    siblingElement.classList.toggle('text-done-task');
}


var db = openDatabase('mydb', '1.0', 'Todo DB', 2 * 1024 * 1024);

db.transaction(function (tx) { // создали БД
    tx.executeSql('CREATE TABLE IF NOT EXISTS TODO (id, task)');
});

db.transaction(function (tx) { // получить элемент из БД
    tx.executeSql('SELECT * FROM TODO', [], function (tx, data) {
        var changeText = document.getElementsByTagName('p');
        //console.log(data.rows[0].task, data.rows[1].task);
        for (var i = 0; i < data.rows.length; i++) {
            changeText[i].innerText = data.rows[i].task;
            console.log(data.rows[i].id, data.rows[i].task)
        }
    });
});

db.transaction(function (tx) { // удалить указанный id
    tx.executeSql("DELETE FROM TODO WHERE ID=?",[3]);
});