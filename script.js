// Initialize EmailJS
(function() {
    emailjs.init("rKcOTpRdoyDMn-A3c");
})();

// Navigation Elements
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

// Navigation Toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Navigation Active State and Smooth Scrolling
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav-links a[href*=' + sectionId + ']').classList.add('active');
        } else {
            document.querySelector('.nav-links a[href*=' + sectionId + ']').classList.remove('active');
        }
    });
}

// Update active link on scroll
window.addEventListener('scroll', setActiveLink);

// Enhanced Scroll Behavior
function scrollToSection(targetId) {
    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;

    // Get the navbar height for offset
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    // Calculate the target position
    const targetPosition = targetSection.offsetTop - navbarHeight;
    
    // Add highlight effect to the target section
    targetSection.classList.add('highlight-section');
    
    // Smooth scroll to target
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });

    // Remove highlight effect after animation
    setTimeout(() => {
        targetSection.classList.remove('highlight-section');
    }, 2000);
}

// Navigation click handlers
navItems.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        navItems.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Get the target section ID
        const targetId = this.getAttribute('href');
        
        // Scroll to section
        scrollToSection(targetId);

        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Add highlight effect styles
const style = document.createElement('style');
style.textContent = `
    .highlight-section {
        animation: highlightSection 2s ease-out;
    }

    @keyframes highlightSection {
        0% {
            box-shadow: 0 0 0 0 rgba(0, 255, 157, 0.4);
        }
        70% {
            box-shadow: 0 0 0 20px rgba(0, 255, 157, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(0, 255, 157, 0);
        }
    }

    section {
        scroll-margin-top: 80px; /* Adjust based on your navbar height */
    }
`;
document.head.appendChild(style);

// Update active link on scroll with debounce
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        const scrollPosition = window.scrollY;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
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

// Product Modal Functionality
const productModal = document.getElementById('productModal');
const modalProductTitle = document.getElementById('modalProductTitle');
const modalProductList = document.getElementById('modalProductList');
const closeModal = document.querySelector('.close-modal');

// Product data
const productData = {
    'Electrical Wires': [
        { name: 'Copper Wire 1.5mm', price: '₹200/meter', description: 'Standard household wiring' },
        { name: 'Copper Wire 2.5mm', price: '₹300/meter', description: 'Heavy-duty power circuits' },
        { name: 'Aluminum Wire 4mm', price: '₹400/meter', description: 'Industrial applications' },
        { name: 'Copper Wire 6mm', price: '₹600/meter', description: 'High-power equipment' },
        { name: 'Copper Wire 10mm', price: '₹1,000/meter', description: 'Main power supply' },
        { name: 'Flexible Wire 1.5mm', price: '₹250/meter', description: 'For appliances' },
        { name: 'Speaker Wire', price: '₹150/meter', description: 'Audio systems' },
        { name: 'Network Cable', price: '₹180/meter', description: 'CAT6 Ethernet' }
    ],
    'LED Bulbs': [
        { name: '9W LED Bulb', price: '₹150', description: 'Warm White' },
        { name: '12W LED Bulb', price: '₹200', description: 'Cool White' },
        { name: '15W LED Bulb', price: '₹250', description: 'Daylight' },
        { name: '20W LED Bulb', price: '₹300', description: 'Bright White' },
        { name: 'Smart LED Bulb', price: '₹800', description: 'WiFi Enabled' },
        { name: 'LED Panel Light', price: '₹1,200', description: 'Office/Commercial' },
        { name: 'LED Strip Light', price: '₹400', description: '5 meters' },
        { name: 'LED Flood Light', price: '₹1,500', description: 'Outdoor' }
    ],
    'Ceiling Fans': [
        { name: 'Standard Fan 1200mm', price: '₹1,500', description: '3 blades' },
        { name: 'Premium Fan 1200mm', price: '₹2,000', description: '5 blades' },
        { name: 'Deluxe Fan 1400mm', price: '₹2,500', description: '6 blades' },
        { name: 'Smart Fan with Remote', price: '₹3,500', description: 'WiFi Enabled' },
        { name: 'Industrial Fan 1800mm', price: '₹4,000', description: 'Heavy-duty' },
        { name: 'Decorative Fan', price: '₹5,000', description: 'Wooden blades' },
        { name: 'Energy Saving Fan', price: '₹2,800', description: 'BLDC Motor' },
        { name: 'Wall Mount Fan', price: '₹1,800', description: 'Oscillating' }
    ],
    'Power Tools': [
        { name: 'Drill Machine', price: '₹800', description: '500W' },
        { name: 'Angle Grinder', price: '₹1,200', description: '4-inch' },
        { name: 'Jigsaw', price: '₹1,500', description: 'Variable speed' },
        { name: 'Power Screwdriver', price: '₹600', description: 'Cordless' },
        { name: 'Circular Saw', price: '₹2,500', description: '7-inch blade' },
        { name: 'Impact Wrench', price: '₹3,000', description: 'Heavy-duty' },
        { name: 'Rotary Hammer', price: '₹4,500', description: 'Demolition' },
        { name: 'Multi-tool', price: '₹1,800', description: 'Oscillating' }
    ],
    'Switches & Sockets': [
        { name: 'Single Switch', price: '₹120', description: 'White' },
        { name: 'Double Switch', price: '₹180', description: 'White' },
        { name: 'Power Socket', price: '₹150', description: '6A' },
        { name: 'USB Socket', price: '₹400', description: 'Dual USB' },
        { name: 'Fan Regulator', price: '₹200', description: '5-step' },
        { name: 'Bell Push', price: '₹100', description: 'White' },
        { name: 'MCB Box', price: '₹250', description: '6-way' },
        { name: 'Extension Board', price: '₹350', description: '6 sockets' }
    ],
    'Safety Equipment': [
        { name: 'Insulated Gloves', price: '₹800', description: 'Class 0' },
        { name: 'Safety Helmet', price: '₹500', description: 'Hard hat' },
        { name: 'Safety Shoes', price: '₹1,200', description: 'Steel toe' },
        { name: 'Safety Goggles', price: '₹300', description: 'Anti-fog' },
        { name: 'Ear Protection', price: '₹400', description: 'Noise reduction' },
        { name: 'Safety Harness', price: '₹2,500', description: 'Full body' },
        { name: 'Fire Extinguisher', price: '₹1,500', description: '5kg' },
        { name: 'First Aid Kit', price: '₹600', description: 'Complete set' }
    ]
};

