document.addEventListener('DOMContentLoaded', function() {
    // Navbar color change on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
        
        // Show/hide back to top button
        if (window.scrollY > 300) {
            document.querySelector('.back-to-top').classList.add('show');
        } else {
            document.querySelector('.back-to-top').classList.remove('show');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });
    
    // Back to top button
    document.querySelector('.back-to-top').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // RSVP Form Submission
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const guests = document.getElementById('guests').value;
            const attending = document.getElementById('attending').value;
            const message = document.getElementById('message').value;
            
            // Create wish object
            const wish = {
                name: name,
                email: email,
                phone: phone,
                guests: guests,
                attending: attending,
                message: message,
                date: new Date().toISOString()
            };
            
            // Save to local storage
            saveWish(wish);
            
            // Show success message
            alert('Cảm ơn bạn đã gửi thông tin tham dự!');
            
            // Reset form
            rsvpForm.reset();
            
            // Refresh wishes display
            loadWishes();
        });
    }
    
    // Load wishes on page load
    loadWishes();
    
    // Add animation to sections when they become visible
    const sections = document.querySelectorAll('.section');
    
    // Options for the Intersection Observer
    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // trigger when 20% of the section is visible
    };
    
    // Callback function for Intersection Observer
    const sectionObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeIn');
                // Stop observing once animation is added
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Start observing each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Functions to handle wishes
    function saveWish(wish) {
        // Get existing wishes or initialize empty array
        let wishes = JSON.parse(localStorage.getItem('wedding-wishes')) || [];
        
        // Add new wish
        wishes.push(wish);
        
        // Save back to local storage
        localStorage.setItem('wedding-wishes', JSON.stringify(wishes));
        
        // Export to CSV if function exists
        if (typeof exportToCSV === 'function') {
            exportToCSV(wishes);
        }
    }
    
    function loadWishes() {
        const wishesContainer = document.getElementById('wishesContainer');
        if (!wishesContainer) return;
        
        // Clear container
        wishesContainer.innerHTML = '';
        
        // Get wishes from local storage
        const wishes = JSON.parse(localStorage.getItem('wedding-wishes')) || [];
        
        // If no wishes, show message
        if (wishes.length === 0) {
            wishesContainer.innerHTML = '<p class="text-center">Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc!</p>';
            return;
        }
        
        // Display wishes
        wishes.forEach(wish => {
            if (wish.message && wish.message.trim() !== '') {
                const wishCard = document.createElement('div');
                wishCard.className = 'wish-card';
                
                const formattedDate = new Date(wish.date).toLocaleDateString('vi-VN');
                
                wishCard.innerHTML = `
                    <p>${wish.message}</p>
                    <p class="wish-author">${wish.name} - ${formattedDate}</p>
                `;
                
                wishesContainer.appendChild(wishCard);
            }
        });
    }
    
    // Function to export wishes to CSV (for client-side use only)
    function exportToCSV(wishes) {
        // This is a simplified version and will only work client-side
        // For production, you'd need a server-side component to save CSV files
        
        if (wishes.length === 0) return;
        
        // Create CSV content
        let csvContent = 'data:text/csv;charset=utf-8,';
        
        // Add headers
        csvContent += 'Name,Email,Phone,Guests,Attending,Message,Date\n';
        
        // Add rows
        wishes.forEach(wish => {
            csvContent += `"${wish.name}","${wish.email}","${wish.phone}","${wish.guests}","${wish.attending}","${wish.message.replace(/"/g, '""')}","${wish.date}"\n`;
        });
        
        // For demo purposes, create a link to download the CSV
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'wedding-wishes.csv');
        
        // This is just for demonstration - in a real application,
        // you would use a server-side approach to save files
        console.log('CSV data prepared (would be saved on server)');
        
        // Uncomment to enable actual download in the browser
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
    }
    
    // Function to import wishes from CSV (would need server integration)
    function importFromCSV(csvFile) {
        // This is a placeholder for server-side integration
        console.log('CSV import would be handled on the server');
    }
    
    // Add countdown timer to wedding date
    const weddingDate = new Date('2025-06-15T00:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const distance = weddingDate - now;
        
        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Find countdown element (can be added to HTML)
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            if (distance < 0) {
                countdownElement.innerHTML = 'Đám cưới đã diễn ra! Cảm ơn bạn đã đến tham dự.';
            } else {
                countdownElement.innerHTML = `
                    <div class="countdown-item">${days}<span>Ngày</span></div>
                    <div class="countdown-item">${hours}<span>Giờ</span></div>
                    <div class="countdown-item">${minutes}<span>Phút</span></div>
                    <div class="countdown-item">${seconds}<span>Giây</span></div>
                `;
            }
        }
    }
    
    // Update countdown every second (if element exists)
    if (document.getElementById('countdown')) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
});
