// Initialize EmailJS
(function() {
    emailjs.init("rKcOTpRdoyDMn-A3c");
})();

// Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Smooth scrolling for navigation links and contact button
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Add highlight effect to the target section
            target.classList.add('highlight-section');
            
            // Scroll to the target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Remove highlight effect after animation
            setTimeout(() => {
                target.classList.remove('highlight-section');
            }, 2000);

            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
        }
    });
});

// Form submission handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const formObject = {
        user_name: formData.get('user_name'),
        user_email: formData.get('user_email'),
        user_phone: formData.get('user_phone'),
        message: formData.get('message')
    };

    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        // Send email using EmailJS
        await emailjs.send('service_reguok8', 'template_contact', formObject);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        contactForm.appendChild(successMessage);

        // Reset form and button
        contactForm.reset();
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;

        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    } catch (error) {
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Sorry, there was an error sending your message. Please try again.';
        contactForm.appendChild(errorMessage);

        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;

        // Remove error message after 5 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }
});

// Add scroll-based animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.product-card, .service-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
}); 