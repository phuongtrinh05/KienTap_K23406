document.addEventListener('DOMContentLoaded', () => {

  // Hiện số điện thoại
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

  // Click thumbnail ảnh
  const mainPhoto = document.querySelector('.main-photo img');
  const thumbs = document.querySelectorAll('.thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const imgEl = thumb.querySelector('img');
      if(imgEl && mainPhoto) mainPhoto.src = imgEl.src;
    });
  });

  // Deal giá input
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

  // Tabs lọc sản phẩm
  const tabs = document.querySelectorAll('.tab-btn');
  const cunghangGrid = document.querySelector('.cunghang-grid');

  // Clone tất cả card làm nguồn
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
        filtered = allCards; // nếu muốn, lọc theo location trong h3 hoặc .listing-location
        break;

      case "Còn bảo hành":
        filtered = allCards.filter(c => {
          // Tìm trong h3, listing-meta hoặc data-warranty
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

  // Xem thêm mô tả
  const showMoreBtn = document.getElementById('showMoreBtn');
  if(showMoreBtn) showMoreBtn.addEventListener('click', () => {
    const desc = document.getElementById('descContent');
    const arrow = document.getElementById('arrowImg');
    if(desc.classList.contains('collapsed')) {
      desc.classList.remove('collapsed'); desc.classList.add('expanded');
      showMoreBtn.childNodes[0].textContent = 'Thu gọn ';
      arrow.style.transform = 'rotate(270deg)';
    } else {
      desc.classList.remove('expanded'); desc.classList.add('collapsed');
      showMoreBtn.childNodes[0].textContent = 'Xem thêm ';
      arrow.style.transform = 'rotate(90deg)';
    }
  });

});