const taskInput = document.getElementById('taskInput');
const subjectSelect = document.getElementById('subject');
const prioritySelect = document.getElementById('priority');
const dueDateInput = document.getElementById('dueDate');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const clearBtn = document.getElementById('clearBtn');


const editModal = document.getElementById('editModal');
const editTaskInput = document.getElementById('editTaskInput');
const editSubjectSelect = document.getElementById('editSubjectSelect');
const editPrioritySelect = document.getElementById('editPrioritySelect');
const editDueDate = document.getElementById('editDueDate');
const saveEditBtn = document.getElementById('saveEdit');
const cancelEditBtn = document.getElementById('cancelEdit');

let tasks = [];
let editIndex = null;
try {
  const stored = JSON.parse(localStorage.getItem('tasks'));
  tasks = Array.isArray(stored) ? stored : [];
} catch (e) {
  tasks = [];
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getPriorityValue(priority) {
  return { High: 1, Medium: 2, Low: 3 }[priority] || 4;
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.sort((a, b) => getPriorityValue(a.priority) - getPriorityValue(b.priority));

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) span.classList.add('completed');

    const leftDiv = document.createElement('div');
    leftDiv.className = 'task-left';
    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    const subjectTag = document.createElement('span');
    subjectTag.className = 'task-subject';
    subjectTag.textContent = task.subject;

    const priorityTag = document.createElement('span');
    priorityTag.className = 'task-priority';
    priorityTag.textContent = task.priority;

    const dateTag = document.createElement('span');
    dateTag.className = 'task-date';
    dateTag.textContent = task.dueDate ? `📅 ${task.dueDate}` : '';

    const tagGroup = document.createElement('div');
    tagGroup.className = 'tag-group'; // You should define this in CSS for alignment
    tagGroup.appendChild(subjectTag);
    tagGroup.appendChild(priorityTag);
    tagGroup.appendChild(dateTag);

    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️';
    editBtn.className = 'action-btn';
    editBtn.onclick = () => {
      editTaskInput.value = task.text;
      editSubjectSelect.value = task.subject;
      editPrioritySelect.value = task.priority;
      editDueDate.value = task.dueDate || '';
      editIndex = index;
      editModal.classList.remove('hidden');
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.className = 'action-btn';
    deleteBtn.onclick = () => {
      const confirmDelete = confirm('Are you sure you want to delete this task?');
      if (confirmDelete) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      }
    };

    const buttonGroup = document.createElement('div');
    buttonGroup.appendChild(editBtn);
    buttonGroup.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(tagGroup);
    li.appendChild(buttonGroup);

    taskList.appendChild(li);
  });
}

addBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const subject = subjectSelect.value;
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  if (taskText === '') {
    alert('Please enter a task!');
    return;
  }

  if (/^\d+$/.test(taskText)) {
    alert('Task name cannot be only numbers!');
    return;
  }

  tasks.push({ text: taskText, subject, priority, dueDate, completed: false });
  saveTasks();
  renderTasks();

  taskInput.value = '';
  dueDateInput.value = '';
});

clearBtn.onclick = () => {
  if (confirm('Clear all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
};

saveEditBtn.onclick = () => {
  const newText = editTaskInput.value.trim();
  const newSubject = editSubjectSelect.value;
  const newPriority = editPrioritySelect.value;
  const newDate = editDueDate.value;

  if (newText === '') {
    alert('Task cannot be empty');
    return;
  }

  if (/^\d+$/.test(newText)) {
    alert('Task name cannot be only numbers!');
    return;
  }

  tasks[editIndex] = {
    ...tasks[editIndex],
    text: newText,
    subject: newSubject,
    priority: newPriority,
    dueDate: newDate
  };

  saveTasks();
  renderTasks();
  editModal.classList.add('hidden');
};

cancelEditBtn.onclick = () => {
  editModal.classList.add('hidden');
};

renderTasks();
