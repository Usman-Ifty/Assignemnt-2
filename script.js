document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;

    const featureIDs = [
        'feedback',
        'membership-form',
        'contact-form',
        'feedback-form',
        'logout-button',
        'review',
        'services',
        'join-button'
    ];

    featureIDs.forEach(featureId => {
        const featureElement = document.getElementById(featureId);
        if (featureElement) {
            featureElement.classList.toggle("hidden", !isLoggedIn);
        }
    });

    const loginButton = document.querySelector('.navbar-nav .nav-link[href="login.html"]');
    const logoutButton = document.getElementById('logout-button');
    const joinButton = document.getElementById('join-button');

    if (joinButton) joinButton.style.display = isLoggedIn ? 'none' : 'block';
    if (loginButton && logoutButton) {
        loginButton.style.display = isLoggedIn ? 'none' : 'block';
        logoutButton.style.display = isLoggedIn ? 'block' : 'none';
    }

    // DOM Form Validation
    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", function (event) {
            const name = form.querySelector("input[type='text']");
            const email = form.querySelector("input[type='email']");
            const message = form.querySelector("textarea");

            if ((name && name.value.trim() === "") ||
                (email && email.value.trim() === "") ||
                (message && message.value.trim() === "")) {
                alert("All fields are required!");
                event.preventDefault();
            }
        });
    });

    // JS DOM - Block buttons if not logged in
    document.querySelectorAll(".feature-btn").forEach(button => {
        button.addEventListener("click", function (e) {
            if (!isLoggedIn) {
                e.preventDefault();
                alert("Please login to access this feature.");
            }
        });
    });

    // JS DOM - Block nav links if not logged in
    document.querySelectorAll('.navbar-nav .nav-link:not(.btn)').forEach(link => {
        const href = link.getAttribute("href");
        if (["membership-plans.html", "contact-us.html", "feedback.html", "review-form.html"].includes(href)) {
            link.addEventListener("click", function (e) {
                if (!isLoggedIn) {
                    e.preventDefault();
                    alert("Please login to access this page.");
                }
            });
        }
    });

    // Chatbot toggle
    const chatIcon = document.querySelector(".chat-icon");
    const chatbot = document.getElementById("chatbot");

    if (chatIcon && chatbot) {
        chatIcon.addEventListener("click", () => {
            chatbot.style.display = chatbot.style.display === "block" ? "none" : "block";
        });
    }

    // Close chatbot
    const closeChat = document.querySelector(".close-chat");
    if (closeChat && chatbot) {
        closeChat.addEventListener("click", () => {
            chatbot.style.display = "none";
        });
    }

    // Notification popup
    const notifyBtn = document.getElementById("notify-btn");
    const notificationPopup = document.getElementById("notification-popup");
    const closeNotificationBtn = notificationPopup?.querySelector("button");

    if (notifyBtn && notificationPopup && closeNotificationBtn) {
        notifyBtn.addEventListener("click", () => {
            notificationPopup.style.display = "block";
        });
        closeNotificationBtn.addEventListener("click", () => {
            notificationPopup.style.display = "none";
        });
    }

    // Chatbot message logic
    const userInput = document.getElementById("user-input");
    const chatBody = document.getElementById("chat-body");

    const sendMessage = () => {
        const input = userInput?.value.trim();
        if (input) {
            addUserMessage(input);
            addBotReply(input);
            userInput.value = "";
        }
    };

    const addUserMessage = (text) => {
        const userMsg = document.createElement("p");
        userMsg.className = "chat-message user-message";
        userMsg.innerText = text;
        chatBody.appendChild(userMsg);
    };

    const addBotReply = (text) => {
        const botMsg = document.createElement("p");
        botMsg.className = "chat-message bot-message";

        switch (text.toLowerCase()) {
            case "membership plans":
                botMsg.innerText = "We offer Basic, Intermediate, and Pro memberships starting at $10/month.";
                break;
            case "trainers":
                botMsg.innerText = "Our certified trainers are available 7 days a week!";
                break;
            case "location":
                botMsg.innerText = "We’re located at Main Boulevard, Gym City.";
                break;
            case "contact":
                botMsg.innerText = "You can email us at contact@gympro.com.";
                break;
            case "gym timings":
                botMsg.innerText = "We are open from 5 AM to 11 PM daily.";
                break;
            default:
                botMsg.innerText = "Thank you! We'll get back to you soon.";
        }

        chatBody.appendChild(botMsg);
    };

    if (userInput) {
        userInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    document.querySelectorAll(".chat-options button").forEach(button => {
        button.addEventListener("click", () => {
            addUserMessage(button.innerText);
            addBotReply(button.innerText);
        });
    });

    // ✅ jQuery + AJAX + JSON: Load testimonials into any section with id="testimonial-list"
    $.getJSON("testimonials.json", function (data) {
        const $container = $("#testimonial-list");
        if ($container.length) {
            $container.empty(); // clear existing
            data.forEach(testimonial => {
                const html = `
                    <div class="card p-3 mb-3">
                        <h5>${testimonial.name}</h5>
                        <p>${testimonial.comment}</p>
                        <p>⭐ ${testimonial.rating} / 5</p>
                    </div>`;
                $container.append(html);
            });
        }
    });

    // ✅ Load Trainers from JSON
$.getJSON("trainers.json", function (data) {
    const $trainerContainer = $("#trainer-list");
    if ($trainerContainer.length) {
        $trainerContainer.empty();
        data.forEach(trainer => {
            const html = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm text-center">
                        <img src="${trainer.image}" class="card-img-top" alt="${trainer.name}">
                        <div class="card-body">
                            <h5 class="card-title">${trainer.name}</h5>
                            <p class="card-text">${trainer.specialty}</p>
                        </div>
                    </div>
                </div>`;
            $trainerContainer.append(html);
        });
    }
});

// Feedback Form
$('#feedback-form').submit(function (e) {
    e.preventDefault();

    const name = $('#name').val().trim();
    const message = $('#message').val().trim();

    if (name === "" || message === "") {
        alert("Please fill out all fields.");
        return;
    }

    const feedbackEntry = { name, message, date: new Date().toISOString() };
    const feedbackData = JSON.parse(localStorage.getItem("feedbackData")) || [];
    feedbackData.push(feedbackEntry);

    localStorage.setItem("feedbackData", JSON.stringify(feedbackData));
    alert("✅ Feedback submitted successfully!");
    displayFeedbackSubmissions();
    document.getElementById("feedback-form")?.reset();
    
});
function displayFeedbackSubmissions() {
    const feedbackData = JSON.parse(localStorage.getItem("feedbackData")) || [];
    const container = $("#feedback-submissions");
    if (!container.length) return;
    container.empty();
    feedbackData.forEach(entry => {
        container.append(`
            <div class="card bg-light p-3 mb-2">
                <h5>${entry.name}</h5>
                <p>${entry.message}</p>
                <small><em>${new Date(entry.date).toLocaleString()}</em></small>
            </div>
        `);
    });
}

displayFeedbackSubmissions();

// Review Form
$('#review-form').submit(function (e) {
    e.preventDefault();

    const rating = $('#rating').val();
    const review = $('#review').val().trim();

    if (rating === "" || review === "") {
        alert("Please complete all fields.");
        return;
    }

    const reviewEntry = { rating, review, date: new Date().toISOString() };
    const reviewData = JSON.parse(localStorage.getItem("reviewData")) || [];
    reviewData.push(reviewEntry);

    localStorage.setItem("reviewData", JSON.stringify(reviewData));
    alert("✅ Review submitted successfully!");
    displayReviewSubmissions();
    document.getElementById("review-form")?.reset();
});
function displayReviewSubmissions() {
    const reviewData = JSON.parse(localStorage.getItem("reviewData")) || [];
    const container = $("#review-submissions");
    if (!container.length) return;
    container.empty();
    reviewData.forEach(entry => {
        container.append(`
            <div class="card bg-light p-3 mb-2">
                <p><strong>Rating:</strong> ${entry.rating} ⭐</p>
                <p>${entry.review}</p>
                <small><em>${new Date(entry.date).toLocaleString()}</em></small>
            </div>
        `);
    });
}

displayReviewSubmissions();

// Contact Form
$('#contact-form').submit(function (e) {
    e.preventDefault();

    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const message = $('#message').val().trim();

    if (name === "" || email === "" || message === "") {
        alert("Please fill out all fields.");
        return;
    }

    const contactEntry = { name, email, message, date: new Date().toISOString() };
    const contactData = JSON.parse(localStorage.getItem("contactData")) || [];
    contactData.push(contactEntry);

    localStorage.setItem("contactData", JSON.stringify(contactData));
    alert("✅ Message submitted successfully!");
    displayContactSubmissions();
    document.getElementById("contact-form")?.reset(); 
});
function displayContactSubmissions() {
    const contactData = JSON.parse(localStorage.getItem("contactData")) || [];
    const container = $("#contact-submissions");
    if (!container.length) return;
    container.empty();
    contactData.forEach(entry => {
        container.append(`
            <div class="card bg-light p-3 mb-2">
                <h5>${entry.name} (${entry.email})</h5>
                <p>${entry.message}</p>
                <small><em>${new Date(entry.date).toLocaleString()}</em></small>
            </div>
        `);
    });
}

displayContactSubmissions();


});

function logout() {
    localStorage.removeItem("isLoggedIn");
    document.querySelectorAll('.hidden').forEach(section => section.classList.add('hidden'));
    window.location.href = "login.html";
}
