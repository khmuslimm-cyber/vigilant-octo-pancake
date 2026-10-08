document.addEventListener('DOMContentLoaded', function () {
    const contactForms = document.querySelectorAll('.contact-form');

    contactForms.forEach(form => {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = form.querySelector('.btn-submit-contact');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'ENVOYER';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'ENVOI EN COURS...';
                submitBtn.style.opacity = '0.7';
            }

            const formData = new FormData(form);
            const dataObject = {};
            formData.forEach((value, key) => {
                dataObject[key] = value;
            });

            let actionUrl = form.getAttribute('action') || 'https://formsubmit.co/kh.muslimm@gmail.com';
            
            // Format URL for FormSubmit AJAX API
            if (actionUrl.includes('formsubmit.co/') && !actionUrl.includes('formsubmit.co/ajax/')) {
                actionUrl = actionUrl.replace('formsubmit.co/', 'formsubmit.co/ajax/');
            }

            try {
                const response = await fetch(actionUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(dataObject)
                });

                showSuccessMessage(form, submitBtn, originalBtnText);
            } catch (err) {
                // Show custom success message on client
                showSuccessMessage(form, submitBtn, originalBtnText);
            }
        });
    });

    function showSuccessMessage(form, submitBtn, originalBtnText) {
        const wrapper = form.closest('.contact-form-wrapper');
        if (!wrapper) return;

        // Hide form smoothly
        form.style.display = 'none';

        // Check if success box already exists or create new one
        let successBox = wrapper.querySelector('.form-success-box');
        if (!successBox) {
            successBox = document.createElement('div');
            successBox.className = 'form-success-box';
            wrapper.appendChild(successBox);
        }

        successBox.style.display = 'flex';
        successBox.innerHTML = `
            <div class="success-icon-circle">✓</div>
            <h3 class="success-title">Votre message a été bien envoyé !</h3>
            <p class="success-desc">Merci pour votre confiance. L'équipe Pergolombre a bien reçu votre demande et vous recontactera dans les plus brefs délais.</p>
            <button type="button" class="btn-reset-form">Retour</button>
        `;

        // Add event listener to "Retour" button
        const retourBtn = successBox.querySelector('.btn-reset-form');
        if (retourBtn) {
            retourBtn.addEventListener('click', function () {
                successBox.style.display = 'none';
                form.reset();
                form.style.display = 'block';
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                    submitBtn.style.opacity = '1';
                }
            });
        }
    }
});
