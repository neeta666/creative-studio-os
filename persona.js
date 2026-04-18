const cards = document.querySelectorAll('.persona-card');

cards.forEach(card => {
  card.addEventListener('click', () => {
    // Store both the key and the display label
    const persona = card.dataset.persona;
    const label   = card.dataset.label;

    localStorage.setItem('activePersona',      persona);
    localStorage.setItem('activePersonaLabel', label);

    // Brief visual feedback before redirect
    card.classList.add('is-selected');

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 150);
  });
});
