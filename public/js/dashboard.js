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
    alert('Funcționalitatea de editare va fi implementată.');
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
      `;
      matchList.appendChild(matchElement);
    });
  }
  
  getUserData();
  getMatches();
  