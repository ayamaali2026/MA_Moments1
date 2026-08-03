"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(location.search).get("id");
  const products = maGetProducts();
  const product = products.find((p) => p.id === id);
  const root = document.getElementById("productDetails");
  const stickyBar = document.getElementById("stickyProductBar");
  const toast = document.getElementById("productToast");

  if (!product) {
    root.innerHTML = '<div class="no-results"><h1>المنتج غير موجود</h1></div>';
    return;
  }

  let selectedSize = product.sizes?.[0] || "";
  let selectedColor = product.colors?.[0]?.name || "";
  let currentImageIndex = 0;
  const images = product.images?.length ? product.images : [product.image].filter(Boolean);
  const isWishlisted = () => maGetArray(MA_WISHLIST_KEY).some((x) => x.id === product.id);
  const originalPrice = Number(product.originalPrice || 0);
  const currentPrice = Number(product.price || 0);
  const hasDiscount = originalPrice > currentPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  root.innerHTML = `
    <article class="shein-product-detail">
      <section class="shein-gallery" aria-label="صور المنتج">
        <div class="detail-main shein-main-image-wrap">
          <img id="detailMainImage" src="${images[0]}" alt="${product.name}">
          <span id="imageCounter" class="image-counter">1/${images.length}</span>
          ${hasDiscount ? `<span class="detail-discount-badge">خصم ${discountPercent}%</span>` : ""}
          <button id="galleryPrev" class="gallery-arrow gallery-prev" type="button" aria-label="الصورة السابقة">‹</button>
          <button id="galleryNext" class="gallery-arrow gallery-next" type="button" aria-label="الصورة التالية">›</button>
        </div>
        <div class="detail-thumbs shein-thumbs">
          ${images.map((img, i) => `
            <button class="detail-thumb ${i === 0 ? "active" : ""}" data-index="${i}" type="button">
              <img src="${img}" alt="زاوية ${i + 1} من ${product.name}">
            </button>`).join("")}
        </div>
      </section>

      <section class="shein-product-info">
        <div class="product-price-block">
          <div class="price-line">
            <strong class="detail-price">${currentPrice.toFixed(2)} ₪</strong>
            ${hasDiscount ? `<span class="discount-pill">-${discountPercent}%</span><del class="original-price">${originalPrice.toFixed(2)} ₪</del>` : ""}
          </div>
          <span class="product-category">${MA_CATEGORY_NAMES[product.category] || "منتج"}</span>
        </div>

        <div class="product-title-block">
          <h1>${product.name}</h1>
          <p class="detail-description">${product.description || ""}</p>
          ${product.material ? `<p class="material-line"><strong>الخامة:</strong> ${product.material}</p>` : ""}
        </div>

        ${product.colors?.length ? `
          <div class="option-section shein-option-section">
            <div class="option-title-row"><h3>اللون: <span id="selectedColorText">${selectedColor}</span></h3></div>
            <div class="color-swatches shein-color-swatches">
              ${product.colors.map((c, i) => `
                <button class="color-swatch ${i === 0 ? "active" : ""}" data-color="${c.name}" style="--swatch:${c.hex || maColorHex(c.name)}" title="${c.name}" type="button">
                  <span class="sr-only">${c.name}</span>
                </button>`).join("")}
            </div>
          </div>` : ""}

        ${product.sizes?.length ? `
          <div class="option-section shein-option-section">
            <div class="option-title-row"><h3>المقاس</h3><span class="size-guide">اختاري المقاس المناسب</span></div>
            <div class="size-buttons shein-size-buttons">
              ${product.sizes.map((s, i) => `<button class="size-button ${i === 0 ? "active" : ""}" data-size="${s}" type="button">${s}</button>`).join("")}
            </div>
          </div>` : ""}

        <div class="desktop-detail-actions">
          <button id="detailWish" class="secondary-button detail-heart-button ${isWishlisted() ? "active" : ""}" type="button">${maHeartIcon(isWishlisted())}<span>${isWishlisted() ? "تمت إضافته للمفضلة" : "أحببته"}</span></button>
          <button id="detailCart" class="primary-button" type="button">إضافة إلى عربة التسوق</button>
        </div>
      </section>
    </article>`;

  stickyBar.hidden = false;

  const mainImage = document.getElementById("detailMainImage");
  const counter = document.getElementById("imageCounter");
  const detailWish = document.getElementById("detailWish");
  const stickyWish = document.getElementById("stickyWish");
  const detailCart = document.getElementById("detailCart");
  const stickyCart = document.getElementById("stickyCart");

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function showImage(index) {
    currentImageIndex = (index + images.length) % images.length;
    mainImage.src = images[currentImageIndex];
    counter.textContent = `${currentImageIndex + 1}/${images.length}`;
    root.querySelectorAll(".detail-thumb").forEach((thumb, i) => thumb.classList.toggle("active", i === currentImageIndex));
  }

  root.querySelectorAll(".detail-thumb").forEach((button) => {
    button.addEventListener("click", () => showImage(Number(button.dataset.index)));
  });
  document.getElementById("galleryPrev").addEventListener("click", () => showImage(currentImageIndex - 1));
  document.getElementById("galleryNext").addEventListener("click", () => showImage(currentImageIndex + 1));

  root.querySelectorAll(".color-swatch").forEach((button) => {
    button.addEventListener("click", () => {
      selectedColor = button.dataset.color;
      document.getElementById("selectedColorText").textContent = selectedColor;
      root.querySelectorAll(".color-swatch").forEach((x) => x.classList.remove("active"));
      button.classList.add("active");
    });
  });

  root.querySelectorAll(".size-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedSize = button.dataset.size;
      root.querySelectorAll(".size-button").forEach((x) => x.classList.remove("active"));
      button.classList.add("active");
    });
  });

  function updateWishButtons() {
    const active = isWishlisted();
    detailWish.innerHTML = `${maHeartIcon(active)}<span>${active ? "تمت إضافته للمفضلة" : "أحببته"}</span>`;
    detailWish.classList.toggle("active", active);
    stickyWish.innerHTML = maHeartIcon(active);
    stickyWish.classList.toggle("active", active);
  }

  function toggleWishlist() {
    const added = maAddToWishlist(product);
    updateWishButtons();
    showToast(added ? "تمت إضافة المنتج إلى المفضلة" : "تمت إزالة المنتج من المفضلة");
  }

  function addToCart() {
    if (product.sizes?.length && !selectedSize) return showToast("اختاري المقاس أولًا");
    if (product.colors?.length && !selectedColor) return showToast("اختاري اللون أولًا");
    maAddToCart(product, selectedSize, selectedColor);
    detailCart.textContent = "تمت الإضافة ✓";
    stickyCart.textContent = "تمت الإضافة إلى السلة ✓";
    showToast("تمت إضافة المنتج إلى عربة التسوق");
    setTimeout(() => {
      detailCart.textContent = "إضافة إلى عربة التسوق";
      stickyCart.textContent = "أضف إلى عربة التسوق";
    }, 1600);
  }

  detailWish.addEventListener("click", toggleWishlist);
  stickyWish.addEventListener("click", toggleWishlist);
  detailCart.addEventListener("click", addToCart);
  stickyCart.addEventListener("click", addToCart);
  updateWishButtons();

  const recommendations = products
    .filter((x) => x.id !== id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  document.getElementById("recommendedGrid").innerHTML = recommendations.map((x) => {
    const old = Number(x.originalPrice || 0);
    const now = Number(x.price || 0);
    const discounted = old > now;
    const percent = discounted ? Math.round(((old - now) / old) * 100) : 0;
    return `
      <article class="product-card recommendation-card">
        <div class="product-image-wrap">
          <a href="product.html?id=${encodeURIComponent(x.id)}"><img src="${x.image}" alt="${x.name}"></a>
          ${discounted ? `<span class="card-discount-badge">-${percent}%</span>` : ""}
          <button class="recommendation-cart" data-rec-cart="${x.id}" type="button" aria-label="إضافة ${x.name} للسلة">🛒</button>
        </div>
        <div class="product-content">
          <a href="product.html?id=${encodeURIComponent(x.id)}"><h2>${x.name}</h2></a>
          <div class="recommendation-price-row">
            <p class="product-price">${now.toFixed(2)} ₪</p>
            ${discounted ? `<del>${old.toFixed(2)} ₪</del>` : ""}
          </div>
        </div>
      </article>`;
  }).join("");

  document.getElementById("recommendedGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-rec-cart]");
    if (!button) return;
    const recProduct = products.find((x) => x.id === button.dataset.recCart);
    if (!recProduct) return;
    maAddToCart(recProduct, recProduct.sizes?.[0] || "", recProduct.colors?.[0]?.name || "");
    showToast("تمت إضافة المنتج المقترح إلى السلة");
  });
});
