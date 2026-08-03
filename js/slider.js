"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("heroSlider");

    if (!slider) {
        return;
    }

    const slides = Array.from(
        slider.querySelectorAll(".hero-slide")
    );

    const previousButton =
        slider.querySelector("#previousSlide");

    const nextButton =
        slider.querySelector("#nextSlide");

    const dotsContainer =
        slider.querySelector("#sliderDots");

    const progressBar =
        slider.querySelector("#sliderProgressBar");

    /*
    مدة عرض كل صورة:

    1000 = ثانية واحدة
    10000 = عشر ثوانٍ
    */

    const slideDuration = 10000;

    let currentSlideIndex = 0;
    let autoplayTimer = null;

    let dragStartX = 0;
    let dragCurrentX = 0;
    let isDragging = false;

    if (slides.length === 0) {
        return;
    }

    /* ========================================
       إنشاء نقاط التنقل
    ======================================== */

    function createDots() {
        if (!dotsContainer) {
            return;
        }

        dotsContainer.innerHTML = "";

        slides.forEach((slide, index) => {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "slider-dot";

            dot.setAttribute(
                "aria-label",
                `عرض الإعلان رقم ${index + 1}`
            );

            dot.addEventListener("click", () => {
                goToSlide(index);
                restartAutoplay();
            });

            dotsContainer.appendChild(dot);
        });
    }

    /* ========================================
       عرض إعلان محدد
    ======================================== */

    function goToSlide(index) {
        if (index >= slides.length) {
            currentSlideIndex = 0;
        } else if (index < 0) {
            currentSlideIndex = slides.length - 1;
        } else {
            currentSlideIndex = index;
        }

        slides.forEach((slide, slideIndex) => {
            const isCurrentSlide =
                slideIndex === currentSlideIndex;

            slide.classList.toggle(
                "active",
                isCurrentSlide
            );

            slide.setAttribute(
                "aria-hidden",
                String(!isCurrentSlide)
            );
        });

        updateDots();
        updateHeaderAndCategoriesBackground();
        restartProgressBar();
    }

    /* ========================================
       جعل خلفية الهيدر وشريط الأقسام
       نفس صورة الإعلان الظاهر
    ======================================== */

    function updateHeaderAndCategoriesBackground() {
        const activeSlide = slides[currentSlideIndex];

        if (!activeSlide) {
            return;
        }

        const activeImage =
            activeSlide.querySelector(".slide-image");

        if (!activeImage) {
            return;
        }

        const imageSource =
            activeImage.currentSrc ||
            activeImage.getAttribute("src");

        if (!imageSource) {
            return;
        }

        document.documentElement.style.setProperty(
            "--active-hero-image",
            `url("${imageSource}")`
        );
    }

    /* ========================================
       تحديث نقاط التنقل
    ======================================== */

    function updateDots() {
        if (!dotsContainer) {
            return;
        }

        const dots = Array.from(
            dotsContainer.querySelectorAll(".slider-dot")
        );

        dots.forEach((dot, dotIndex) => {
            const isCurrentDot =
                dotIndex === currentSlideIndex;

            dot.classList.toggle(
                "active",
                isCurrentDot
            );

            if (isCurrentDot) {
                dot.setAttribute(
                    "aria-current",
                    "true"
                );
            } else {
                dot.removeAttribute(
                    "aria-current"
                );
            }
        });
    }

    /* ========================================
       الصورة التالية والسابقة
    ======================================== */

    function showNextSlide() {
        goToSlide(currentSlideIndex + 1);
    }

    function showPreviousSlide() {
        goToSlide(currentSlideIndex - 1);
    }

    /* ========================================
       التشغيل التلقائي
    ======================================== */

    function stopAutoplay() {
        if (autoplayTimer !== null) {
            window.clearTimeout(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function startAutoplay() {
        stopAutoplay();

        autoplayTimer = window.setTimeout(() => {
            showNextSlide();
            startAutoplay();
        }, slideDuration);
    }

    function restartAutoplay() {
        startAutoplay();
    }

    /* ========================================
       خط مدة عرض الإعلان
    ======================================== */

    function restartProgressBar() {
        if (!progressBar) {
            return;
        }

        progressBar.classList.remove("running");

        void progressBar.offsetWidth;

        progressBar.classList.add("running");
    }

    /* ========================================
       الأسهم
    ======================================== */

    if (previousButton) {
        previousButton.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                event.stopPropagation();

                showPreviousSlide();
                restartAutoplay();
            }
        );
    }

    if (nextButton) {
        nextButton.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                event.stopPropagation();

                showNextSlide();
                restartAutoplay();
            }
        );
    }

    /* ========================================
       التحكم بلوحة المفاتيح
    ======================================== */

    slider.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            showNextSlide();
            restartAutoplay();
        }

        if (event.key === "ArrowRight") {
            showPreviousSlide();
            restartAutoplay();
        }
    });

    /* ========================================
       السحب بالماوس والهاتف
    ======================================== */

    slider.addEventListener("pointerdown", (event) => {
        const interactiveElement =
            event.target.closest(
                "a, button, input, form, nav, .slider-arrow, .slider-dot, .slide-button, .category-link, .header-action"
            );

        if (interactiveElement) {
            return;
        }

        isDragging = true;

        dragStartX = event.clientX;
        dragCurrentX = event.clientX;

        slider.classList.add("dragging");

        if (
            typeof slider.setPointerCapture === "function"
        ) {
            slider.setPointerCapture(event.pointerId);
        }
    });

    slider.addEventListener("pointermove", (event) => {
        if (!isDragging) {
            return;
        }

        dragCurrentX = event.clientX;
    });

    slider.addEventListener("pointerup", (event) => {
        if (!isDragging) {
            return;
        }

        dragCurrentX = event.clientX;

        finishDrag();

        if (
            typeof slider.releasePointerCapture === "function"
        ) {
            slider.releasePointerCapture(event.pointerId);
        }
    });

    slider.addEventListener(
        "pointercancel",
        cancelDrag
    );

    function finishDrag() {
        const dragDistance =
            dragCurrentX - dragStartX;

        const minimumDragDistance = 55;

        isDragging = false;

        slider.classList.remove("dragging");

        if (
            Math.abs(dragDistance) <
            minimumDragDistance
        ) {
            return;
        }

        if (dragDistance < 0) {
            showNextSlide();
        }

        if (dragDistance > 0) {
            showPreviousSlide();
        }

        restartAutoplay();
    }

    function cancelDrag() {
        isDragging = false;

        dragStartX = 0;
        dragCurrentX = 0;

        slider.classList.remove("dragging");
    }

    /* ========================================
       إيقاف السلايدر عند مغادرة الصفحة
    ======================================== */

    document.addEventListener(
        "visibilitychange",
        () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                restartProgressBar();
                startAutoplay();
            }
        }
    );

    /* ========================================
       تشغيل السلايدر
    ======================================== */

    createDots();
    goToSlide(0);
    startAutoplay();
});