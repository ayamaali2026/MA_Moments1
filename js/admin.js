"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  const list = document.getElementById("adminProductsList");
  const recent = document.getElementById("recentProducts");
  const input = document.getElementById("productImage");
  const preview = document.getElementById("imagePreview");
  const cancel = document.getElementById("cancelEdit");
  const categorySelect = document.getElementById("productCategory");
  const categoryFilter = document.getElementById("adminCategoryFilter");
  let imageData = [];

  const categoryOptions = Object.entries(MA_CATEGORY_NAMES).map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
  categorySelect.innerHTML = categoryOptions;
  categoryFilter.innerHTML += categoryOptions;

  function switchTab(name) {
    document.querySelectorAll(".admin-nav-button").forEach(b => b.classList.toggle("active", b.dataset.adminTab === name));
    document.querySelectorAll(".admin-tab-panel").forEach(p => p.classList.toggle("active", p.dataset.panel === name));
    const labels = {dashboard:"لوحة التحكم", products:"إدارة المنتجات", "add-product":document.getElementById("editingId").value?"تعديل المنتج":"إضافة منتج", backup:"النسخ الاحتياطي"};
    document.getElementById("adminPageTitle").textContent = labels[name] || "لوحة التحكم";
    window.scrollTo({top:0,behavior:"smooth"});
  }

  document.querySelectorAll("[data-admin-tab]").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.adminTab)));
  document.querySelectorAll("[data-go-products]").forEach(b => b.addEventListener("click", () => switchTab("products")));
  document.getElementById("quickAddProduct").addEventListener("click", () => { reset(); switchTab("add-product"); });

  function readFile(file) { return new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = reject; r.readAsDataURL(file); }); }
  input.addEventListener("change", async () => { imageData.push(...await Promise.all([...input.files].map(readFile))); input.value=""; showImages(); });

  function showImages() {
    preview.innerHTML = imageData.map((src,index)=>`<div class="admin-preview-item"><div class="admin-preview-image-wrap"><img src="${src}" alt="صورة المنتج ${index+1}"><button class="admin-remove-image" type="button" data-remove-image="${index}" aria-label="حذف الصورة">×</button></div><span>${index===0?"الصورة الرئيسية":`صورة ${index+1}`}</span>${index>0?`<button class="admin-make-main" type="button" data-make-main="${index}">اجعليها رئيسية</button>`:""}</div>`).join("");
  }
  preview.addEventListener("click", e => { const remove=e.target.closest("[data-remove-image]"); if(remove){imageData.splice(Number(remove.dataset.removeImage),1);showImages();return;} const main=e.target.closest("[data-make-main]"); if(main){const [selected]=imageData.splice(Number(main.dataset.makeMain),1);imageData.unshift(selected);showImages();} });

  const splitList = value => value.split(/[،,]/).map(v=>v.trim()).filter(Boolean);
  const selectedSizes = () => [...document.querySelectorAll('input[name="sizes"]:checked')].map(x=>x.value);
  const parseColors = () => splitList(document.getElementById("productColors").value).map(value=>{const [name,hex]=value.split(":").map(x=>x.trim());return{name,hex:hex||maColorHex(name)}});

  function reset() {
    form.reset(); imageData=[]; showImages(); document.getElementById("editingId").value="";
    document.getElementById("formTitle").textContent="إضافة منتج جديد"; document.getElementById("saveButton").textContent="حفظ المنتج"; cancel.hidden=true;
  }

  function stats(products) {
    document.getElementById("statProducts").textContent = products.length;
    document.getElementById("statActive").textContent = products.filter(p=>(p.status||"active")==="active").length;
    document.getElementById("statFeatured").textContent = products.filter(p=>p.featured).length;
    document.getElementById("statStock").textContent = products.reduce((s,p)=>s+Number(p.stock||0),0);
  }

  function row(product, compact=false) {
    const status=(product.status||"active")==="active";
    return `<article class="admin-product-row ${compact?"compact-row":""}" data-id="${product.id}"><img src="${product.image}" alt="${product.name}"><div class="admin-product-main"><strong>${product.name}</strong><span>${Number(product.price).toFixed(2)} ₪</span><small>${MA_CATEGORY_NAMES[product.category]||product.category} • ${product.images?.length||1} صورة • مخزون ${Number(product.stock||0)}</small></div><div class="admin-product-badges"><span class="status-badge ${status?"active":"draft"}">${status?"نشط":"مسودة"}</span>${product.featured?'<span class="featured-badge">مميز</span>':''}</div>${compact?"":`<div class="admin-row-actions"><a href="product.html?id=${encodeURIComponent(product.id)}" target="_blank">معاينة</a><button data-edit type="button">تعديل</button><button data-toggle type="button">${status?"إيقاف":"تفعيل"}</button><button data-delete class="danger-link" type="button">حذف</button></div>`}</article>`;
  }

  function render() {
    const products=maGetProducts(); stats(products);
    const q=maNormalize(document.getElementById("adminProductSearch")?.value||"");
    const cat=categoryFilter?.value||"";
    const filtered=products.filter(p=>(!cat||p.category===cat)&&(!q||maNormalize(`${p.name} ${MA_CATEGORY_NAMES[p.category]||""} ${p.sku||""}`).includes(q)));
    list.innerHTML=filtered.length?filtered.sort((a,b)=>b.createdAt-a.createdAt).map(p=>row(p)).join(""):'<div class="no-results"><h3>لا توجد منتجات مطابقة</h3></div>';
    recent.innerHTML=products.sort((a,b)=>b.createdAt-a.createdAt).slice(0,5).map(p=>row(p,true)).join("");
  }

  form.addEventListener("submit", e => {
    e.preventDefault(); const colors=parseColors(); const id=document.getElementById("editingId").value; const products=maGetProducts(); const old=products.find(p=>p.id===id);
    if(!colors.length)return alert("أضيفي لونًا واحدًا على الأقل"); if(!imageData.length)return alert("اختاري صورة واحدة على الأقل");
    const product={id:id||`product-${Date.now()}`,name:document.getElementById("productName").value.trim(),sku:document.getElementById("productSku").value.trim(),category:categorySelect.value,status:document.getElementById("productStatus").value,price:Number(document.getElementById("productPrice").value),originalPrice:Number(document.getElementById("productOriginalPrice").value)||0,stock:Number(document.getElementById("productStock").value)||0,material:document.getElementById("productMaterial").value.trim(),description:document.getElementById("productDescription").value.trim(),sizes:selectedSizes(),colors,images:[...imageData],image:imageData[0],tags:splitList(document.getElementById("productTags").value),similarTo:splitList(document.getElementById("productSimilarTo").value),featured:document.getElementById("productFeatured").checked,showOnHomepage:document.getElementById("productHomepage").checked,createdAt:old?.createdAt||Date.now(),updatedAt:Date.now()};
    const i=products.findIndex(p=>p.id===product.id); if(i>=0)products[i]=product;else products.push(product); maSaveProducts(products); reset(); render(); switchTab("products"); alert(i>=0?"تم حفظ التعديلات":"تمت إضافة المنتج");
  });

  list.addEventListener("click", e => {
    const rowEl=e.target.closest(".admin-product-row"); if(!rowEl)return; const products=maGetProducts(); const product=products.find(p=>p.id===rowEl.dataset.id); if(!product)return;
    if(e.target.matches("[data-delete]")){if(confirm("هل تريدين حذف المنتج نهائيًا؟")){maSaveProducts(products.filter(p=>p.id!==product.id));render();}return;}
    if(e.target.matches("[data-toggle]")){product.status=(product.status||"active")==="active"?"draft":"active";maSaveProducts(products);render();return;}
    if(e.target.matches("[data-edit]")){
      document.getElementById("editingId").value=product.id; document.getElementById("productName").value=product.name; document.getElementById("productSku").value=product.sku||""; categorySelect.value=product.category; document.getElementById("productStatus").value=product.status||"active"; document.getElementById("productPrice").value=product.price; document.getElementById("productOriginalPrice").value=product.originalPrice||""; document.getElementById("productStock").value=product.stock||0; document.getElementById("productMaterial").value=product.material||""; document.getElementById("productDescription").value=product.description||""; document.getElementById("productTags").value=(product.tags||[]).join("، "); document.getElementById("productSimilarTo").value=(product.similarTo||[]).join("، "); document.getElementById("productColors").value=(product.colors||[]).map(c=>`${c.name}:${c.hex}`).join("، "); document.getElementById("productFeatured").checked=!!product.featured; document.getElementById("productHomepage").checked=!!product.showOnHomepage; document.querySelectorAll('input[name="sizes"]').forEach(c=>c.checked=(product.sizes||[]).includes(c.value)); imageData=[...(product.images||[product.image])]; showImages(); document.getElementById("formTitle").textContent="تعديل المنتج"; document.getElementById("saveButton").textContent="حفظ التعديلات"; cancel.hidden=false; switchTab("add-product");
    }
  });
  cancel.addEventListener("click",()=>{reset();switchTab("products")});
  document.getElementById("adminProductSearch").addEventListener("input",render); categoryFilter.addEventListener("change",render);

  document.getElementById("exportProducts").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(maGetProducts(),null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`ma-moments-products-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);});
  document.getElementById("importProducts").addEventListener("change",async e=>{try{const data=JSON.parse(await e.target.files[0].text());if(!Array.isArray(data))throw new Error();maSaveProducts(data);render();alert("تم استيراد البيانات");}catch(_){alert("ملف غير صالح");}e.target.value="";});
  document.getElementById("resetProducts").addEventListener("click",()=>{if(confirm("سيتم حذف تعديلاتك واستعادة المنتجات الافتراضية، هل أنتِ متأكدة؟")){maSaveProducts(MA_DEFAULT_PRODUCTS);render();}});
  render();
});
