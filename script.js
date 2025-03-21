document.addEventListener("DOMContentLoaded", function () {
  // Initialize the application
  initApp();

  // Load sample questions (would be replaced with actual data in production)
  loadSampleQuestions();
});

// Initialize application
function initApp() {
  // Modal functionality
  setupModals();

  // Tab functionality
  setupTabs();

  // Form submissions
  setupForms();

  // Button event listeners
  setupButtonListeners();
}

// Setup modals
function setupModals() {
  const modals = document.querySelectorAll(".modal");
  const modalTriggers = {
    loginBtn: "loginModal",
    registerBtn: "registerModal",
    showLoginModal: "loginModal",
    showRegisterModal: "registerModal",
  };

  // Open modals
  Object.keys(modalTriggers).forEach((triggerId) => {
    const trigger = document.getElementById(triggerId);
    if (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        document.getElementById(modalTriggers[triggerId]).style.display =
          "block";
      });
    }
  });

  // Close modals
  modals.forEach((modal) => {
    const closeBtn = modal.querySelector(".close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
      });
    }
  });

  // Close modal if clicking outside of it
  window.addEventListener("click", function (e) {
    modals.forEach((modal) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });
}

// Setup tab functionality
function setupTabs() {
  const tabBtns = document.querySelectorAll(".tab-btn");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");

      // Hide all tab panes
      document.querySelectorAll(".tab-pane").forEach((pane) => {
        pane.classList.remove("active");
      });

      // Deactivate all tab buttons
      tabBtns.forEach((btn) => {
        btn.classList.remove("active");
      });

      // Activate current tab and its content
      document.getElementById(tabId).classList.add("active");
      this.classList.add("active");
    });
  });
}

