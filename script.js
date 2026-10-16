/**
 * ==============================================================================
 * PERSONAL PORTFOLIO JAVASCRIPT (script.js)
 * ==============================================================================
 * This file adds interactivity to your portfolio website:
 * 1. Mobile navigation menu toggle (open & close hamburger menu).
 * 2. Sticky navigation bar shadow on scroll.
 * 3. Active link indicator as you scroll between sections.
 * 4. Smooth reveal-on-scroll animations for cards and sections.
 * 5. Interactive contact form validation and success message.
 * 6. Dynamic copyright year in the footer.
 * ==============================================================================
 */

// Wait until the entire HTML document is loaded before running any script
document.addEventListener("DOMContentLoaded", () => {

  /* --------------------------------------------------------------------------
     1. MOBILE NAVIGATION MENU TOGGLE
     - Toggles the dropdown menu on mobile phones when clicking the hamburger icon.
     - Automatically closes the menu when a link is clicked or when clicking outside.
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const navLogo = document.querySelector(".logo");

  if (navToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    // Open or close menu when hamburger is clicked
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu when any navigation link is clicked
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close menu if brand logo is clicked
    if (navLogo) {
      navLogo.addEventListener("click", closeMenu);
    }

    // Close menu if user clicks anywhere outside the header
    document.addEventListener("click", (event) => {
      const isClickInside = navMenu.contains(event.target) || navToggle.contains(event.target);
      if (!isClickInside && navMenu.classList.contains("open")) {
        closeMenu();
      }
    });
  }


  /* --------------------------------------------------------------------------
     2. STICKY NAVBAR BACKGROUND ON SCROLL
     - Adds a translucent backdrop blur and bottom border to the navbar once
       the visitor scrolls down past 50 pixels.
     -------------------------------------------------------------------------- */
  const header = document.getElementById("header");

  if (header) {
    const handleScrollHeader = () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScrollHeader);
    handleScrollHeader(); // Run once on initial load in case page is already scrolled
  }


  /* --------------------------------------------------------------------------
     3. ACTIVE NAVIGATION LINK ON SCROLL
     - Highlights whichever navigation link corresponds to the section currently
       visible on the screen.
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");

  const highlightActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120; // Offset for the fixed header

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");
      const currentNavLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (currentNavLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentNavLink.classList.add("active");
        } else {
          currentNavLink.classList.remove("active");
        }
      }
    });
  };

  window.addEventListener("scroll", highlightActiveNavLink);


  /* --------------------------------------------------------------------------
     4. SMOOTH SCROLL REVEAL ANIMATIONS
     - Uses IntersectionObserver to smoothly fade and slide in sections,
       cards, and headers as they enter the screen.
     -------------------------------------------------------------------------- */
  // Select items to animate
  const elementsToAnimate = document.querySelectorAll(
    ".section-header, .about-card, .stat-card, .skill-category-card, .project-card, .contact-info, .contact-form-container, .hero-content, .hero-visual"
  );

  // Check if browser supports modern IntersectionObserver
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Stop observing once animated so animation doesn't repeat
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12, // Triggers when 12% of the element is visible
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elementsToAnimate.forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  } else {
    // Fallback for older browsers: show elements immediately
    elementsToAnimate.forEach((element) => {
      element.classList.add("visible");
    });
  }


  /* --------------------------------------------------------------------------
     5. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
     - Checks user inputs (name, email, subject, message) for correctness.
     - Displays friendly error messages or a success confirmation banner.
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");

  if (contactForm && formFeedback) {
    // Helper to validate email format using standard regular expression
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Helper to display error message under an input field
    const setFieldError = (fieldId, errorMessage) => {
      const errorSpan = document.getElementById(`${fieldId}-error`);
      if (errorSpan) {
        errorSpan.textContent = errorMessage;
      }
    };

    // Helper to clear error message under an input field
    const clearFieldError = (fieldId) => {
      const errorSpan = document.getElementById(`${fieldId}-error`);
      if (errorSpan) {
        errorSpan.textContent = "";
      }
    };

    // Clear error message in real time as the user types
    ["name", "email", "subject", "message"].forEach((fieldId) => {
      const input = document.getElementById(fieldId);
      if (input) {
        input.addEventListener("input", () => clearFieldError(fieldId));
      }
    });

    // Handle form submission
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevents page reload

      // Retrieve and trim input values
      const nameVal = document.getElementById("name").value.trim();
      const emailVal = document.getElementById("email").value.trim();
      const subjectVal = document.getElementById("subject").value.trim();
      const messageVal = document.getElementById("message").value.trim();

      let hasErrors = false;

      // Validate Name
      if (nameVal === "") {
        setFieldError("name", "Please enter your name.");
        hasErrors = true;
      } else {
        clearFieldError("name");
      }

      // Validate Email
      if (emailVal === "") {
        setFieldError("email", "Please enter your email address.");
        hasErrors = true;
      } else if (!isValidEmail(emailVal)) {
        setFieldError("email", "Please enter a valid email address (e.g. name@example.com).");
        hasErrors = true;
      } else {
        clearFieldError("email");
      }

      // Validate Subject
      if (subjectVal === "") {
        setFieldError("subject", "Please provide a subject.");
        hasErrors = true;
      } else {
        clearFieldError("subject");
      }

      // Validate Message
      if (messageVal === "") {
        setFieldError("message", "Please write a message before sending.");
        hasErrors = true;
      } else if (messageVal.length < 10) {
        setFieldError("message", "Your message should be at least 10 characters long.");
        hasErrors = true;
      } else {
        clearFieldError("message");
      }

      // If validation fails, stop here
      if (hasErrors) {
        formFeedback.className = "form-feedback error";
        formFeedback.textContent = "Please fix the highlighted errors above.";
        return;
      }

      // Check if a remote backend endpoint is configured (e.g., Formspree or Web3Forms)
      const formAction = contactForm.getAttribute("action");
      const hasRemoteBackend = formAction && formAction.startsWith("http");

      const submitBtn = document.getElementById("submit-btn");
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>Processing...</span>";

      // Helper to safely encode HTML entities
      const escapeHtml = (str) => {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
      };

      // Helper to fallback copy text to clipboard
      const copyToClipboard = (text, btnElement) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            btnElement.innerHTML = "<span>✅ Copied to Clipboard!</span>";
            setTimeout(() => {
              btnElement.innerHTML = "<span>📋 Copy Formatted Message</span>";
            }, 3000);
          }).catch(() => {
            manualCopyFallback(text, btnElement);
          });
        } else {
          manualCopyFallback(text, btnElement);
        }
      };

      const manualCopyFallback = (text, btnElement) => {
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = text;
        tempTextArea.style.position = "fixed";
        tempTextArea.style.left = "-9999px";
        document.body.appendChild(tempTextArea);
        tempTextArea.focus();
        tempTextArea.select();
        try {
          document.execCommand("copy");
          btnElement.innerHTML = "<span>✅ Copied to Clipboard!</span>";
          setTimeout(() => {
            btnElement.innerHTML = "<span>📋 Copy Formatted Message</span>";
          }, 3000);
        } catch (err) {
          btnElement.innerHTML = "<span>⚠️ Select & Copy Manually</span>";
        }
        document.body.removeChild(tempTextArea);
      };

      if (hasRemoteBackend) {
        // Send asynchronously to real backend service
        fetch(formAction, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        })
          .then((response) => {
            if (response.ok) {
              formFeedback.className = "form-feedback success";
              formFeedback.innerHTML = `
                <div class="feedback-header">
                  <span class="feedback-icon">✅</span>
                  <span class="feedback-title">Message Delivered Successfully!</span>
                </div>
                <p class="feedback-desc">
                  Thank you, <strong>${escapeHtml(nameVal)}</strong>! Your message has been sent directly to Priyanka's inbox.
                </p>
              `;
              contactForm.reset();
            } else {
              throw new Error("Form delivery error");
            }
          })
          .catch(() => {
            formFeedback.className = "form-feedback error";
            formFeedback.textContent = "Unable to send right now. Please email directly using priyank@gmail.com.";
          })
          .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span><span class="btn-icon">&rarr;</span>';
          });
      } else {
        // Front-End Mode: Prepares the message with full details and gives reliable dispatch choices
        const targetEmail = "priyank@gmail.com";
        const emailSubject = `Portfolio Message from ${nameVal}: ${subjectVal}`;
        const emailBody = `Hi Priyanka,\n\n${messageVal}\n\n---\nSender Name: ${nameVal}\nSender Email: ${emailVal}`;

        // URL encode properly for parameters
        const encodedSubject = encodeURIComponent(emailSubject);
        const encodedBody = encodeURIComponent(emailBody);

        // 1. Direct Webmail link for Gmail in browser (avoids blank Chrome tabs entirely)
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodedSubject}&body=${encodedBody}`;

        // 2. Desktop mailto link (with fully populated recipient, subject, and body)
        const mailtoUrl = `mailto:${targetEmail}?subject=${encodedSubject}&body=${encodedBody}`;

        // Formatted plain text for clipboard copying
        const clipboardText = `To: ${targetEmail}\nSubject: ${emailSubject}\n\n${emailBody}`;

        setTimeout(() => {
          formFeedback.className = "form-feedback success";
          formFeedback.innerHTML = `
            <div class="feedback-header">
              <span class="feedback-icon">📝</span>
              <span class="feedback-title">Message Prepared &amp; Ready to Send</span>
            </div>
            <p class="feedback-desc">
              Your message has been formatted for <strong>${targetEmail}</strong>. Please choose how you would like to open your email composer:
            </p>
            <div class="feedback-actions">
              <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="feedback-btn feedback-btn-gmail">
                <span>✉️ Open in Gmail (Web Browser)</span>
              </a>
              <a href="${mailtoUrl}" class="feedback-btn feedback-btn-mail">
                <span>💻 Open in Default Desktop Mail App</span>
              </a>
              <button type="button" class="feedback-btn feedback-btn-copy" id="copy-message-btn">
                <span>📋 Copy Formatted Message</span>
              </button>
            </div>
            <p class="feedback-note">
              ℹ️ <strong>Why two email options?</strong> The "Desktop Mail App" button uses <code>mailto:</code>, which requires a desktop email client (such as Outlook or Windows Mail) configured in Windows. If clicking it opens a blank browser tab, choose <strong>"Open in Gmail (Web Browser)"</strong> or use <strong>"Copy Formatted Message"</strong>.
            </p>
          `;

          // Attach copy event listener
          const copyBtn = document.getElementById("copy-message-btn");
          if (copyBtn) {
            copyBtn.addEventListener("click", () => {
              copyToClipboard(clipboardText, copyBtn);
            });
          }

          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Update / Re-Prepare Message</span><span class="btn-icon">&rarr;</span>';
        }, 350);
      }
    });
  }


  /* --------------------------------------------------------------------------
     6. DYNAMIC CURRENT YEAR IN FOOTER
     - Automatically updates the footer copyright year to the current year.
     -------------------------------------------------------------------------- */
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});
