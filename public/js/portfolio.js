
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
   VERDANT — SKILLS CARD NAVIGATION
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