// Setup form submissions
function setupForms() {
  // Mentee Registration Form
  const menteeForm = document.getElementById("menteeForm");
  if (menteeForm) {
    menteeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = {
        name: document.getElementById("menteeName").value,
        email: document.getElementById("menteeEmail").value,
        password: document.getElementById("menteePassword").value,
      };

      // Validate passwords match
      if (
        formData.password !==
        document.getElementById("menteeConfirmPassword").value
      ) {
        alert("Passwords do not match");
        return;
      }

      // In a real implementation, you would send this data to your server
      console.log("Mentee registration:", formData);

      // Save to localStorage for demo purposes
      saveUser("mentee", formData);

      alert("Registration successful! You can now log in.");
      document.getElementById("registerModal").style.display = "none";
      document.getElementById("loginModal").style.display = "block";
    });
  }

  // Mentor Registration Form
  const mentorForm = document.getElementById("mentorForm");
  if (mentorForm) {
    mentorForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get selected specializations
      const specializationCheckboxes = document.querySelectorAll(
        'input[name="specialization"]:checked'
      );
      const specializations = Array.from(specializationCheckboxes).map(
        (cb) => cb.value
      );

      const formData = {
        name: document.getElementById("mentorName").value,
        membershipNumber: document.getElementById("mentorMembershipNumber")
          .value,
        email: document.getElementById("mentorEmail").value,
        specializations: specializations,
        experience: document.getElementById("mentorExperience").value,
        password: document.getElementById("mentorPassword").value,
        isMentor: true,
      };

      // Validate passwords match
      if (
        formData.password !==
        document.getElementById("mentorConfirmPassword").value
      ) {
        alert("Passwords do not match");
        return;
      }

      // Validate ICAI membership number (basic validation)
      if (!validateMembershipNumber(formData.membershipNumber)) {
        alert("Please enter a valid ICAI membership number");
        return;
      }

      // In a real implementation, you would send this data to your server
      console.log("Mentor registration:", formData);

      // Save to localStorage for demo purposes
      saveUser("mentor", formData);

      alert("Mentor registration successful! You can now log in.");
      document.getElementById("registerModal").style.display = "none";
      document.getElementById("loginModal").style.display = "block";
    });
  }

  // Login Form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      // In a real implementation, you would validate with your server
      const isLoggedIn = login(email, password);

      if (isLoggedIn) {
        document.getElementById("loginModal").style.display = "none";
        updateUIForLoggedInUser();
      } else {
        alert("Invalid email or password. Please try again.");
      }
    });
  }

  // Question Form
  const questionForm = document.getElementById("questionForm");
  if (questionForm) {
    questionForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Check if user is logged in
      const currentUser = getCurrentUser();
      if (!currentUser) {
        alert("Please log in to ask a question");
        document.getElementById("loginModal").style.display = "block";
        return;
      }

      const formData = {
        title: document.getElementById("questionTitle").value,
        category: document.getElementById("questionCategory").value,
        details: document.getElementById("questionDetails").value,
        askedBy: currentUser.name,
        askedById: currentUser.id,
        askedAt: new Date().toISOString(),
        id: generateId(),
        answers: [],
      };

      // In a real implementation, you would send this data to your server
      console.log("New question:", formData);

      // Save to localStorage for demo purposes
      saveQuestion(formData);

      alert("Your question has been submitted successfully!");
      questionForm.reset();

      // Reload questions to show the new one
      loadQuestions();
    });
  }

  // Answer Form
  const answerForm = document.getElementById("answerForm");
  if (answerForm) {
    answerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Check if user is logged in and is a mentor
      const currentUser = getCurrentUser();
      if (!currentUser) {
        alert("Please log in to answer a question");
        document.getElementById("loginModal").style.display = "block";
        return;
      }

      if (!currentUser.isMentor) {
        alert("Only registered mentors can answer questions");
        return;
      }

      const questionId = document.getElementById("questionId").value;
      const answerContent = document.getElementById("answerContent").value;

      const answerData = {
        content: answerContent,
        answeredBy: currentUser.name,
        answeredById: currentUser.id,
        answeredAt: new Date().toISOString(),
        id: generateId(),
      };

      // In a real implementation, you would send this data to your server
      console.log("New answer for question " + questionId + ":", answerData);

      // Save to localStorage for demo purposes
      saveAnswer(questionId, answerData);

      alert("Your answer has been submitted successfully!");
      answerForm.reset();
      document.getElementById("answerModal").style.display = "none";

      // Reload questions to show the new answer
      loadQuestions();
    });
  }
}

// Setup button event listeners
function setupButtonListeners() {
  // Become a Mentor button
  const becomeMentorBtn = document.getElementById("becomeMentorBtn");
  if (becomeMentorBtn) {
    becomeMentorBtn.addEventListener("click", function () {
      const registerModal = document.getElementById("registerModal");
      registerModal.style.display = "block";

      // Switch to mentor tab
      document.querySelector('.tab-btn[data-tab="mentor"]').click();
    });
  }

  // Find an Answer button
  const findAnswerBtn = document.getElementById("findAnswerBtn");
  if (findAnswerBtn) {
    findAnswerBtn.addEventListener("click", function () {
      window.location.href = "#questions";
    });
  }
}

