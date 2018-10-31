var addTasksBtn = document.getElementById('addTasks');
var removeWindowMinimize = document.getElementById('removeWindowMinimize');
var toggleArticleAddTask = document.getElementById('toggleArticle');
var addNewTaskSection = document.getElementById('addNewTaskSection');
var textNewTask = document.getElementById('textNewTask');
var deleteTaskButton = document.querySelectorAll('.close');
var inputs = document.getElementsByTagName('input');


addTasksBtn.addEventListener('click', function() {
    toggleArticleAddTask.style.display = 'block';
});
removeWindowMinimize.addEventListener('click', function() {
    toggleArticleAddTask.style.display = 'none';
});

textNewTask.addEventListener('keydown', addNewTaskDiv);
function addNewTaskDiv(event) {
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
                inputs[i].addEventListener('click', function() {
                    var parentDiv = this.parentElement;
                    parentDiv.classList.toggle('opacity-div-task');
                    var siblingElement = this.nextElementSibling;
                    siblingElement.classList.toggle('text-done-task');

                });
            }
        }
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
        inputs[i].addEventListener('click', function() {
            console.log('hello');
            var parentDiv = this.parentElement;
            console.log(parentDiv)
            parentDiv.classList.toggle('opacity-div-task');
            var siblingElement = this.nextElementSibling;
            siblingElement.classList.toggle('text-done-task');

        });
    }
}

