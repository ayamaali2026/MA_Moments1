"use strict";

/*
========================================
MA Moments Shared Header
========================================
*/

const COMPANY_WHATSAPP = "972597496652";

class MAHeader extends HTMLElement {
    connectedCallback() {
        this.render();
        this.setupSearch();
        this.setupWhatsApp();
        this.updateCounters();

        window.addEventListener("storage", () => {
            this.updateCounters();
        });

        window.addEventListener("ma-data-updated", () => {
            this.updateCounters();
        });
    }

    render() {
            const currentPage =
                window.location.pathname.split("/").pop() ||
                "index.html";

            const isHomePage =
                currentPage === "index.html";

            this.innerHTML = `
            <header
                class="main-header ${
                    isHomePage ? "home-header" : ""
                }"
            >
                <div class="header-container">

<a
    href="index.html"
    class="brand-logo"
    aria-label="العودة إلى الصفحة الرئيسية"
    dir="ltr"
>
    <span class="brand-title">MA Moments</span>
</a>

                    <form
                        class="header-search"
                        id="headerSearchForm"
                    >
                        <input
                            type="search"
                            id="headerSearchInput"
                            placeholder="ابحثي: بيجامة وردية XL أو بديل زارا..."
                            aria-label="البحث عن المنتجات"
                            autocomplete="off"
                        >

                        <button
                            type="submit"
                            aria-label="بحث"
                        >
                            ${this.getSearchIcon()}
                        </button>
                    </form>

                    <nav
                        class="header-actions"
                        aria-label="روابط الموقع الرئيسية"
                    >

                        ${
                            !isHomePage
                                ? `
                                    <a
                                        href="index.html"
                                        class="header-action"
                                        aria-label="الصفحة الرئيسية"
                                        title="الصفحة الرئيسية"
                                    >
                                        ${this.getHomeIcon()}

                                        <span class="action-text">
                                            الرئيسية
                                        </span>
                                    </a>
                                `
                                : ""
                        }

                        <a
                            href="products.html"
                            class="header-action"
                            aria-label="المنتجات"
                            title="المنتجات"
                        >
                            ${this.getProductsIcon()}

                            <span class="action-text">
                                المنتجات
                            </span>
                        </a>

                        <a
                            href="wishlist.html"
                            class="header-action"
                            aria-label="العناصر المفضلة"
                            title="العناصر المفضلة"
                        >
                            <span class="icon-wrapper">
                                ${this.getHeartIcon()}

                                <span
                                    class="header-badge"
                                    id="wishlistCount"
                                >
                                    0
                                </span>
                            </span>

                            <span class="action-text">
                                المفضلة
                            </span>
                        </a>

                        <a
                            href="cart.html"
                            class="header-action"
                            aria-label="سلة التسوق"
                            title="سلة التسوق"
                        >
                            <span class="icon-wrapper">
                                ${this.getCartIcon()}

                                <span
                                    class="header-badge"
                                    id="cartCount"
                                >
                                    0
                                </span>
                            </span>

                            <span class="action-text">
                                السلة
                            </span>
                        </a>

                        <a
                            href="#"
                            id="whatsappLink"
                            class="header-action whatsapp-action"
                            aria-label="التواصل عبر واتساب"
                            title="واتساب"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${this.getWhatsAppIcon()}

                            <span class="action-text">
                                واتساب
                            </span>
                        </a>

                    </nav>
                </div>
            </header>
        `;
    }

