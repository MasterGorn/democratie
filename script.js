// Gestion du formulaire de contact
document.addEventListener('DOMContentLoaded', function() {
    // Gérer le formulaire de contact
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const proposition = document.getElementById('proposition').value.trim();

        // Validation
        if (!proposition) {
            showFormMessage('Veuillez renseigner le champ "Votre proposition" pour pouvoir transmettre votre contribution.', 'error');
            return;
        }

        // Préparer le contenu de l'email
        const emailTo = 'meilleuredemocratie@gmail.com';
        const emailSubject = encodeURIComponent('Nouvelle proposition - Améliorons la Démocratie');
        
        let emailBody = 'Bonjour,\n\n';
        emailBody += 'Je souhaite proposer la mesure suivante pour améliorer la démocratie :\n\n';
        emailBody += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        
        if (name) {
            emailBody += 'Nom : ' + name + '\n';
        } else {
            emailBody += 'Nom : Anonyme\n';
        }
        
        if (email) {
            emailBody += 'Email : ' + email + '\n';
        } else {
            emailBody += 'Email : Non renseigné\n';
        }
        
        emailBody += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        emailBody += 'Proposition :\n\n';
        emailBody += proposition;
        emailBody += '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        emailBody += 'Cordialement,\n';
        if (name) {
            emailBody += name;
        } else {
            emailBody += 'Un citoyen';
        }

        // Encoder le corps de l'email pour l'URL
        const encodedBody = encodeURIComponent(emailBody);

        // Créer le lien mailto
        const mailtoLink = `mailto:${emailTo}?subject=${emailSubject}&body=${encodedBody}`;

        // Ouvrir le client email par défaut
        window.location.href = mailtoLink;

        // Afficher un message informatif
        showFormMessage('Votre client email va s\'ouvrir. Veuillez vérifier que tous les champs sont correctement remplis avant d\'envoyer votre proposition. Merci de votre contribution au débat démocratique !', 'success');

        // Réinitialiser le formulaire après un court délai
        setTimeout(() => {
            contactForm.reset();
        }, 2000);
    });

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        // Faire défiler jusqu'au message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Optionnel : masquer le message après 5 secondes
        setTimeout(() => {
            formMessage.className = 'form-message';
            formMessage.textContent = '';
        }, 8000);
    }
});