// Load sample questions
function loadSampleQuestions() {
  // Check if we already have questions in localStorage
  const existingQuestions = localStorage.getItem("questions");
  if (existingQuestions && JSON.parse(existingQuestions).length > 0) {
    loadQuestions();
    return;
  }

  // Sample questions for demonstration
  const sampleQuestions = [
    {
      id: "q1",
      title: "GST Implications on Cross-Border Services",
      category: "international-taxation",
      details:
        "Our company provides consulting services to clients in the UK and USA. What are the GST implications for these services? Do we need to register for VAT in these countries?",
      askedBy: "Rahul Sharma",
      askedById: "user1",
      askedAt: "2025-03-15T10:30:00Z",
      answers: [
        {
          id: "a1",
          content:
            "For services provided to UK clients, you would generally not need to register for VAT if you are providing B2B services. This is because the place of supply would be the UK, and the UK client would account for VAT under the reverse charge mechanism. For USA clients, there is no VAT/GST system, but you should be aware of potential state sales taxes depending on where your clients are located. I would recommend consulting with a tax specialist in each country to ensure compliance.",
          answeredBy: "Priya Mehta",
          answeredById: "mentor1",
          answeredAt: "2025-03-16T14:45:00Z",
        },
      ],
    },
    {
      id: "q2",
      title: "Audit Procedures for Inventory Valuation",
      category: "audit",
      details:
        "What are the recommended audit procedures for verifying inventory valuation when a client has multiple warehouse locations and uses a weighted average costing method?",
      askedBy: "Vikram Patel",
      askedById: "user2",
      askedAt: "2025-03-10T08:15:00Z",
      answers: [],
    },
    {
      id: "q3",
      title: "Income Computation for Partnership Firm",
      category: "taxation",
      details:
        "How should income be computed in the hands of partners of a partnership firm? What are the tax implications when remuneration and interest on capital is paid to partners?",
      askedBy: "Sanjay Gupta",
      askedById: "user3",
      askedAt: "2025-03-18T16:20:00Z",
      answers: [
        {
          id: "a2",
          content:
            'For partnership firms, income is first computed at the firm level at the applicable rate. Remuneration and interest on capital paid to partners is allowed as a deduction to the firm subject to limits specified in section 40(b) of the Income Tax Act. In the hands of partners, such remuneration and interest is taxable as "Profits and gains from business or profession" under section 28 of the Act. The remaining profit share is exempt in the hands of partners under section 10(2A). Remember to check the deed of partnership for allocation of profits and compliance with section 184 and 40(b) conditions.',
          answeredBy: "Harish Jain",
          answeredById: "mentor2",
          answeredAt: "2025-03-19T11:30:00Z",
        },
      ],
    },
  ];

  // Save to localStorage
  localStorage.setItem("questions", JSON.stringify(sampleQuestions));

  // Load questions
  loadQuestions();
}

// Load questions from localStorage
function loadQuestions() {
  const questionsContainer = document.getElementById("questionsContainer");
  if (!questionsContainer) return;

  questionsContainer.innerHTML =
    '<div class="loading">Loading questions...</div>';

  // In a real implementation, you would fetch questions from your server
  const questions = JSON.parse(localStorage.getItem("questions") || "[]");

  if (questions.length === 0) {
    questionsContainer.innerHTML =
      "<p>No questions have been asked yet. Be the first to ask!</p>";
    return;
  }

  // Sort questions by date (newest first)
  questions.sort((a, b) => new Date(b.askedAt) - new Date(a.askedAt));

  const currentUser = getCurrentUser();
  const isMentor = currentUser && currentUser.isMentor;

  questionsContainer.innerHTML = "";
  questions.forEach((question) => {
    const answersHtml = question.answers
      .map(
        (answer) => `
            <div class="answer-container">
                <div class="answer-header">
                    <div>Answered by <strong>${answer.answeredBy}</strong></div>
                    <div>${formatDate(answer.answeredAt)}</div>
                </div>
                <div class="answer-content">${answer.content}</div>
            </div>
        `
      )
      .join("");

    const answerButtonHtml =
      isMentor && question.answers.length === 0
        ? `<button class="answer-button" data-question-id="${question.id}">Answer this question</button>`
        : "";

    const questionHtml = `
            <div class="question-card">
                <div class="question-header">
                    <h3 class="question-title">${question.title}</h3>
                    <span class="question-category">${formatCategory(
                      question.category
                    )}</span>
                </div>
                <div class="question-metadata">
                    <div><i class="fas fa-user"></i> ${question.askedBy}</div>
                    <div><i class="fas fa-calendar"></i> ${formatDate(
                      question.askedAt
                    )}</div>
                    <div><i class="fas fa-comment"></i> ${
                      question.answers.length
                    } answer(s)</div>
                </div>
                <div class="question-content">${question.details}</div>
                ${answerButtonHtml}
                ${answersHtml}
            </div>
        `;

    questionsContainer.innerHTML += questionHtml;
  });

  // Add event listeners for answer buttons
  const answerButtons = document.querySelectorAll(".answer-button");
  answerButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const questionId = this.getAttribute("data-question-id");
      openAnswerModal(questionId);
    });
  });
}

