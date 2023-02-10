document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');

  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');

  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckBox = document.createElement('input');

  filterLabel.textContent = "Ocultar los que no hayan respondido";
  filterCheckBox.type = 'checkbox';
  div.appendChild(filterLabel);
  div.appendChild(filterCheckBox);
  mainDiv.insertBefore(div, ul);
  filterCheckBox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const lis = ul.children;
    if (isChecked) {
      for (let i = 0; i < lis.length; i += 1) {
        let li = lis[i];
        if (li.className === 'responded') {
          li.style.display = '';
        } else {
          li.style.display = 'none';
        }
      }
    } else {
      for (let i = 0; i < lis.length; i += 1) {
        let li = lis[i];
        li.style.display = '';
      }
    }
  });

  function createLI(text) {
    function createElement(elementName, property, value) {
      const element = document.createElement(elementName);
      element[property] = value;
      return element;
    }

    function appendToLI(elementName, property, value) {
      const element = createElement(elementName, property, value);
      li.appendChild(element);
      return element;
    }

    const li = document.createElement('li');
    appendToLI('span', 'textContent', text);
    appendToLI('label', 'textContent', 'Confirmed')
      .appendChild(createElement('input', 'type', 'checkbox'));
    appendToLI('button', 'textContent', 'edit');
    appendToLI('button', 'textContent', 'remove');
    return li;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    input.value = '';
    const li = createLI(text);
    ul.appendChild(li);
    addGuest(text)
  });

  ul.addEventListener('change', (e) => {
    const checkbox = event.target;
    const checked = checkbox.checked;
    const listItem = checkbox.parentNode.parentNode;

    if (checked) {
      listItem.className = 'responded';
      updateGuest(listItem.id, listItem.firstElementChild.textContent, true)
    } else {
      listItem.className = '';
      updateGuest(listItem.id, listItem.firstElementChild.textContent, false)
    }
  });

  ul.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const button = e.target;
      const li = button.parentNode;
      const ul = li.parentNode;
      const action = button.textContent;
      const nameActions = {
        remove: () => {
          removeGuest(li.id);
          ul.removeChild(li);
        },
        edit: () => {
          const span = li.firstElementChild;
          const input = document.createElement('input');
          input.type = 'text';
          input.value = span.textContent;
          li.insertBefore(input, span);
          li.removeChild(span);
          button.textContent = 'save';
        },
        save: () => {
          const input = li.firstElementChild;
          const span = document.createElement('span');
          span.textContent = input.value;
          li.insertBefore(span, input);
          li.removeChild(input);
          button.textContent = 'edit';
          updateGuest(li.id, span.textContent, li.childNodes[1].childNodes[1].checked)
        }
      };

      // select and run action in button's name
      nameActions[action]();
    }
  });

  function createListItem(guest) {
    const listItem = document.createElement("li");
    const span = document.createElement("span");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const editButton = document.createElement("button");
    const removeButton = document.createElement("button");

    span.textContent = guest.nombre;
    label.textContent = "Confirmed ";
    input.setAttribute("type", "checkbox");
    input.checked = guest.confirmado;
    if (guest.confirmado) listItem.className = 'responded';
    editButton.textContent = "edit";
    removeButton.textContent = "remove";
    listItem.id = guest.id;

    label.appendChild(input);
    listItem.appendChild(span);
    listItem.appendChild(label);
    listItem.appendChild(editButton);
    listItem.appendChild(removeButton);

    return listItem;
  }

  const xhttp = new XMLHttpRequest();
  xhttp.open('GET', 'http://localhost:3000/invitados');
  xhttp.send();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(this.responseText);
      data.forEach(guest => {
        ul.appendChild(createListItem(guest))
      })
    }
  }

  function addGuest(nombre) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', `http://localhost:3000/invitados`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ nombre, confirmado: false }));
  }

  function updateGuest(id, nombre, confirmado) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('PUT', `http://localhost:3000/invitados/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ nombre, confirmado }));
  }

  function removeGuest(id) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('DELETE', `http://localhost:3000/invitados/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send();
  }


});









