/* =========================================================
   GITHUB CONFIGURATION
========================================================= */

const GITHUB_USERNAME = "Teshan242";

const GITHUB_API =
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;



/* =========================================================
   DOM ELEMENTS
========================================================= */

const themeToggle =
    document.getElementById("theme-icon");

const hackerThemeToggle =
    document.getElementById("theme-toggle-hacker");

const lightDarkThemeToggle =
    document.getElementById("theme-toggle-lightdark");

const matrixCanvas =
    document.getElementById("matrix-rain");

const hamburger =
    document.querySelector(".hamburger");

const navMenu =
    document.querySelector(".nav-menu");

const navLinks =
    document.querySelectorAll(".nav-link");

const contactForm =
    document.querySelector(".contact-form");



/* =========================================================
   MATRIX RAIN
========================================================= */

let matrixAnimationId = null;
let matrixCtx = null;
let matrixColumns = [];
let matrixFontSize = 16;
let matrixLastFrameAt = 0;
let matrixChars = null;

let matrixReduceMotion =
    window.matchMedia &&
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;



function initMatrixChars() {

    matrixChars = (

        "アイウエオカキクケコサシスセソ" +
        "タチツテトナニヌネノ" +
        "ハヒフヘホマミムメモ" +
        "ヤユヨラリルレロワヲン" +
        "pasindukumarasinghe"

    ).split("");

}



function resizeMatrixCanvas() {

    if (!matrixCanvas) return;

    const dpr =
        Math.max(
            1,
            window.devicePixelRatio || 1
        );


    matrixCanvas.width =
        Math.floor(
            window.innerWidth * dpr
        );

    matrixCanvas.height =
        Math.floor(
            window.innerHeight * dpr
        );


    matrixCanvas.style.width =
        window.innerWidth + "px";

    matrixCanvas.style.height =
        window.innerHeight + "px";


    matrixCtx =
        matrixCanvas.getContext("2d");


    if (!matrixCtx) return;


    matrixCtx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    matrixFontSize =
        window.innerWidth < 480
            ? 14
            : 16;


    const cols =
        Math.ceil(
            window.innerWidth /
            matrixFontSize
        );


    matrixColumns =
        new Array(cols)
            .fill(0)
            .map(() => ({

                y:
                    Math.floor(
                        Math.random() *
                        window.innerHeight
                    ),

                speed:
                    matrixFontSize *
                    (
                        0.6 +
                        Math.random() * 1.6
                    )

            }));

}



function drawMatrixFrame(ts) {

    if (!matrixCtx || !matrixCanvas)
        return;


    const frameInterval =
        1000 / 30;


    if (
        ts - matrixLastFrameAt <
        frameInterval
    ) {

        matrixAnimationId =
            window.requestAnimationFrame(
                drawMatrixFrame
            );

        return;
    }


    matrixLastFrameAt = ts;


    matrixCtx.fillStyle =
        "rgba(0, 0, 0, 0.06)";


    matrixCtx.fillRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );


    matrixCtx.font =
        `${matrixFontSize}px ui-monospace, monospace`;


    matrixCtx.textBaseline = "top";


    for (
        let i = 0;
        i < matrixColumns.length;
        i++
    ) {

        const text =
            matrixChars[
            Math.floor(
                Math.random() *
                matrixChars.length
            )
            ];


        const x =
            i * matrixFontSize;


        const col =
            matrixColumns[i];


        const y =
            col.y;


        matrixCtx.fillStyle =
            "rgba(209, 250, 229, 0.90)";


        matrixCtx.fillText(
            text,
            x,
            y
        );


        matrixCtx.fillStyle =
            "rgba(34, 197, 94, 0.85)";


        const trailY =
            y -
            matrixFontSize * 1.4;


        if (trailY >= 0) {

            const trailChar =
                matrixChars[
                Math.floor(
                    Math.random() *
                    matrixChars.length
                )
                ];


            matrixCtx.fillText(
                trailChar,
                x,
                trailY
            );

        }


        if (
            y > window.innerHeight &&
            Math.random() > 0.985
        ) {

            col.y = 0;

            col.speed =
                matrixFontSize *
                (
                    0.6 +
                    Math.random() * 1.6
                );

        } else {

            col.y =
                y + col.speed;

        }

    }


    matrixAnimationId =
        window.requestAnimationFrame(
            drawMatrixFrame
        );

}



function startMatrixRain() {

    if (!matrixCanvas) return;

    if (matrixAnimationId !== null)
        return;

    if (matrixReduceMotion)
        return;


    if (!matrixChars)
        initMatrixChars();


    resizeMatrixCanvas();

    matrixLastFrameAt = 0;


    matrixAnimationId =
        window.requestAnimationFrame(
            drawMatrixFrame
        );

}