// Add click event listeners to product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
        const productName = card.querySelector('h3').textContent;
        showProductModal(productName);
    });
});

// Function to show product modal
function showProductModal(productName) {
    modalProductTitle.textContent = productName;
    modalProductList.innerHTML = '';
    
    const products = productData[productName];
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-list-item';
        productItem.innerHTML = `
            <div class="product-info">
                <span class="product-name">${product.name}</span>
                <span class="product-description">${product.description}</span>
            </div>
            <span class="product-price">${product.price}</span>
        `;
        modalProductList.appendChild(productItem);
    });
    
    productModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal when clicking the close button
closeModal.addEventListener('click', () => {
    productModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close modal when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal.style.display === 'block') {
        productModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Service Modal Functionality
const serviceModal = document.getElementById('serviceModal');
const modalServiceTitle = document.getElementById('modalServiceTitle');
const modalServiceList = document.getElementById('modalServiceList');
const closeServiceModal = serviceModal.querySelector('.close-modal');

// Service data
const serviceData = {
    'Fan Motor Rewinding': [
        { name: 'Table Fan Motor', price: '₹300', description: 'Complete rewinding service' },
        { name: 'Ceiling Fan Motor', price: '₹500', description: 'Standard size fan' },
        { name: 'Industrial Fan Motor', price: '₹1,200', description: 'Heavy-duty motors' },
        { name: 'Exhaust Fan Motor', price: '₹400', description: 'Kitchen/Industrial' },
        { name: 'Cooling Fan Motor', price: '₹600', description: 'Cooling tower fans' }
    ],
    'Switchboard Repair': [
        { name: 'MCB Replacement', price: '₹500', description: 'Single phase' },
        { name: 'Complete Panel Repair', price: '₹2,000', description: 'Full service' },
        { name: 'Distribution Board', price: '₹1,500', description: 'Main board repair' },
        { name: 'Circuit Testing', price: '₹300', description: 'Load testing' },
        { name: 'Emergency Repair', price: '₹800', description: '24/7 service' }
    ],
    'Home Service': [
        { name: 'Basic Inspection', price: '₹400', description: 'General checkup' },
        { name: 'Fault Finding', price: '₹600', description: 'Detailed diagnosis' },
        { name: 'Emergency Call', price: '₹1,000', description: 'Immediate response' },
        { name: 'Regular Maintenance', price: '₹800', description: 'Quarterly service' },
        { name: 'Complete Checkup', price: '₹1,500', description: 'Full house inspection' }
    ],
    'Electrical Fitting': [
        { name: 'Fan Installation', price: '₹600', description: 'Standard ceiling fan' },
        { name: 'Light Fitting', price: '₹400', description: 'Per light point' },
        { name: 'Switch Installation', price: '₹300', description: 'Per switch' },
        { name: 'Socket Installation', price: '₹350', description: 'Per socket' },
        { name: 'Complete House Fitting', price: '₹5,000', description: 'Full house setup' }
    ],
    'Wiring Services': [
        { name: 'New House Wiring', price: '₹800/sq.ft', description: 'Complete wiring' },
        { name: 'Partial Rewiring', price: '₹600/point', description: 'Per point' },
        { name: 'Office Wiring', price: '₹1,000/point', description: 'Commercial setup' },
        { name: 'Industrial Wiring', price: '₹1,500/point', description: 'Heavy-duty' },
        { name: 'Emergency Wiring', price: '₹1,200/point', description: 'Quick fix' }
    ],
    'Safety Inspection': [
        { name: 'Basic Safety Check', price: '₹1,000', description: 'General inspection' },
        { name: 'Detailed Inspection', price: '₹2,000', description: 'Complete check' },
        { name: 'Commercial Inspection', price: '₹3,000', description: 'Office/Shop' },
        { name: 'Industrial Inspection', price: '₹5,000', description: 'Factory/Plant' },
        { name: 'Safety Certificate', price: '₹1,500', description: 'Official document' }
    ]
};

// Add click event listeners to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
        const serviceName = card.querySelector('h3').textContent;
        showServiceModal(serviceName);
    });
});

// Function to show service modal
function showServiceModal(serviceName) {
    modalServiceTitle.textContent = serviceName;
    modalServiceList.innerHTML = '';
    
    const services = serviceData[serviceName];
    services.forEach(service => {
        const serviceItem = document.createElement('div');
        serviceItem.className = 'product-list-item';
        serviceItem.innerHTML = `
            <div class="product-info">
                <span class="product-name">${service.name}</span>
                <span class="product-description">${service.description}</span>
            </div>
            <span class="product-price">${service.price}</span>
        `;
        modalServiceList.appendChild(serviceItem);
    });
    
    serviceModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close service modal when clicking the close button
closeServiceModal.addEventListener('click', () => {
    serviceModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close service modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === serviceModal) {
        serviceModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close service modal when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal.style.display === 'block') {
        serviceModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}); 