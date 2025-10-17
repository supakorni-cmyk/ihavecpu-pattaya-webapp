// File: public/script.js

// --- SLIDER HELPER FUNCTIONS (must be globally accessible for onclick) ---
let slideIndex = 1;

function plusSlides(n) {
    showSlide(slideIndex += n);
}

function currentSlide(n) {
    showSlide(slideIndex = n);
}

function showSlide(n) {
    let i;
    let slides = document.getElementsByClassName("slider-slide");
    let dots = document.getElementsByClassName("slider-dot");
    if (!slides.length || !dots.length) return; // Exit if elements not ready
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

document.addEventListener('DOMContentLoaded', () => {
    // --- RESPONSIVE NAVIGATION LOGIC ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when a link is clicked for a better user experience
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }    
    // --- GALLERY & MODAL LOGIC ---
    const mainGalleryImage = document.getElementById('main-gallery-image');
    const galleryThumbs = document.querySelectorAll('.gallery-thumb');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalBtn = document.querySelector('.close-modal');

    if (mainGalleryImage && galleryThumbs.length > 0) {
        galleryThumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainGalleryImage.src = thumb.src;
                galleryThumbs.forEach(t => t.classList.remove('active-thumb'));
                thumb.classList.add('active-thumb');
            });
        });
        mainGalleryImage.addEventListener('click', () => {
            modal.style.display = "block";
            modalImage.src = mainGalleryImage.src;
        });
    }

    const closeModal = () => { if (modal) modal.style.display = "none"; }
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // --- BOOKING SYSTEM LOGIC ---
    const zoneTabsContainer = document.getElementById('zone-tabs');
    const summaryContent = document.getElementById('summary-content');
    let spotsData = {};
    let selection = []; // The "shopping cart" for selected spots

    const initializeApp = async () => {
        try {
            const response = await fetch('/api/spots');
            spotsData = await response.json();
            renderZoneTabs();
            const firstZoneId = Object.keys(spotsData)[0];
            if (firstZoneId) renderZone(firstZoneId);
            updateSelectionSummary();
        } catch (error) {
            console.error("Failed to initialize app:", error);
            const bookingContainer = document.querySelector('.booking-app-container');
            if(bookingContainer) bookingContainer.innerHTML = "<p class='error'>Could not load booking system. Please try again later.</p>";
        }
    };

    const renderZoneTabs = () => {
        if(!zoneTabsContainer) return;
        zoneTabsContainer.innerHTML = '';
        for (const zoneId in spotsData) {
            const tab = document.createElement('div');
            tab.className = 'zone-tab';
            tab.dataset.zoneId = zoneId;
            tab.textContent = spotsData[zoneId].name;
            tab.addEventListener('click', () => renderZone(zoneId));
            zoneTabsContainer.appendChild(tab);
        }
    };
    
    const renderZone = (zoneId) => {
        const zoneImageContainer = document.getElementById('zone-image-container');
        const spotButtonsContainer = document.getElementById('spot-buttons-container');
        if (!zoneImageContainer || !spotButtonsContainer) return;

        const zone = spotsData[zoneId];

        document.querySelectorAll('.zone-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.zoneId === zoneId);
        });

        if (zone.layoutImages && zone.layoutImages.length > 1) {
            let slidesHTML = '';
            let dotsHTML = '';
            zone.layoutImages.forEach((imageUrl, index) => {
                slidesHTML += `<div class="slider-slide fade"><img src="${imageUrl}" alt="${zone.name} layout view ${index + 1}"></div>`;
                dotsHTML += `<span class="slider-dot" onclick="currentSlide(${index + 1})"></span>`;
            });

            const sliderHTML = `<div class="slider-container">${slidesHTML}<a class="slider-prev" onclick="plusSlides(-1)">&#10094;</a><a class="slider-next" onclick="plusSlides(1)">&#10095;</a><div class="slider-dots">${dotsHTML}</div></div>`;
            zoneImageContainer.innerHTML = sliderHTML;
            
            slideIndex = 1;
            showSlide(slideIndex);

        } else if (zone.layoutImages && zone.layoutImages.length === 1) {
            zoneImageContainer.innerHTML = `<div class="single-image-container"><img src="${zone.layoutImages[0]}" alt="${zone.name} layout"></div>`;
        } else {
            zoneImageContainer.innerHTML = '';
        }
        
        spotButtonsContainer.innerHTML = '';
        let buttonsHTML = '';
        for (const spotId in zone.spots) {
            const spot = zone.spots[spotId];
            const isBooked = spot.status === 'Booked';
            const isSelected = selection.some(s => s.spotId === spotId && s.zoneId === zoneId);
            let buttonClass = 'spot-button';
            if (isBooked) buttonClass += ' booked';
            else if (isSelected) buttonClass += ' selected';
            else buttonClass += ' available';
            buttonsHTML += `<button class="${buttonClass}" data-zone-id="${zoneId}" data-spot-id="${spotId}" ${isBooked ? 'disabled' : ''}>${spot.name}</button>`;
        }
        spotButtonsContainer.innerHTML = buttonsHTML;
        attachSpotListeners();
    };

    const attachSpotListeners = () => {
        document.querySelectorAll('.spot-button:not(.booked)').forEach(button => {
            button.addEventListener('click', () => {
                const { zoneId, spotId } = button.dataset;
                handleSpotClick(zoneId, spotId);
            });
        });
    };

    const handleSpotClick = (zoneId, spotId) => {
        const selectionIndex = selection.findIndex(s => s.spotId === spotId && s.zoneId === zoneId);
        if (selectionIndex > -1) {
            selection.splice(selectionIndex, 1);
        } else {
            selection.push({ zoneId, spotId });
        }
        const activeZoneId = document.querySelector('.zone-tab.active').dataset.zoneId;
        renderZone(activeZoneId); 
        updateSelectionSummary();
    };
    
    const updateSelectionSummary = () => {
        if(!summaryContent) return;
        const numSelected = selection.length;
        if (numSelected === 0) {
            summaryContent.innerHTML = '<p>Select one or more available positions to begin.</p>';
            return;
        }
        
        let listHTML = '<ul>';
        let subtotal = 0;
        selection.forEach(item => {
            const spot = spotsData[item.zoneId].spots[item.spotId];
            listHTML += `<li><span>${spot.name}</span><strong>${spot.price.toLocaleString()} THB</strong></li>`;
            subtotal += spot.price;
        });
        listHTML += '</ul>';

        let discountAmount = 0;
        if (numSelected === 2) {
            discountAmount = 5000;
        } else if (numSelected >= 3) {
            discountAmount = 10000;
        }
        const finalTotal = subtotal - discountAmount;

        let summaryHTML = `<div class="summary-details"><h4>Selected Items</h4>${listHTML}<div class="summary-calculation"><div class="summary-row"><span>Subtotal</span><span>${subtotal.toLocaleString()} THB</span></div>`;
        if (discountAmount > 0) {
            summaryHTML += `<div class="summary-row discount"><span>Discount</span><span>-${discountAmount.toLocaleString()} THB</span></div>`;
        }
        summaryHTML += `</div><div id="summary-total"><span>Total</span><span>${finalTotal.toLocaleString()} THB</span></div></div>`;
        
        const formHTML = `
            <form class="booking-form" id="summary-form">
                <label for="email">Your Email:</label>
                <input type="email" id="email" required placeholder="name@example.com">

                <label for="cc">CC Emails (optional):</label>
                <input type="text" id="cc" placeholder="email1@example.com, email2@example.com">
                
                <label for="brand">Your Brand:</label>
                <input type="text" id="brand" required placeholder="Your Brand">
                
                <button type="submit">Book Selected Positions</button>
                <div id="status-message"></div>
            </form>`;

        summaryContent.innerHTML = summaryHTML + formHTML;
        document.getElementById('summary-form').addEventListener('submit', handleBookingSubmit);
    };

    const handleBookingSubmit = async (event) => {
        event.preventDefault();
        const emailInput = document.getElementById('email');
        const ccInput = document.getElementById('cc');
        const brandInput = document.getElementById('brand');
        const statusMessage = document.getElementById('status-message');

        if (selection.length === 0) {
            statusMessage.className = 'status-message error';
            statusMessage.textContent = "Please select at least one position.";
            return;
        }
        if (!brandInput.value) { 
            statusMessage.className = 'status-message error';
            statusMessage.textContent = "Please enter your brand.";
            return;
        }
        if (!emailInput.value) {
            statusMessage.className = 'status-message error';
            statusMessage.textContent = "Please enter your email address.";
            return;
        }

        const bookingData = { 
                spotIds: selection, 
                email: emailInput.value, 
                ccEmails: ccInput.value,
                brand: brandInput.value 
            };
        
        try {
            const response = await fetch('/api/book', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bookingData) });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                selection = [];
                initializeApp();
            } else {
                statusMessage.className = 'status-message error';
                statusMessage.textContent = result.message;
            }
        } catch (error) {
            statusMessage.className = 'status-message error';
            statusMessage.textContent = "A network error occurred.";
        }
    };

    initializeApp();
}); // The extra '}' that was here has been REMOVED.