function stopMatrixRain() {

    if (
        matrixAnimationId !== null
    ) {

        window.cancelAnimationFrame(
            matrixAnimationId
        );

        matrixAnimationId = null;

    }


    if (
        matrixCtx &&
        matrixCanvas
    ) {

        matrixCtx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

    }

}



/* =========================================================
   THEME SYSTEM
========================================================= */

function initTheme() {

    const savedTheme =
        localStorage.getItem("theme") ||
        "dark";


    document.documentElement
        .setAttribute(
            "data-theme",
            savedTheme
        );


    updateThemeIcon(savedTheme);

}



function toggleTheme() {

    const currentTheme =
        document.documentElement
            .getAttribute("data-theme");


    const newTheme =
        currentTheme === "light"
            ? "dark"
            : "light";


    document.documentElement
        .setAttribute(
            "data-theme",
            newTheme
        );


    localStorage.setItem(
        "theme",
        newTheme
    );


    updateThemeIcon(newTheme);

}



function toggleHackerTheme() {

    const currentTheme =
        document.documentElement
            .getAttribute("data-theme");


    const newTheme =
        currentTheme === "hacker"
            ? "dark"
            : "hacker";


    document.documentElement
        .setAttribute(
            "data-theme",
            newTheme
        );


    localStorage.setItem(
        "theme",
        newTheme
    );


    updateThemeIcon(newTheme);

}



function handleThemeToggleKeydown(
    e,
    callback
) {

    if (
        e.key === "Enter" ||
        e.key === " "
    ) {

        e.preventDefault();

        callback();

    }

}



function updateThemeIcon(theme) {

    if (!themeToggle)
        return;


    if (theme === "hacker") {

        themeToggle.classList.remove(
            "fa-sun"
        );

        themeToggle.classList.add(
            "fa-moon"
        );


        if (hackerThemeToggle)
            hackerThemeToggle.classList.add(
                "active"
            );


        if (lightDarkThemeToggle)
            lightDarkThemeToggle.classList.remove(
                "active"
            );


        startMatrixRain();

        return;

    }



    if (theme === "dark") {

        themeToggle.classList.remove(
            "fa-moon"
        );

        themeToggle.classList.add(
            "fa-sun"
        );

    } else {

        themeToggle.classList.remove(
            "fa-sun"
        );

        themeToggle.classList.add(
            "fa-moon"
        );

    }


    if (hackerThemeToggle)
        hackerThemeToggle.classList.remove(
            "active"
        );


    if (lightDarkThemeToggle)
        lightDarkThemeToggle.classList.add(
            "active"
        );


    stopMatrixRain();

}



/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function toggleMobileMenu() {

    if (!hamburger || !navMenu)
        return;


    hamburger.classList.toggle(
        "active"
    );


    navMenu.classList.toggle(
        "active"
    );

}



function closeMobileMenu() {

    if (!hamburger || !navMenu)
        return;


    hamburger.classList.remove(
        "active"
    );


    navMenu.classList.remove(
        "active"
    );

}



/* =========================================================
   SMOOTH SCROLL
========================================================= */

function smoothScroll(e) {

    const targetId =
        this.getAttribute("href");


    if (
        !targetId ||
        !targetId.startsWith("#")
    )
        return;


    const targetSection =
        document.querySelector(
            targetId
        );


    if (!targetSection)
        return;


    e.preventDefault();


    const offsetTop =
        targetSection.offsetTop -
        80;


    window.scrollTo({

        top: offsetTop,

        behavior: "smooth"

    });


    closeMobileMenu();

}



/* =========================================================
   NAVBAR
========================================================= */

function updateNavbar() {

    const navbar =
        document.querySelector(
            ".navbar"
        );


    if (!navbar)
        return;


    if (window.scrollY > 50) {

        navbar.classList.add(
            "scrolled"
        );

    } else {

        navbar.classList.remove(
            "scrolled"
        );

    }

}



function updateActiveNavLink() {

    const sections =
        document.querySelectorAll(
            "section"
        );


    const scrollPos =
        window.scrollY + 100;


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop;


        const sectionHeight =
            section.clientHeight;


        const sectionId =
            section.getAttribute(
                "id"
            );


        if (
            scrollPos >= sectionTop &&
            scrollPos <
            sectionTop +
            sectionHeight
        ) {

            navLinks.forEach(link => {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute(
                        "href"
                    ) ===
                    "#" + sectionId
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            });

        }

    });

}



