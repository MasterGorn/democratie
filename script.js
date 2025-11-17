// Gestion du stockage des votes
class VoteManager {
    constructor() {
        this.storageKey = 'democratie_votes';
        this.votes = this.loadVotes();
        this.initializeVotes();
    }

    loadVotes() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Erreur lors du chargement des votes:', e);
            return {};
        }
    }

    saveVotes() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.votes));
        } catch (e) {
            console.error('Erreur lors de la sauvegarde des votes:', e);
        }
    }

    initializeVotes() {
        // Initialiser les votes pour toutes les propositions si elles n'existent pas
        for (let i = 1; i <= 8; i++) {
            if (!this.votes[i]) {
                this.votes[i] = {
                    likes: 0,
                    dislikes: 0,
                    userVote: null // null, 'like', ou 'dislike'
                };
            }
            this.updateDisplay(i);
        }
    }

    vote(propositionId, voteType) {
        const proposition = this.votes[propositionId];
        
        // Si l'utilisateur clique sur le même vote, on l'annule
        if (proposition.userVote === voteType) {
            proposition.userVote = null;
            if (voteType === 'like') {
                proposition.likes = Math.max(0, proposition.likes - 1);
            } else {
                proposition.dislikes = Math.max(0, proposition.dislikes - 1);
            }
        } else {
            // Annuler le vote précédent si existant
            if (proposition.userVote === 'like') {
                proposition.likes = Math.max(0, proposition.likes - 1);
            } else if (proposition.userVote === 'dislike') {
                proposition.dislikes = Math.max(0, proposition.dislikes - 1);
            }

            // Ajouter le nouveau vote
            proposition.userVote = voteType;
            if (voteType === 'like') {
                proposition.likes += 1;
            } else {
                proposition.dislikes += 1;
            }
        }

        this.saveVotes();
        this.updateDisplay(propositionId);
        this.updateButtonStates(propositionId);
    }

    updateDisplay(propositionId) {
        const proposition = this.votes[propositionId];
        const likeElement = document.getElementById(`like-${propositionId}`);
        const dislikeElement = document.getElementById(`dislike-${propositionId}`);

        if (likeElement) {
            likeElement.textContent = proposition.likes;
        }
        if (dislikeElement) {
            dislikeElement.textContent = proposition.dislikes;
        }
    }

    updateButtonStates(propositionId) {
        const card = document.querySelector(`.proposition-card[data-id="${propositionId}"]`);
        if (!card) return;

        const proposition = this.votes[propositionId];
        const likeBtn = card.querySelector('.btn-like');
        const dislikeBtn = card.querySelector('.btn-dislike');

        // Réinitialiser les états
        likeBtn.classList.remove('active');
        dislikeBtn.classList.remove('active');

        // Appliquer les états actifs
        if (proposition.userVote === 'like') {
            likeBtn.classList.add('active');
        } else if (proposition.userVote === 'dislike') {
            dislikeBtn.classList.add('active');
        }
    }
}

// Initialisation de la gestion des votes
const voteManager = new VoteManager();

// Ajouter les événements de clic sur les boutons
document.addEventListener('DOMContentLoaded', function() {
    // Gérer les votes
    document.querySelectorAll('.proposition-card').forEach(card => {
        const propositionId = card.getAttribute('data-id');
        
        const likeBtn = card.querySelector('.btn-like');
        const dislikeBtn = card.querySelector('.btn-dislike');

        likeBtn.addEventListener('click', () => {
            voteManager.vote(propositionId, 'like');
        });

        dislikeBtn.addEventListener('click', () => {
            voteManager.vote(propositionId, 'dislike');
        });

        // Initialiser l'état des boutons
        voteManager.updateButtonStates(propositionId);
    });

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
            showFormMessage('Veuillez remplir le champ proposition.', 'error');
            return;
        }

        // Simuler l'envoi (dans un cas réel, vous enverriez à un serveur)
        console.log('Nouvelle proposition reçue:', {
            name: name || 'Anonyme',
            email: email || 'Non renseigné',
            proposition: proposition
        });

        // Afficher le message de succès
        showFormMessage('Merci ! Votre proposition a été envoyée. Nous l\'examinerons et pourrions l\'ajouter à notre liste.', 'success');

        // Réinitialiser le formulaire
        contactForm.reset();
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

