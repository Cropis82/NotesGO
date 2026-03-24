document.addEventListener('DOMContentLoaded', async () => {
    // 1. CONTROLLO ACCESSO
    const currentUser = localStorage.getItem('loggedUser');
    
    // Se non c'è nessun utente salvato, riportalo al login
    if (!currentUser) {
        window.location.href = 'index.html';
        return; 
    }

    // Elementi UI per l'utente
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutBtn = document.getElementById('logout-btn');
    const jsonOutput = document.getElementById('jsonOutput');

    // --- SPOSTATO QUI: LOGICA DI LOGOUT ---
    // Lo prepariamo prima, così se la riga 30 fallisce, il pulsante sa già cosa fare!
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedUser');
        window.location.href = 'index.html';
    });

    // 2. CARICAMENTO DATI DAL TINYDB (Url aggiornato!)
    try {
        const response = await fetch(`https://silver-cod-q7pp7qqj9wrvh44qw-8000.app.github.dev/api/user/${currentUser}`);
        
        if (response.ok) {
            const data = await response.json();
            welcomeMessage.textContent = `Ciao, ${data.dati.username}!`;
            jsonOutput.textContent = "Dati account caricati dal TinyDB:\n\n" + JSON.stringify(data.dati, null, 4);
        } else {
            // Se l'utente non esiste più nel DB, forziamo l'uscita
            logoutBtn.click();
        }
    } catch (error) {
        welcomeMessage.textContent = `Errore di connessione`;
        jsonOutput.textContent = "Impossibile caricare i dati dal server.";
    }

    // 4. VECCHIA LOGICA DEL TESTER API
    const fetchBtn = document.getElementById('fetchBtn');
    const apiUrlInput = document.getElementById('apiUrl');

    fetchBtn.addEventListener('click', async () => {
        const url = apiUrlInput.value.trim();
        if (!url) {
            jsonOutput.textContent = "Errore: Inserisci un URL valido.";
            return;
        }
        jsonOutput.textContent = "Chiamata in corso...";
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Errore HTTP: status ${response.status}`);
            const data = await response.json();
            jsonOutput.textContent = JSON.stringify(data, null, 4);
        } catch (error) {
            jsonOutput.textContent = `Errore: ${error.message}`;
        }
    });
});