/* =========================================================
   GITHUB
========================================================= */

async function loadGitHubProjects() {

    const container =
        document.getElementById(
            "github-projects"
        );


    if (!container)
        return;


    try {

        const response =
            await fetch(
                GITHUB_API
            );


        if (!response.ok) {

            throw new Error(
                "GitHub API request failed"
            );

        }


        const repositories =
            await response.json();


        if (
            !Array.isArray(
                repositories
            )
        ) {

            throw new Error(
                "Invalid GitHub response"
            );

        }


        renderGitHubProjects(
            repositories
        );


        updateGitHubStats(
            repositories
        );


    } catch (error) {

        console.error(
            "GitHub Error:",
            error
        );


        container.innerHTML = `

            <div class="github-error">

                <i class="fas fa-exclamation-triangle"></i>

                <h3>
                    Unable to load GitHub projects
                </h3>

                <p>
                    Please visit my GitHub profile
                    to see my latest repositories.
                </p>

                <a
                    href="https://github.com/${GITHUB_USERNAME}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-primary"
                >

                    <i class="fab fa-github"></i>

                    Open GitHub

                </a>

            </div>

        `;

    }

}



/* =========================================================
   RENDER GITHUB REPOSITORIES
========================================================= */

function renderGitHubProjects(
    repositories
) {

    const container =
        document.getElementById(
            "github-projects"
        );


    if (!container)
        return;


    /*
       Hide forks so the portfolio
       mainly shows your own projects.
    */

    const ownRepositories =
        repositories.filter(
            repo => !repo.fork
        );


    if (
        ownRepositories.length === 0
    ) {

        container.innerHTML = `

            <div class="github-empty">

                <i class="fab fa-github"></i>

                <h3>
                    No public repositories yet
                </h3>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    ownRepositories.forEach(
        repo => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "project-card github-project-card";


            const language =
                repo.language ||
                "Various";


            const description =
                repo.description ||
                "No description provided.";


            const updated =
                formatGitHubDate(
                    repo.updated_at
                );


            card.innerHTML = `

                <div class="project-image github-project-image">

                    <i class="fab fa-github"></i>

                </div>


                <div class="project-content">

                    <div class="github-repo-header">

                        <h3>
                            ${escapeHTML(
                repo.name
            )}
                        </h3>

                        ${repo.archived
                    ? `
                                <span class="repo-status">
                                    Archived
                                </span>
                            `
                    : ""
                }

                    </div>


                    <p>
                        ${escapeHTML(
                    description
                )}
                    </p>


                    <div class="project-tech">

                        <span>
                            ${escapeHTML(
                    language
                )}
                        </span>

                        ${repo.license
                    ? `
                                <span>
                                    ${escapeHTML(
                        repo.license.name
                    )}
                                </span>
                            `
                    : ""
                }

                    </div>


                    <div class="github-repo-meta">

                        <span>
                            <i class="fas fa-star"></i>
                            ${repo.stargazers_count}
                        </span>

                        <span>
                            <i class="fas fa-code-branch"></i>
                            ${repo.forks_count}
                        </span>

                        <span>
                            <i class="fas fa-clock"></i>
                            ${updated}
                        </span>

                    </div>


                    <div class="project-links">

                        <a
                            href="${repo.html_url}"
                            class="project-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >

                            <i class="fab fa-github"></i>

                            View Repository

                        </a>


                        ${repo.homepage
                    ? `
                                <a
                                    href="${repo.homepage}"
                                    class="project-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >

                                    <i class="fas fa-external-link-alt"></i>

                                    Live Demo

                                </a>
                            `
                    : ""
                }

                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}



/* =========================================================
   GITHUB STATISTICS
========================================================= */

function updateGitHubStats(
    repositories
) {

    const ownRepositories =
        repositories.filter(
            repo => !repo.fork
        );


    /*
       Repository count
    */

    const repoCount =
        document.getElementById(
            "repo-count"
        );


    if (repoCount) {

        repoCount.textContent =
            ownRepositories.length;

    }



    /*
       Total stars
    */

    const starCount =
        document.getElementById(
            "star-count"
        );


    const totalStars =
        ownRepositories.reduce(
            (
                total,
                repo
            ) =>
                total +
                repo.stargazers_count,
            0
        );


    if (starCount) {

        starCount.textContent =
            totalStars;

    }



    /*
       Languages
    */

    const languages =
        new Set();


    ownRepositories.forEach(
        repo => {

            if (repo.language) {

                languages.add(
                    repo.language
                );

            }

        }
    );


    const languageCount =
        document.getElementById(
            "language-count"
        );


    if (languageCount) {

        languageCount.textContent =
            languages.size;

    }



    /*
       Last update
    */

    const lastUpdate =
        document.getElementById(
            "last-update"
        );


    if (lastUpdate) {

        if (
            ownRepositories.length
        ) {

            const latest =
                ownRepositories.reduce(
                    (
                        latestRepo,
                        repo
                    ) => {

                        return new Date(
                            repo.updated_at
                        ) >
                            new Date(
                                latestRepo.updated_at
                            )
                            ? repo
                            : latestRepo;

                    }
                );


            lastUpdate.textContent =
                formatGitHubDate(
                    latest.updated_at
                );

        } else {

            lastUpdate.textContent =
                "None";

        }

    }

}



/* =========================================================
   GITHUB DATE FORMAT
========================================================= */

function formatGitHubDate(
    dateString
) {

    const date =
        new Date(
            dateString
        );


    const now =
        new Date();


    const difference =
        now - date;


    const days =
        Math.floor(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (days === 0)
        return "Today";


    if (days === 1)
        return "Yesterday";


    if (days < 30)
        return `${days}d ago`;


    if (days < 365)
        return `${Math.floor(days / 30)}mo ago`;


    return `${Math.floor(days / 365)}y ago`;

}



/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(
    text
) {

    if (!text)
        return "";


    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



/* =========================================================
   CONTACT FORM
========================================================= */

function handleContactForm(e) {

    e.preventDefault();


    const formData =
        new FormData(
            contactForm
        );


    const name =
        formData.get("name");


    const email =
        formData.get("email");


    const message =
        formData.get("message");


    if (
        !name ||
        !email ||
        !message
    ) {

        showNotification(
            "Please fill in all fields",
            "error"
        );

        return;

    }


    if (
        !isValidEmail(email)
    ) {

        showNotification(
            "Please enter a valid email address",
            "error"
        );

        return;

    }


    const submitButton =
        contactForm.querySelector(
            'button[type="submit"]'
        );


    const originalButtonText =
        submitButton
            ? submitButton.textContent
            : "";


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
            "Sending...";

    }


    const endpoint =
        contactForm.getAttribute(
            "action"
        );


    fetch(
        endpoint,
        {

            method: "POST",

            body: formData,

            headers: {

                Accept:
                    "application/json"

            }

        }
    )

        .then(
            async response => {

                if (response.ok) {

                    showNotification(
                        "Message sent successfully!",
                        "success"
                    );


                    contactForm.reset();

                    return;

                }


                showNotification(
                    "Something went wrong. Please try again.",
                    "error"
                );

            }
        )

        .catch(
            () => {

                showNotification(
                    "Network error. Please check your connection.",
                    "error"
                );

            }
        )

        .finally(
            () => {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalButtonText;

                }

            }
        );

}



function isValidEmail(
    email
) {

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return emailRegex.test(
        email
    );

}



/* =========================================================
   NOTIFICATION
========================================================= */

function showNotification(
    message,
    type = "info"
) {

    const existing =
        document.querySelector(
            ".notification"
        );


    if (existing)
        existing.remove();


    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        `notification ${type}`;


    notification.textContent =
        message;


    document.body.appendChild(
        notification
    );


    setTimeout(
        () => {

            notification.classList.add(
                "show"
            );

        },
        50
    );


    setTimeout(
        () => {

            notification.classList.remove(
                "show"
            );


            setTimeout(
                () => {

                    if (
                        notification.parentNode
                    ) {

                        notification.remove();

                    }

                },
                300
            );

        },
        3000
    );

}



/* =========================================================
   SCROLL REVEAL
========================================================= */

function revealOnScroll() {

    const reveals =
        document.querySelectorAll(
            ".reveal"
        );


    reveals.forEach(
        element => {

            const elementTop =
                element.getBoundingClientRect()
                    .top;


            if (
                elementTop <
                window.innerHeight - 150
            ) {

                element.classList.add(
                    "active"
                );

            }

        }
    );

}



/* =========================================================
   ADD REVEAL CLASSES
========================================================= */

function addRevealClasses() {

    const selectors = [

        ".about-content",

        ".education-card",

        ".skill-category",

        ".project-card",

        ".certificate-card",

        ".github-stat-card",

        ".contact-info",

        ".contact-form"

    ];


    selectors.forEach(
        selector => {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(
                    element => {

                        element.classList.add(
                            "reveal"
                        );

                    }
                );

        }
    );

}



/* =========================================================
   TYPING EFFECT
========================================================= */

function typeWriter() {

    const heroTitle =
        document.querySelector(
            ".hero-title"
        );


    if (!heroTitle)
        return;


    const text =
        heroTitle.textContent.trim();


    heroTitle.textContent = "";


    let index = 0;


    function type() {

        if (
            index <
            text.length
        ) {

            heroTitle.textContent +=
                text.charAt(index);


            index++;


            setTimeout(
                type,
                70
            );

        }

    }


    setTimeout(
        type,
        500
    );

}



/* =========================================================
   PROJECT HOVER EFFECT
========================================================= */

function addProjectCardEffects() {

    document
        .querySelectorAll(
            ".project-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "mouseenter",
                    function () {

                        this.style.transform =
                            "translateY(-8px)";

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    function () {

                        this.style.transform =
                            "translateY(0)";

                    }
                );

            }
        );

}



