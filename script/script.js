var addTasksBtn = document.getElementById('addTasks');
var removeWindowMinimize = document.getElementById('removeWindowMinimize');
var toggleArticleAddTask = document.getElementById('toggleArticle');
var addNewTaskSection = document.getElementById('addNewTaskSection');
var textNewTask = document.getElementById('textNewTask');
var deleteTaskButton = document.querySelectorAll('.close');
var inputs = document.getElementsByTagName('input');

var dbIdCounter = localStorage.getItem('dbIdCounter') || 0; // счетчик id, при перезагрузке страницы продолжит отсчет, пока не будет очищен LocalStorage


addTasksBtn.addEventListener('click', function() { // показать окно задач
    toggleArticleAddTask.style.display = 'block';
});
removeWindowMinimize.addEventListener('click', function() { // свернуть окно задач
    toggleArticleAddTask.style.display = 'none';
});
textNewTask.addEventListener('keydown', addNewTaskDiv); // добавляет новую задачу


var db = openDatabase('mydb', '1.0', 'Todo DB', 2 * 1024 * 1024);  // создали БД

db.transaction(function (tx) { // создали таблицу
    tx.executeSql('CREATE TABLE IF NOT EXISTS TODO (id, task)');
});


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
        p.classList.add('p-tag-size');        
        span.innerText = '[x]';
        span.classList.add('close');

        textNewTask.value = '';

        var deleteTaskButton = document.querySelectorAll('.close');
        for (i = 0; i < deleteTaskButton.length; i++) { // удаляет новые созданные задания
            deleteTaskButton[i].addEventListener('click', removeDiv)
        }

        var inputs = document.getElementsByTagName('input');
        for( var i = 0; i < inputs.length; i++) { // отмечает новые созданные задания
            if(inputs[i].type === 'checkbox') {
                inputs[i].addEventListener('click', doneTask);
            }
        }

        var changeTaskTagP = document.getElementsByTagName('p'); // изменяет текст БД и в таблице, клик именно по тексту
        for (i = 0; i < changeTaskTagP.length; i++) {
            changeTaskTagP[i].addEventListener('click', changeTaskText)
        }

        db.transaction(function (tx) { // добавили данные в БД
            tx.executeSql('INSERT INTO TODO (id, task) VALUES (?, ?)', [dbIdCounter, todoInputText]);
        });
        dbIdCounter++;
        localStorage.setItem('dbIdCounter', dbIdCounter)
    }
}

// for (var i =0; i < deleteTaskButton.length; i++) { // удаляет задания, созданные в html
//     deleteTaskButton[i].addEventListener('click', removeDiv)
// }

function removeDiv() {
    var removeDiv = this.parentElement;
    var pElementText = this.previousSibling.innerText; // получить значение тега p, который расположен перед кнопкой Close
    addNewTaskSection.removeChild(removeDiv);

    db.transaction(function (tx) { // получить элемент из БД
        tx.executeSql('SELECT * FROM TODO', [], function (tx, data) {

            for (var i = 0; i < data.rows.length; i++) {
                if (pElementText === data.rows[i].task) { // перебрать все задачи и сравнить с полученным тегом p, удалить найденный id из БД 
                    tx.executeSql("DELETE FROM TODO WHERE ID=?",[data.rows[i].id]);
                }
            }
        });
    });
}


// for( var i = 0; i < inputs.length; i++) { // отмечает задания, созданные в html
//     if(inputs[i].type === 'checkbox') {
//         inputs[i].addEventListener('click', doneTask);
//     }
// }

function doneTask() {
    console.log('done task');
    var parentDiv = this.parentElement;
    parentDiv.classList.toggle('opacity-div-task');
    var siblingElement = this.nextElementSibling;
    siblingElement.classList.toggle('text-done-task');
}

function changeTaskText() {
    var thisTaskText = this.innerHTML; // текст p, на котором был клик
    var newTaskText = prompt('New Task Text'); // новый текст

    this.innerHTML = newTaskText; // изменили текст в таблице

    db.transaction(function (tx) { // получить элемент из БД        
        tx.executeSql('SELECT * FROM TODO', [], function (tx, data) {
            for (var i = 0; i < data.rows.length; i++) {
                if (thisTaskText === data.rows[i].task) { // перебрать все задачи и сравнить с текстом, на котором был клик 
                    tx.executeSql("DELETE FROM TODO WHERE ID=?",[data.rows[i].id]); // удалить найденный id из БД
                    tx.executeSql('INSERT INTO TODO (id, task) VALUES (?, ?)', [data.rows[i].id, newTaskText]); // создать новую строку с этим же id, но новым текстом
                }
            }
        });
    });
}


// var db = openDatabase('mydb', '1.0', 'Todo DB', 2 * 1024 * 1024);

// db.transaction(function (tx) { // создали БД
//     tx.executeSql('CREATE TABLE IF NOT EXISTS TODO (id, task)');
// });

// db.transaction(function (tx) { // получить элемент из БД
//     tx.executeSql('SELECT * FROM TODO', [], function (tx, data) {
//         var changeText = document.getElementsByTagName('p');
//         //console.log(data.rows[0].task, data.rows[1].task);
//         for (var i = 0; i < data.rows.length; i++) {
//             changeText[i].innerText = data.rows[i].task;
//             console.log(data.rows[i].id, data.rows[i].task)
//         }
//     });
// });

// db.transaction(function (tx) { // удалить указанный id
//     tx.executeSql("DELETE FROM TODO WHERE ID=?",[8]);
// });