/**
 * Contact Form and WhatsApp Integration for Sandeep Dhakar Portfolio
 * Validates fields and sends email using EmailJS
 */

document.addEventListener('DOMContentLoaded', () => {

    emailjs.init({
        publicKey: "JuBuPtJzTxH3vlNPj"
    });

    const contactForm = document.getElementById('portfolio-contact-form');
    const formFeedback = document.getElementById('form-feedback');

    // Floating label focus states
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        // Set initial state
        if (input.value.trim() !== '') {
            input.parentElement.classList.add('focused');
        }
        
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.parentElement.classList.remove('focused');
            }
        });
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const nameInput = document.getElementById('user_name');
            const emailInput = document.getElementById('user_email');
            const subjectInput = document.getElementById('user_subject');
            const messageInput = document.getElementById('user_message');
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
        
            // Basic validation
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showFeedback('Please fill out all required fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showFeedback('Please enter a valid email address.', 'error');
                return;
            }
            
            const templateParams = {
                user_name: nameInput.value.trim(),
                user_email: emailInput.value.trim(),
                user_subject: subjectInput.value.trim() || 'Portfolio Contact',
                user_message: messageInput.value.trim(),
                to_email: 'sandeepdhakar285@gmail.com'
            };
            
            
           // Change button state to loading
if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
}
        

emailjs.send(
    "service_8m6jrwi",
    "template_jeim1g9",
    templateParams
)
.then(() => {

    showFeedback("✅ Thank you! Your message has been sent successfully.", "success");

    contactForm.reset();
    formInputs.forEach(input => {
        input.parentElement.classList.remove("focused");
    });

})
.catch((error) => {

    console.error("EmailJS Error:", error);

    showFeedback(
        error.text || error.message || "❌ Failed to send message.",
        "error"
    );

})
.finally(() => {

    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }

});

        }); // submit event close
    } // if(contactForm) close
        
    
    function showFeedback(message, type) {
        if (!formFeedback) return;
        
        formFeedback.textContent = message;
        formFeedback.className = 'form-feedback ' + type;
        formFeedback.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            formFeedback.style.opacity = '0';
            setTimeout(() => {
                formFeedback.style.display = 'none';
                formFeedback.style.opacity = '1';
            }, 500);
        }, 5000);
    }
});



// WhatsApp Quick Chat function
window.openWhatsApp = function() {
    const phoneNumber = '917415759583'; // Sandeep's phone number +91 7415759583
    const text = encodeURIComponent("Hello Sandeep! I saw your portfolio and would like to discuss a project.");
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`;
    window.open(url, '_blank');
};