/* =========================================================
   PARALLAX
========================================================= */

function parallaxEffect() {

    const hero =
        document.querySelector(
            ".hero"
        );


    if (!hero)
        return;


    window.addEventListener(
        "scroll",
        () => {

            if (
                matrixReduceMotion
            )
                return;


            const scrolled =
                window.pageYOffset;


            hero.style.backgroundPositionY =
                -(scrolled * 0.2) +
                "px";

        }
    );

}



/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
           Theme
        */

        initTheme();


        /*
           GitHub
        */

        loadGitHubProjects();


        /*
           Reveal
        */

        addRevealClasses();


        /*
           Typing
        */

        typeWriter();


        /*
           Navbar
        */

        updateNavbar();

        updateActiveNavLink();


        /*
           Effects
        */

        revealOnScroll();

        parallaxEffect();


        /*
           Theme buttons
        */

        if (themeToggle) {

            themeToggle.addEventListener(
                "click",
                toggleTheme
            );

        }


        if (hackerThemeToggle) {

            hackerThemeToggle.addEventListener(
                "click",
                toggleHackerTheme
            );


            hackerThemeToggle.addEventListener(
                "keydown",
                e =>
                    handleThemeToggleKeydown(
                        e,
                        toggleHackerTheme
                    )
            );

        }


        if (lightDarkThemeToggle) {

            lightDarkThemeToggle.addEventListener(
                "click",
                toggleTheme
            );


            lightDarkThemeToggle.addEventListener(
                "keydown",
                e =>
                    handleThemeToggleKeydown(
                        e,
                        toggleTheme
                    )
            );

        }


        /*
           Mobile navigation
        */

        if (hamburger) {

            hamburger.addEventListener(
                "click",
                toggleMobileMenu
            );

        }


        /*
           Navigation
        */

        navLinks.forEach(
            link => {

                link.addEventListener(
                    "click",
                    smoothScroll
                );

            }
        );


        /*
           Contact
        */

        if (contactForm) {

            contactForm.addEventListener(
                "submit",
                handleContactForm
            );

        }


        /*
           Scroll
        */

        window.addEventListener(
            "scroll",
            () => {

                updateNavbar();

                updateActiveNavLink();

                revealOnScroll();

            }
        );


        /*
           Resize
        */

        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth > 768
                ) {

                    closeMobileMenu();

                }


                if (
                    document.documentElement
                        .getAttribute(
                            "data-theme"
                        ) === "hacker"
                ) {

                    resizeMatrixCanvas();

                }

            }
        );


        /*
           Loading
        */

        window.addEventListener(
            "load",
            () => {

                document.body.classList.add(
                    "loaded"
                );

                addProjectCardEffects();

            }
        );

    }
);



/* =========================================================
   DYNAMIC CSS
========================================================= */

const dynamicCSS = `

.reveal {

    opacity: 0;

    transform:
        translateY(30px);

    transition:
        all 0.8s ease;

}


.reveal.active {

    opacity: 1;

    transform:
        translateY(0);

}


.nav-link.active {

    color:
        var(--primary-color) !important;

}


.nav-link.active::after {

    width:
        100% !important;

}


.notification {

    position: fixed;

    top: 100px;

    right: 20px;

    padding:
        15px 20px;

    border-radius:
        10px;

    color: white;

    font-weight:
        500;

    z-index:
        10000;

    transform:
        translateX(400px);

    transition:
        transform 0.3s ease;

    max-width:
        320px;

}


.notification.show {

    transform:
        translateX(0);

}


.notification.success {

    background:
        #10b981;

}


.notification.error {

    background:
        #ef4444;

}


.notification.info {

    background:
        #3b82f6;

}

`;


const dynamicStyle =
    document.createElement(
        "style"
    );


dynamicStyle.textContent =
    dynamicCSS;


document.head.appendChild(
    dynamicStyle
);
