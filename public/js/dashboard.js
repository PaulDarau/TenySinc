async function getUserData() {
  const res = await fetch('/api/user');
  const user = await res.json();

  document.getElementById('username').textContent = user.username;
  document.getElementById('email').textContent = user.email;
  document.getElementById('gender').textContent = user.gender;
  document.getElementById('level').textContent = user.level;
  document.getElementById('location').textContent = user.location;
  document.getElementById('age').textContent = user.age;

  const avatarPath = user.gender === 'Feminin'
    ? '/images/sport_avatar_woman_girl_-05-512.webp'
    : '/images/avatar-of-a-tennis-character-free-vector.jpg';

  document.getElementById('avatar').src = avatarPath;
}

function logout() {
  fetch('/api/logout').then(() => window.location.href = '/login.html');
}

function editProfile() {
  window.location.href = '/edit-profile.html';
}

async function getMatches() {
  const res = await fetch('/api/matches');
  const matches = await res.json();

  const matchList = document.querySelector('.match-list');
  if (!matches.length) {
    matchList.innerHTML += '<p>Momentan nu există meciuri disponibile.</p>';
    return;
  }

  matches.forEach(match => {
    const matchElement = document.createElement('div');
    matchElement.classList.add('match-item');
    matchElement.innerHTML = `
      <p><strong>Locație:</strong> ${match.location}</p>
      <p><strong>Data:</strong> ${match.date}</p>
      <p><strong>Ora:</strong> ${match.time}</p>
      <p><strong>Suprafață:</strong> ${match.surface}</p>
      <p><strong>Creat de:</strong> <a href="#">${match.creator.username}</a></p>
      <button class="green-button" onclick="window.location.href='match-details.html?id=${match._id}'">Vezi detalii</button>
    `;
    matchList.appendChild(matchElement);
  });
}

// ✅ Cereri trimise
async function loadSentRequests() {
  try {
    const res = await fetch('/api/sent-requests');
    const requests = await res.json();
    const list = document.getElementById('sentRequestsList');
    list.innerHTML = '';

    if (!requests.length) {
      list.innerHTML = '<li>Nu ai trimis nicio cerere.</li>';
      return;
    }

    requests.forEach(req => {
      const color = req.status === 'acceptată' ? 'status-verde' :
                    req.status === 'respinsă' ? 'status-rosu' : '';
      const statusDisplay = req.status.charAt(0).toUpperCase() + req.status.slice(1);
      const item = document.createElement('li');
      item.innerHTML = `
        <strong>Meci:</strong> ${req.match.location}, ${req.match.date} ${req.match.time}<br>
        <strong>Suprafață:</strong> ${req.match.surface}<br>
        <strong>Status:</strong> <span class="${color}">${statusDisplay}</span><br>
        ${req.status === 'trimisă' ? `<button class="cancel-request-button" onclick="cancelRequest('${req._id}')">Anulează</button>` : ''}
      `;
      list.appendChild(item);
    });
  } catch {
    document.getElementById('sentRequestsList').innerHTML = '<li>Eroare la încărcare cereri.</li>';
  }
}

// ✅ Cereri primite
async function loadReceivedRequests() {
  try {
    const res = await fetch('/api/received-requests');
    const requests = await res.json();
    const container = document.getElementById('receivedRequestsContainer');
    container.innerHTML = '';

    if (!requests.length) {
      container.innerHTML = '<p>Nu ai cereri primite.</p>';
      return;
    }

    requests.forEach(req => {
      const div = document.createElement('div');
      div.className = 'match-item';
      let content = `
        <p><strong>De la:</strong> ${req.sender.username} (${req.sender.email})</p>
        <p><strong>Nivel:</strong> ${req.sender.level} | <strong>Vârstă:</strong> ${req.sender.age}</p>
        <p><strong>Localitate:</strong> ${req.sender.location} | <strong>Gen:</strong> ${req.sender.gender}</p>
        <p><strong>Meci:</strong> ${req.match.location}, ${req.match.date} ${req.match.time}</p>
      `;

      if (req.status === 'trimisă') {
        content += `
          <button class="green-button" onclick="handleRequest('${req._id}', 'acceptată')">Acceptă</button>
          <button class="cancel-request-button" onclick="handleRequest('${req._id}', 'respinsă')">Respinge</button>
        `;
      } else {
        const cls = req.status === 'acceptată' ? 'status-verde' : 'status-rosu';
        const txt = req.status.charAt(0).toUpperCase() + req.status.slice(1);
        content += `<p><strong>Status:</strong> <span class="${cls}">${txt}</span></p>`;
      }

      div.innerHTML = content;
      container.appendChild(div);
    });
  } catch {
    document.getElementById('receivedRequestsContainer').innerHTML = '<p>Eroare la încărcare cereri.</p>';
  }
}

async function cancelRequest(id) {
  if (!confirm('Ești sigur că vrei să anulezi această cerere?')) return;
  try {
    const res = await fetch(`/api/cancel-request/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.message);
    loadSentRequests();
    loadReceivedRequests();
  } catch {
    alert('A apărut o eroare.');
  }
}

function openModal() {
  document.getElementById('receivedModal').style.display = 'flex';
  loadReceivedRequests();
}

function closeModal() {
  document.getElementById('receivedModal').style.display = 'none';
}

async function handleRequest(id, status) {
  try {
    const res = await fetch(`/api/update-request/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    alert(data.message);
    loadReceivedRequests();
    loadSentRequests();
  } catch {
    alert('Eroare la actualizare cerere.');
  }
}

// Inițializare
document.addEventListener("DOMContentLoaded", () => {
  getUserData();
  getMatches();
  loadSentRequests();
  document.getElementById('receivedRequestsBtn').addEventListener('click', openModal);
});
