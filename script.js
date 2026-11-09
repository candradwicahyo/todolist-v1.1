window.addEventListener('DOMContentLoaded', () => {

  // task
  let task = 0;
  let taskComplete = 0;

  // task html element 
  const allTaskHTML = document.querySelector('.all-task-html');
  const taskHTML = document.querySelector('.task-html');
  const taskCompleteHTML = document.querySelector('.task-complete-html');
  const progressBar = document.querySelector('.bar');

  // show and hide floating form
  const floatingBtn = document.querySelector('.floating-btn');
  const overlay = document.querySelector('.overlay');
  const closeBtn = overlay.querySelector('.btn-close');
  const cancelBtn = overlay.querySelector('.btn-cancel');

  floatingBtn.addEventListener('click', () => overlay.classList.add('active'));
  closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  cancelBtn.addEventListener('click', () => overlay.classList.remove('active'));

  // add task
  const content = document.querySelector('.content');
  const input = document.querySelector('.input');
  const submitBtn = document.querySelector('.btn-submit');

  submitBtn.addEventListener('click', () => {
    const inputValue = input.value.trim();
    if (validateInput(inputValue)) {
      const result = createHTML(inputValue);
      content.insertAdjacentHTML('afterbegin', result);
      task++;
      updateTasks();
      sweetAlert('success', 'Good Job', 'New task has been added!');
      input.value = '';
    }
  });

  function sweetAlert(type, title, text) {
    swal.fire({
      icon: type,
      title: title,
      text: text
    });
  }

  function validateInput(value) {
    if (!value) return sweetAlert('error', 'Something Wrong', 'Input is empty!');
    if (value.length < 2) return sweetAlert('error', 'Something Wrong', 'Too Short! must be more than 2 character!');
    if (value.length > 20) return sweetAlert('error', 'Something Wrong', 'Too Long! must be less than 20 characters!');
    return true;
  }

  function createHTML(value) {
    return `
    <div class="box-content">
      <div class="box-input-wrapper">
        <input type="checkbox" name="task${task}" id="task${task}" class="checkbox-input">
        <label for="task${task}" class="text">${value}</label>
      </div>
      <div class="box-action-wrapper">
        <button class="btn-action btn-edit">
          <i class="fa-solid fa-pen icon-pen"></i>
        </button>
        <button class="btn-action btn-delete">
          <i class="fa-solid fa-trash icon-trash"></i>
        </button>
      </div>
    </div>
    `;
  }

  function updateTasks() {
    let percent = 0;
    allTaskHTML.textContent = `${taskComplete} of ${task} ${task > 1 ? 'Tasks' : 'task'} Completed`;
    taskHTML.textContent = taskComplete == 0 ? task : task - taskComplete;
    taskCompleteHTML.textContent = taskComplete;
    percent = task == 0 ? 0 : (taskComplete / task) * 100;
    progressBar.style.width = `${percent}%`;
  }

  updateTasks();

  // completed task
  document.addEventListener('change', event => {
    const checkbox = event.target.closest('.checkbox-input');
    if ( checkbox ) {
      const text = checkbox.closest('.box-content').querySelector('.text');
      text.classList.toggle('active', checkbox.checked);
      taskComplete = checkbox.checked ? ++taskComplete : --taskComplete;
      updateTasks();
    }
  });

  // delete task
  document.addEventListener('click', event => {
    const deleteBtn = event.target.closest('.btn-delete');
    if ( deleteBtn ) {
      const box = deleteBtn.closest('.box-content');
      // sweetalert2
      swal.fire({
        icon: 'question',
        title: 'Are you sure?',
        text: 'Do you really want to delete this task?',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then(result => {
        if (result.isConfirmed) {
          task = task == 0 ? 0 : --task;
          taskComplete = taskComplete == 0 ? 0 : --taskComplete;
          updateTasks();
          box.remove();
          sweetAlert('success', 'Good Job', 'Task has been deleted!');
        }
      });
    }
  });

  // edit task
  document.addEventListener('click', event => {
    const editBtn = event.target.closest('.btn-edit');
    if ( editBtn ) {
      const text = editBtn.closest('.box-content').querySelector('.text');
      const result = prompt('Edit task ...', text.textContent);
      text.textContent = result == '' || !result ? text.textContent : result;
      updateTasks();
      sweetAlert('success', 'Good Job', 'Task has been edited!');
    }
  });

  let keyword = '';
  let select = 'all';

  // search task
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('input', function() {
    keyword = this.value.trim().toLowerCase();
    filterContent();
  });

  const selectInput = document.querySelector('.select-input');
  selectInput.addEventListener('change', function() {
    select = this.value.toLowerCase();
    filterContent();
  });

  function filterContent() {
    const boxContent = document.querySelectorAll('.box-content');
    boxContent.forEach(box => {
      const checkbox = box.querySelector('.checkbox-input').checked;
      const text = box.querySelector('.text').textContent;
      const matchSelect = select == 'all' || select == 'active' && !checkbox || select == 'completed' && checkbox;
      const matchSearch = text.includes(keyword);
      box.style.display = matchSelect && matchSearch ? '' : 'none';
    });
  }

  // clear all task
  const clearBtn = document.querySelector('.btn-clear');
  clearBtn.addEventListener('click', () => {
    if (task == 0 && taskComplete == 0) return sweetAlert('question', 'What\'s wrong with you?', 'Are you retarded?');
    swal.fire({
      icon: 'question',
      title: 'Are you sure?',
      text: 'Do you really want to delete all task?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes'
    }).then(result => {
      if ( result.isConfirmed ) {
        task = 0, taskComplete = 0;
        updateTasks();
        content.innerHTML = '';
        sweetAlert('success', 'All task is gone!', 'All task has been deleted!');
      }
    });
  });
  
});