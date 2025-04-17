document.getElementById('matchForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const matchData = {
      location: document.getElementById('location').value,
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      surface: document.getElementById('surface').value
    };
  
    console.log("Se trimite meciul..."); 
  
    try {
      const response = await fetch('/api/create-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
        window.location.href = '/dashboard';
      } else {
        alert(result.message || 'Eroare la creare meci');
      }
    } catch (error) {
      console.error("Eroare generală:", error);
      alert('A apărut o eroare. Încearcă din nou.');
    }
  });
  