// Open the answer modal for a specific question
function openAnswerModal(questionId) {
  const questions = JSON.parse(localStorage.getItem("questions") || "[]");
  const question = questions.find((q) => q.id === questionId);

  if (!question) return;

  const modalQuestionDetails = document.getElementById("modalQuestionDetails");
  document.getElementById("questionId").value = questionId;

  modalQuestionDetails.innerHTML = `
        <h3>${question.title}</h3>
        <div class="meta">Asked by ${question.askedBy} on ${formatDate(
    question.askedAt
  )}</div>
        <p>${question.details}</p>
    `;

  document.getElementById("answerModal").style.display = "block";
}

// Utility Functions

// Save user to localStorage
function saveUser(type, userData) {
  // Generate a unique ID
  userData.id = generateId();

  // Get existing users
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  // Check if email already exists
  if (users.find((user) => user.email === userData.email)) {
    alert("An account with this email already exists");
    return false;
  }

  // Add to users array
  users.push(userData);

  // Save back to localStorage
  localStorage.setItem("users", JSON.stringify(users));

  return true;
}

// Login function
function login(email, password) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Set current user in localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));
    return true;
  }

  return false;
}

// Get current logged in user
function getCurrentUser() {
  const userJson = localStorage.getItem("currentUser");
  return userJson ? JSON.parse(userJson) : null;
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  // Update auth buttons
  const authButtons = document.querySelector(".auth-buttons");
  if (authButtons) {
    authButtons.innerHTML = `
            <span>Welcome, ${currentUser.name}</span>
            <button id="logoutBtn">Logout</button>
        `;

    // Add logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.reload();
      });
    }
  }

  // Enable ask question functionality
  const questionForm = document.getElementById("questionForm");
  if (questionForm) {
    questionForm.querySelector("button").disabled = false;
  }

  // Reload questions to show answer buttons for mentors
  loadQuestions();
}

// Save a new question
function saveQuestion(questionData) {
  const questions = JSON.parse(localStorage.getItem("questions") || "[]");
  questions.push(questionData);
  localStorage.setItem("questions", JSON.stringify(questions));
}

// Save an answer to a question
function saveAnswer(questionId, answerData) {
  const questions = JSON.parse(localStorage.getItem("questions") || "[]");
  const questionIndex = questions.findIndex((q) => q.id === questionId);

  if (questionIndex >= 0) {
    questions[questionIndex].answers.push(answerData);
    localStorage.setItem("questions", JSON.stringify(questions));
  }
}

// Generate a unique ID
function generateId() {
  return "id_" + Math.random().toString(36).substr(2, 9);
}

// Format a date string
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format category string for display
function formatCategory(category) {
  const categories = {
    taxation: "Taxation",
    "international-taxation": "International Taxation",
    audit: "Audit",
    finance: "Finance",
    compliance: "Compliance",
    accounting: "Accounting",
    other: "Other",
  };

  return categories[category] || category;
}

// Validate ICAI membership number (basic validation)
function validateMembershipNumber(membershipNumber) {
  // This is a basic validation. In a real implementation,
  // you would have more sophisticated validation or check against a database
  return /^[0-9]{5,6}$/.test(membershipNumber.trim());
}

// Check on page load if user is already logged in
window.addEventListener("load", function () {
  const currentUser = getCurrentUser();
  if (currentUser) {
    updateUIForLoggedInUser();
  }
});
