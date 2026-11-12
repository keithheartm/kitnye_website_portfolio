
/* =========================================
   VERDANT — PORTFOLIO INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".navigation");
    const navLinks = document.querySelectorAll(".nav-link, .nav-contact");
    const sections = document.querySelectorAll("main section[id]");

    /* MOBILE NAVIGATION */

    if (menuToggle && navigation) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("is-open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                navigation.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                navigation.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 800) {
                navigation.classList.remove("is-open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
            }
        });
    }

    /* ACTIVE NAVIGATION */

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const sectionId = entry.target.id;

                    document.querySelectorAll(".nav-link").forEach((link) => {
                        const isActive =
                            link.getAttribute("href") === `#${sectionId}`;

                        link.classList.toggle("active", isActive);

                        if (isActive) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                rootMargin: "-30% 0px -55% 0px",
                threshold: 0
            }
        );

        sections.forEach((section) => sectionObserver.observe(section));
    }

    /* SAFE SCROLL REVEAL */

    const revealElements = document.querySelectorAll(
        ".content-section > *"
    );

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Keep all content visible by default.
    revealElements.forEach((element) => {
        element.classList.remove("reveal-ready");
        element.classList.add("is-visible");
    });

    // Add animation only when supported and motion is allowed.
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
        revealElements.forEach((element) => {
            element.classList.remove("is-visible");
            element.classList.add("reveal-ready");
        });

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        entry.target.classList.remove("reveal-ready");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0,
                rootMargin: "0px 0px 50px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }
});

/* =========================================
 SKILLS CARD NAVIGATION
========================================= */

(() => {
    const skillsSection = document.querySelector("#skills");

    if (!skillsSection) return;

    const overview = skillsSection.querySelector("#skillsOverview");
    const cards = skillsSection.querySelectorAll("[data-skill-view]");
    const details = skillsSection.querySelectorAll(".skills-detail");
    const backButtons = skillsSection.querySelectorAll(".skills-back-button");

    let activeCard = null;

    function openSkillDetail(card) {
        const viewName = card.dataset.skillView;
        const selectedDetail = skillsSection.querySelector(
            `#skillDetail-${viewName}`
        );

        if (!selectedDetail) return;

        activeCard = card;

        overview.hidden = true;

        details.forEach((detail) => {
            detail.hidden = detail !== selectedDetail;
        });

        selectedDetail.scrollTop = 0;

        const heading = selectedDetail.querySelector("h3");

        if (heading) {
            heading.setAttribute("tabindex", "-1");
            heading.focus({ preventScroll: true });
        }

        selectedDetail.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",
            block: "start"
        });
    }

    function returnToOverview() {
        details.forEach((detail) => {
            detail.hidden = true;
        });

        overview.hidden = false;

        if (activeCard) {
            activeCard.focus({ preventScroll: true });
        }

        activeCard = null;
    }

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            openSkillDetail(card);
        });
    });

    backButtons.forEach((button) => {
        button.addEventListener("click", returnToOverview);
    });

    
})();


/* =========================================
CERTIFICATE IMAGE PREVIEW
========================================= */

(() => {
    const lightbox = document.getElementById("credentialLightbox");
    const lightboxImage = document.getElementById("credentialLightboxImage");
    const lightboxTitle = document.getElementById("credentialLightboxTitle");
    const closeButton = document.querySelector(".credential-lightbox-close");
    const previewButtons = document.querySelectorAll(".credential-preview-trigger");

    if (
        !lightbox ||
        !lightboxImage ||
        !lightboxTitle ||
        !closeButton ||
        previewButtons.length === 0
    ) {
        return;
    }

    let previouslyFocusedElement = null;

    function openPreview(button) {
        const imagePath = button.dataset.previewSrc;
        const title = button.dataset.previewTitle || "Certificate Preview";

        if (!imagePath) return;

        previouslyFocusedElement = button;

        lightboxImage.src = imagePath;
        lightboxImage.alt = title;
        lightboxTitle.textContent = title;

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        closeButton.focus();
    }

    function closePreview() {
        if (!lightbox.classList.contains("is-open")) return;

        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        lightboxImage.removeAttribute("src");
        lightboxImage.alt = "";

        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
            previouslyFocusedElement = null;
        }
    }

    previewButtons.forEach((button) => {
        button.addEventListener("click", () => openPreview(button));
    });

    closeButton.addEventListener("click", closePreview);

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closePreview();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            lightbox.classList.contains("is-open")
        ) {
            closePreview();
        }
    });
})();

/* =========================================
ACADEMIC MILESTONES TOGGLE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("academicMilestonesToggle");
    const certificates = document.getElementById("academicCertificates");

    if (!toggle || !certificates) return;

    toggle.addEventListener("click", () => {
        const isExpanded =
            toggle.getAttribute("aria-expanded") === "true";

        toggle.setAttribute("aria-expanded", String(!isExpanded));
        certificates.hidden = isExpanded;

        const label = toggle.querySelector(".toggle-text");

        if (label) {
            label.textContent = isExpanded
                ? "Explore certificates"
                : "Hide certificates";
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {

    const projectCards = document.querySelectorAll('.project-card');

    const modal = document.getElementById('projectPreviewModal');
    const modalVideo = document.getElementById('projectModalVideo');
    const modalTitle = document.getElementById('projectModalTitle');
    const modalDescription = document.getElementById('projectModalDescription');
    const closeButton = document.getElementById('closeProjectModal');


    // PLAY VIDEO WHEN HOVERING
    projectCards.forEach(function (card) {

        const video = card.querySelector('.project-preview');

        card.addEventListener('mouseenter', function () {
            if (video) {
                video.play().catch(function () {});
            }
        });

        card.addEventListener('mouseleave', function () {
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });


        // OPEN VIDEO POPUP WHEN CLICKED
        card.addEventListener('click', function () {

            const source = video.querySelector('source');

            if (!source || !source.src) return;

            modalTitle.textContent = card.dataset.title;
            modalDescription.textContent = card.dataset.description;

            modalVideo.src = source.src;

            modal.showModal();

            modalVideo.play().catch(function () {
                console.log('Press play to start the project video.');
            });

        });

    });


    // CLOSE POPUP
    closeButton.addEventListener('click', function () {
        modal.close();
    });


    // CLICK OUTSIDE TO CLOSE
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.close();
        }
    });


    // STOP VIDEO WHEN CLOSED
    modal.addEventListener('close', function () {
        modalVideo.pause();
        modalVideo.removeAttribute('src');
        modalVideo.load();
    });

});



