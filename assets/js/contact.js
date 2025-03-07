const form = document.getElementById('contact-form');

form.addEventListener('submit', function(event) {
    
    event.preventDefault();

  
    const requestType = document.getElementById('Request_type').value;
    const email = document.getElementById('email').value;
    const score = document.getElementById('score').value;
    const message = document.getElementById('message').value;

    
    const summary = `
        Request Type: ${requestType}
        Email: ${email}
        Score: ${score}
        Message: ${message}
    `;


    alert(`Votre message a été envoyé avec succès! Voici un résumé de votre requête :\n\n${summary}`);

});
