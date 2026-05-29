document.addEventListener('DOMContentLoaded', () => {

  // --- Hiện số điện thoại ---
  const phoneBtn = document.querySelector('.btn-phone');
  if (phoneBtn) {
    phoneBtn.addEventListener('click', () => {
      const full = phoneBtn.dataset.fullPhone;
      if (phoneBtn.textContent.includes('xxx')) {
        phoneBtn.innerHTML = `<img src="images/seller_phone.svg" alt=""> ${full}`;
      } else {
        phoneBtn.innerHTML = `<img src="images/seller_phone.svg" alt=""> Hiện số ${full.slice(0,3)}xxx`;
      }
    });
  }

  // --- Gallery thumbnail ---
  const mainPhoto = document.querySelector('.main-photo img');
  const thumbs = document.querySelectorAll('.thumb');
  const photoCount = document.querySelector('.photo-count');

  if(thumbs.length > 0 && mainPhoto) {
    // Hiển thị ảnh đầu tiên khi load
    const firstImg = thumbs[0].querySelector('img');
    if(firstImg) mainPhoto.src = firstImg.src;

    // Highlight thumbnail đầu tiên
    thumbs[0].classList.add('active');

    // Hiển thị số lượng ảnh
    if(photoCount) photoCount.textContent = `1/${thumbs.length}`;
  }

  thumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      // Bỏ active các thumb khác
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      // Cập nhật main photo
      const imgEl = thumb.querySelector('img');
      if(imgEl && mainPhoto) mainPhoto.src = imgEl.src;

      // Cập nhật số ảnh góc phải
      if(photoCount) photoCount.textContent = `${idx + 1}/${thumbs.length}`;
    });
  });

  // --- Deal giá input placeholder ---
  const offerInput = document.getElementById('offer-input-field');
  if (offerInput) {
    const placeholderSpan = offerInput.nextElementSibling;
    offerInput.addEventListener('focus', () => {
      if (placeholderSpan) placeholderSpan.style.display = 'none';
    });
    offerInput.addEventListener('blur', () => {
      if (placeholderSpan && offerInput.value === '') placeholderSpan.style.display = 'inline';
    });
  }

  // --- Tabs lọc sản phẩm ---
  const tabs = document.querySelectorAll('.tab-btn');
  const cunghangGrid = document.querySelector('.cunghang-grid');

  const allCards = [...cunghangGrid.children].map(c => c.cloneNode(true));

  function parsePrice(card) {
    const priceText = card.querySelector('strong')?.textContent.replace(/\D/g,'');
    return priceText ? parseInt(priceText) : 0;
  }

  function parseTime(card) {
    const span = card.querySelector('.seller-overlay span');
    if(!span) return Infinity;
    const timeText = span.textContent.trim();
    if(timeText.includes('giờ')) return parseInt(timeText)*60;
    if(timeText.includes('ngày')) return parseInt(timeText)*1440;
    return Infinity;
  }

  function setTab(el) {
    tabs.forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const tabName = el.textContent.trim();

    while(cunghangGrid.firstChild) cunghangGrid.removeChild(cunghangGrid.firstChild);

    let filtered = [];

    switch(tabName) {
      case "Cùng hàng":
        filtered = allCards;
        break;
      case "Giá tốt hơn":
        filtered = allCards.filter(c => parsePrice(c) < 8000000);
        break;
      case "Gần bạn":
        filtered = allCards;
        break;
      case "Còn bảo hành":
        filtered = allCards.filter(c => {
          const text = (c.querySelector('h3')?.textContent || '') + ' ' + (c.querySelector('.listing-meta')?.textContent || '');
          return text.includes('Còn bảo hành') || c.dataset.warranty === "true";
        });
        break;
      case "Tin mới nhất":
        filtered = allCards.slice().sort((a,b) => parseTime(a) - parseTime(b));
        break;
    }

    filtered.forEach(card => cunghangGrid.appendChild(card));
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => setTab(tab));
  });

  // --- Xem thêm mô tả ---
  const showMoreBtn = document.getElementById('showMoreBtn');
  if(showMoreBtn) showMoreBtn.addEventListener('click', () => {
    const desc = document.getElementById('descContent');
    if(desc.classList.contains('collapsed')) {
      desc.classList.remove('collapsed'); 
      desc.classList.add('expanded');
      showMoreBtn.childNodes[0].textContent = 'Thu gọn ';
    } else {
      desc.classList.remove('expanded'); 
      desc.classList.add('collapsed');
      showMoreBtn.childNodes[0].textContent = 'Xem thêm ';
    }
  });

});