    setupSearch() {
        const searchForm =
            this.querySelector("#headerSearchForm");

        const searchInput =
            this.querySelector("#headerSearchInput");

        if (!searchForm || !searchInput) {
            return;
        }

        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const searchValue =
                searchInput.value.trim();

            if (!searchValue) {
                searchInput.focus();
                return;
            }

            window.location.href =
                `products.html?search=${encodeURIComponent(
                    searchValue
                )}`;
        });
    }

    setupWhatsApp() {
        const whatsappLink =
            this.querySelector("#whatsappLink");

        if (!whatsappLink) {
            return;
        }

        const message =
            "مرحبًا، أريد الاستفسار عن منتجات MA Moments.";

        const isNumberReady =
            /^\d{10,15}$/.test(COMPANY_WHATSAPP);

        if (isNumberReady) {
            whatsappLink.href =
                `https://wa.me/${COMPANY_WHATSAPP}` +
                `?text=${encodeURIComponent(message)}`;
        } else {
            whatsappLink.addEventListener(
                "click",
                (event) => {
                    event.preventDefault();

                    alert(
                        "يرجى إضافة رقم واتساب الشركة الحقيقي."
                    );
                }
            );
        }
    }

    updateCounters() {
        const wishlistCountElement =
            this.querySelector("#wishlistCount");

        const cartCountElement =
            this.querySelector("#cartCount");

        const wishlistItems =
            this.getStoredArray("maMomentsWishlist");

        const cartItems =
            this.getStoredArray("maMomentsCart");

        if (wishlistCountElement) {
            wishlistCountElement.textContent =
                wishlistItems.length;

            wishlistCountElement.hidden =
                wishlistItems.length === 0;
        }

        if (cartCountElement) {
            const totalCartQuantity =
                cartItems.reduce((total, item) => {
                    const quantity =
                        Number(item.quantity) || 1;

                    return total + quantity;
                }, 0);

            cartCountElement.textContent =
                totalCartQuantity;

            cartCountElement.hidden =
                totalCartQuantity === 0;
        }
    }

    getStoredArray(key) {
        try {
            const storedData =
                localStorage.getItem(key);

            if (!storedData) {
                return [];
            }

            const parsedData =
                JSON.parse(storedData);

            return Array.isArray(parsedData)
                ? parsedData
                : [];
        } catch (error) {
            console.error(
                `Error reading ${key}:`,
                error
            );

            return [];
        }
    }

    getHomeIcon() {
        return `
            <svg
                class="header-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                />
            </svg>
        `;
    }

    getProductsIcon() {
        return `
            <svg
                class="header-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M4 5.5h16v13H4zM4 9.5h16M8 5.5v4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        `;
    }

    getHeartIcon() {
        return `
            <svg
                class="header-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linejoin="round"
                />
            </svg>
        `;
    }

    getCartIcon() {
        return `
            <svg
                class="header-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />

                <circle
                    cx="9.5"
                    cy="20"
                    r="1.2"
                    fill="currentColor"
                />

                <circle
                    cx="18"
                    cy="20"
                    r="1.2"
                    fill="currentColor"
                />
            </svg>
        `;
    }

    getSearchIcon() {
        return `
            <svg
                class="search-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <circle
                    cx="11"
                    cy="11"
                    r="7"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                />

                <path
                    d="m16.5 16.5 4 4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                />
            </svg>
        `;
    }

    getWhatsAppIcon() {
        return `
            <svg
                class="header-icon whatsapp-icon"
                viewBox="0 0 32 32"
                aria-hidden="true"
            >
                <path
                    fill="currentColor"
                    d="M16.04 3C8.83 3 3 8.7 3 15.74c0 2.48.74 4.91 2.13 6.97L3 29l6.52-2.04a13.2 13.2 0 0 0 6.51 1.72h.01C23.24 28.68 29 23 29 15.74 29 8.7 23.25 3 16.04 3Zm0 23.53a11.1 11.1 0 0 1-5.66-1.53l-.41-.24-3.87 1.21 1.27-3.72-.27-.42a10.46 10.46 0 0 1-1.7-5.71c0-5.97 4.87-10.82 10.67-10.82 5.91 0 10.67 4.85 10.67 10.82 0 5.97-4.79 10.41-10.7 10.41Zm5.85-7.84c-.32-.16-1.89-.92-2.18-1.03-.29-.1-.5-.16-.71.16-.21.31-.82 1.03-1 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.48-2.55-1.54a9.58 9.58 0 0 1-1.77-2.16c-.18-.31-.02-.48.14-.64.14-.14.32-.37.47-.55.16-.18.21-.31.32-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.68-.97-2.3-.26-.61-.52-.52-.71-.53h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.58 0 1.52 1.13 2.99 1.29 3.2.16.21 2.22 3.33 5.38 4.67.75.32 1.34.51 1.8.65.76.24 1.44.2 1.98.12.6-.09 1.89-.76 2.15-1.5.26-.73.26-1.36.18-1.5-.08-.13-.29-.21-.61-.37Z"
                />
            </svg>
        `;
    }
}

customElements.define("ma-header", MAHeader);

window.updateHeaderCounters = function () {
    window.dispatchEvent(
        new Event("ma-data-updated")
    );
};