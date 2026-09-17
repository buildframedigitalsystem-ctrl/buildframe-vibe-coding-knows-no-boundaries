/* ==========================================================
   BUILDFRAME ACADEMY
   VIBE CODING KNOWS NO BOUNDARIES
   Interactive eBook

   FEATURES
   1. Reading progress
   2. Text size controls
   3. Vocabulary drawer
   4. Copy Prompt buttons
   5. Teen project choices
   6. Section awareness
   7. Keyboard accessibility
   ========================================================== */


"use strict";


/* ==========================================================
   1. ELEMENTS
   ========================================================== */

const root = document.documentElement;

const progressBar =
    document.getElementById("reading-progress-bar");

const increaseTextButton =
    document.getElementById("increase-text");

const decreaseTextButton =
    document.getElementById("decrease-text");

const openVocabularyButton =
    document.getElementById("open-vocabulary");

const closeVocabularyButton =
    document.getElementById("close-vocabulary");

const vocabularyPanel =
    document.getElementById("vocabulary-panel");

const copyButtons =
    document.querySelectorAll(".copy-button");

const teenChoiceButtons =
    document.querySelectorAll(".teen-choice-grid button");

const ebookPages =
    document.querySelectorAll(".ebook-page");


/* ==========================================================
   2. READING PROGRESS
   ========================================================== */

function updateReadingProgress() {

    if (!progressBar) {
        return;
    }

    const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop;

    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    if (documentHeight <= 0) {
        progressBar.style.width = "0%";
        return;
    }

    const progress =
        Math.min(
            100,
            Math.max(
                0,
                (scrollTop / documentHeight) * 100
            )
        );

    progressBar.style.width =
        `${progress}%`;
}


window.addEventListener(
    "scroll",
    updateReadingProgress,
    { passive: true }
);

window.addEventListener(
    "resize",
    updateReadingProgress
);

updateReadingProgress();


/* ==========================================================
   3. TEXT SIZE CONTROLS
   ========================================================== */

let textScale = 1;

const minimumTextScale = 0.9;
const maximumTextScale = 1.35;
const textScaleStep = 0.1;


function applyTextScale() {

    root.style.setProperty(
        "--text-scale",
        textScale.toFixed(2)
    );

    updateTextButtons();
}


function updateTextButtons() {

    if (decreaseTextButton) {
        decreaseTextButton.disabled =
            textScale <= minimumTextScale;
    }

    if (increaseTextButton) {
        increaseTextButton.disabled =
            textScale >= maximumTextScale;
    }
}


function increaseTextSize() {

    textScale =
        Math.min(
            maximumTextScale,
            textScale + textScaleStep
        );

    applyTextScale();
}


function decreaseTextSize() {

    textScale =
        Math.max(
            minimumTextScale,
            textScale - textScaleStep
        );

    applyTextScale();
}


if (increaseTextButton) {

    increaseTextButton.addEventListener(
        "click",
        increaseTextSize
    );
}


if (decreaseTextButton) {

    decreaseTextButton.addEventListener(
        "click",
        decreaseTextSize
    );
}


applyTextScale();


/* ==========================================================
   4. VOCABULARY DRAWER
   ========================================================== */

function openVocabulary() {

    if (!vocabularyPanel) {
        return;
    }

    vocabularyPanel.classList.add("open");

    vocabularyPanel.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

    if (closeVocabularyButton) {
        closeVocabularyButton.focus();
    }
}


function closeVocabulary() {

    if (!vocabularyPanel) {
        return;
    }

    vocabularyPanel.classList.remove("open");

    vocabularyPanel.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

    if (openVocabularyButton) {
        openVocabularyButton.focus();
    }
}


if (openVocabularyButton) {

    openVocabularyButton.addEventListener(
        "click",
        openVocabulary
    );
}


if (closeVocabularyButton) {

    closeVocabularyButton.addEventListener(
        "click",
        closeVocabulary
    );
}


/* Close Vocabulary with Escape key */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            vocabularyPanel &&
            vocabularyPanel.classList.contains("open")
        ) {
            closeVocabulary();
        }
    }
);


/* ==========================================================
   5. COPY PROMPT BUTTONS
   ========================================================== */

async function copyPrompt(button) {

    const text =
        button.dataset.copy;

    if (!text) {
        return;
    }

    const originalText =
        button.textContent;

    try {

        await navigator.clipboard.writeText(text);

        button.textContent =
            "✓ Copied!";

        button.classList.add(
            "copied"
        );

        window.setTimeout(
            function () {

                button.textContent =
                    originalText;

                button.classList.remove(
                    "copied"
                );

            },
            1800
        );

    } catch (error) {

        /*
           Some browsers block the Clipboard API
           when a page is opened directly as a file.

           This is our simple fallback.
        */

        const temporaryTextArea =
            document.createElement("textarea");

        temporaryTextArea.value =
            text;

        temporaryTextArea.setAttribute(
            "readonly",
            ""
        );

        temporaryTextArea.style.position =
            "fixed";

        temporaryTextArea.style.opacity =
            "0";

        document.body.appendChild(
            temporaryTextArea
        );

        temporaryTextArea.select();

        try {

            document.execCommand("copy");

            button.textContent =
                "✓ Copied!";

        } catch (fallbackError) {

            button.textContent =
                "Select & Copy";

        }

        temporaryTextArea.remove();

        window.setTimeout(
            function () {

                button.textContent =
                    originalText;

            },
            1800
        );
    }
}


copyButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                copyPrompt(button);

            }
        );

    }
);


/* ==========================================================
   6. TEEN PROJECT CHOICES
   ========================================================== */

teenChoiceButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                teenChoiceButtons.forEach(
                    function (otherButton) {

                        otherButton.classList.remove(
                            "selected"
                        );

                        otherButton.setAttribute(
                            "aria-pressed",
                            "false"
                        );

                    }
                );

                button.classList.add(
                    "selected"
                );

                button.setAttribute(
                    "aria-pressed",
                    "true"
                );

                showTeenChoiceMessage(
                    button.textContent.trim()
                );

            }
        );

        button.setAttribute(
            "aria-pressed",
            "false"
        );

    }
);


function showTeenChoiceMessage(choice) {

    const teenProject =
        document.getElementById(
            "teen-project"
        );

    if (!teenProject) {
        return;
    }

    let message =
        teenProject.querySelector(
            ".teen-choice-message"
        );


    if (!message) {

        message =
            document.createElement("div");

        message.className =
            "teen-choice-message";

        const teenInner =
            teenProject.querySelector(
                ".teen-inner"
            );

        if (teenInner) {
            teenInner.appendChild(message);
        }
    }


    message.innerHTML = `
        <span aria-hidden="true">⚡</span>

        <div>
            <strong>
                Mission selected:
                ${escapeHTML(choice)}
            </strong>

            <p>
                Great. Your idea comes first.
                In the next lesson, we will learn
                how to explain this idea to ChatGPT.
            </p>
        </div>
    `;
}


/* ==========================================================
   7. SAFE TEXT FOR GENERATED MESSAGES
   ========================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ==========================================================
   8. ACTIVE SECTION DETECTION
   ========================================================== */

let currentTheme =
    "foundation";


function setCurrentTheme(theme) {

    if (!theme) {
        return;
    }

    if (theme === currentTheme) {
        return;
    }

    currentTheme =
        theme;

    document.body.dataset.currentTheme =
        theme;
}


if (
    "IntersectionObserver" in window &&
    ebookPages.length > 0
) {

    const pageObserver =
        new IntersectionObserver(

            function (entries) {

                const visibleEntries =
                    entries
                        .filter(
                            function (entry) {
                                return entry.isIntersecting;
                            }
                        )
                        .sort(
                            function (a, b) {
                                return (
                                    b.intersectionRatio -
                                    a.intersectionRatio
                                );
                            }
                        );


                if (visibleEntries.length === 0) {
                    return;
                }


                const mostVisiblePage =
                    visibleEntries[0].target;


                const theme =
                    mostVisiblePage.dataset.theme ||
                    "foundation";


                setCurrentTheme(theme);

            },

            {
                root: null,

                threshold: [
                    0.2,
                    0.4,
                    0.6,
                    0.8
                ]
            }

        );


    ebookPages.forEach(
        function (page) {

            pageObserver.observe(page);

        }
    );
}


/* ==========================================================
   9. SMOOTH INTERNAL LINKS
   ========================================================== */

const internalLinks =
    document.querySelectorAll(
        'a[href^="#"]'
    );


internalLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }
);


/* ==========================================================
   10. LITTLE PAGE ENTRANCE EFFECT
   ========================================================== */

if (
    "IntersectionObserver" in window
) {

    const revealObserver =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "page-visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.08
            }

        );


    ebookPages.forEach(
        function (page) {

            page.classList.add(
                "page-ready"
            );

            revealObserver.observe(
                page
            );

        }
    );
}


/* ==========================================================
   11. WELCOME MESSAGE FOR DEVELOPMENT
   ========================================================== */

console.log(
    "%cBuildFrame Academy",
    "font-size:18px;font-weight:bold;color:#00bfcf;"
);

console.log(
    "Vibe Coding Knows No Boundaries — interactive guide loaded."
);

/* =========================================================
   BUILDFRAME BUSINESS SOFTWARE — FOOTER ON EVERY EBOOK PAGE
   ========================================================= */

function addPageFooters() {
    const pages = document.querySelectorAll(".ebook-page");

    pages.forEach(function (page, index) {

        /* Prevent duplicate footers */
        if (page.querySelector(".ebook-page-footer")) {
            return;
        }

        const footer = document.createElement("footer");

        footer.className = "ebook-page-footer";

        footer.innerHTML = `
            <div class="ebook-page-footer-brand">

                <img
                    src="assets/images/owl-on-gear.jpeg"
                    alt="BuildFrame Professor Owl"
                >

                <div>
                    <strong>BuildFrame Business Software</strong>
                    <span>Built and Tailored for Your Business</span>
                </div>

            </div>


            <nav
                class="ebook-page-footer-links"
                aria-label="BuildFrame Business Software contacts"
            >

                <a
                    href="https://buildframe-business-software.pages.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="BuildFrame Website"
                >
                    🌐 Website
                </a>

                <a
                    href="https://myportfolio.buildframe-digitalsystem.workers.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="BuildFrame Portfolio"
                >
                    💼 Portfolio
                </a>

                <a
                    href="https://www.facebook.com/buildframebusinessoperatingsystem/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="BuildFrame Facebook Page"
                >
                    📘 Facebook
                </a>

                <a
                    href="https://wa.me/639760110243"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="BuildFrame WhatsApp"
                >
                    💬 WhatsApp
                </a>

                <a
                    href="mailto:buildframe.digitalsystem@gmail.com"
                    title="Email BuildFrame"
                >
                    ✉️ Email
                </a>

            </nav>


            <div
                class="ebook-page-footer-number"
                aria-label="Page ${index + 1}"
            >
                ${index + 1}
            </div>
        `;

        page.appendChild(footer);
    });
}

addPageFooters();