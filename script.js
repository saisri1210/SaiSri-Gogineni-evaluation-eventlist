document.addEventListener('DOMContentLoaded', () => {
    const addEventBtn = document.querySelector('.add-event-btn');
    const tableBody = document.querySelector('tbody');

    addEventBtn.addEventListener('click', addNewEvent);

    // Fetch and display existing events
    fetch('http://localhost:3000/events')
        .then(response => response.json())
        .then(events => {
            events.forEach(event => appendEventRow(event));
        });

    function addNewEvent() {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" placeholder="Event Name"></td>
            <td><input type="date"></td>
            <td><input type="date"></td>
            <td>
                <button class="save-btn">
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg>
                save
                    </button>
                <button class="cancel-btn">
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg>
                cancel
                    </button>
            </td>
        `;
        tableBody.appendChild(newRow);

        const saveBtn = newRow.querySelector('.save-btn');
        const cancelBtn = newRow.querySelector('.cancel-btn');
        
        saveBtn.addEventListener('click', () => saveEvent(newRow));
        cancelBtn.addEventListener('click', () => newRow.remove());
    }

    function saveEvent(row) {
        const event = {
            name: row.cells[0].querySelector('input').value,
            start: row.cells[1].querySelector('input').value,
            end: row.cells[2].querySelector('input').value
        };

        fetch('http://localhost:3000/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        })
        .then(response => response.json())
        .then(newEvent => {
            row.remove();
            appendEventRow(newEvent);
        });
    }

    function editEvent(row, event) {
        row.cells[0].innerHTML = `<input type="text" value="${event.name}">`;
        row.cells[1].innerHTML = `<input type="date" value="${event.start}">`;
        row.cells[2].innerHTML = `<input type="date" value="${event.end}">`;
        row.cells[0].querySelector('input').focus();

        const saveBtn = document.createElement('button');
        saveBtn.classList.add('save-btn');
        saveBtn.innerHTML = '<svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg> save';

        const cancelBtn = document.createElement('button');
        cancelBtn.classList.add('cancel-btn');
        cancelBtn.innerHTML = '<svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg> cancel';

        row.querySelector('td:last-child').innerHTML = '';
        row.querySelector('td:last-child').appendChild(saveBtn);
        row.querySelector('td:last-child').appendChild(cancelBtn);

        saveBtn.addEventListener('click', () => updateEvent(row, event.id));
        cancelBtn.addEventListener('click', () => cancelEdit(row, event));
    }

    function updateEvent(row, id) {
        const event = {
            name: row.cells[0].querySelector('input').value,
            start: row.cells[1].querySelector('input').value,
            end: row.cells[2].querySelector('input').value
        };

        fetch(`http://localhost:3000/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(event)
        })
        .then(response => response.json())
        .then(updatedEvent => {
            row.remove();
            appendEventRow(updatedEvent);
        });
    }

    function deleteEvent(row, id) {
        fetch(`http://localhost:3000/events/${id}`, {
            method: 'DELETE'
        })
        .then(() => row.remove());
    }

    function appendEventRow(event) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${event.name}</td>
            <td>${event.start}</td>
            <td>${event.end}</td>
            <td>
                <button class="edit-btn">
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                edit
                    </button>
                <button class="delete-btn">
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                delete
                    </button>
            </td>
        `;
        tableBody.appendChild(newRow);

        const editBtn = newRow.querySelector('.edit-btn');
        const deleteBtn = newRow.querySelector('.delete-btn');

        editBtn.addEventListener('click', () => editEvent(newRow, event));
        deleteBtn.addEventListener('click', () => deleteEvent(newRow, event.id));
    }

    function cancelEdit(row, event) {
        row.cells[0].innerText = event.name;
        row.cells[1].innerText = event.start;
        row.cells[2].innerText = event.end;

        const actionCell = row.querySelector('td:last-child');
        actionCell.innerHTML = `
            <button class="edit-btn">
                <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
            edit
                </button>
            <button class="delete-btn">
                <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
            delete
                </button>
        `;

        const editBtn = actionCell.querySelector('.edit-btn');
        const deleteBtn = actionCell.querySelector('.delete-btn');

        editBtn.addEventListener('click', () => editEvent(row, event));
        deleteBtn.addEventListener('click', () => deleteEvent(row, event.id));
    }
});
