// Chuyển tab active
function setTab(el, tabId) {
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
        btn.classList.remove('active');
    });

    el.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(function (content) {
        content.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
}
// Mở / thu gọn mô tả sản phẩm
// JS toggleDesc chuẩn
function toggleDesc() {
    var content = document.getElementById('descContent');
    var btn = document.getElementById('showMoreBtn');
    var arrow = document.getElementById('arrowImg');

    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        content.classList.add('expanded');
        btn.childNodes[0].textContent = 'Thu gọn ';
        arrow.style.transform = 'rotate(180deg)';  // xoay 180° để hướng xuống
    } else {
        content.classList.remove('expanded');
        content.classList.add('collapsed');
        btn.childNodes[0].textContent = 'Xem thêm ';
        arrow.style.transform = 'rotate(0deg)';    // trở về gốc
    }
}
function changeImage(thumb) {
    const mainImg = document.getElementById('main-product-image');
    const photoCount = document.querySelector('.photo-count');
    const thumbs = document.querySelectorAll('.thumb');

    mainImg.src = thumb.src;

    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');

    currentIndex = Array.from(thumbs).indexOf(thumb);

    if (photoCount) {
        photoCount.textContent = `${currentIndex + 1}/${thumbs.length}`;
    }
}
// Lấy tất cả thumbnail
const thumbnails = document.querySelectorAll('.thumb');
let currentIndex = 0;

// Click thumbnail
function changeImageByIndex(index) {
    const mainImg = document.getElementById('main-product-image');
    const photoCount = document.querySelector('.photo-count');

    mainImg.src = thumbnails[index].src;

    thumbnails.forEach(t => t.classList.remove('active'));
    thumbnails[index].classList.add('active');

    currentIndex = index;

    if (photoCount) {
        photoCount.textContent = `${currentIndex + 1}/${thumbnails.length}`;
    }
}
// Click mũi tên trái
function prevImage() {
    currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
    changeImageByIndex(currentIndex);
}

// Click mũi tên phải
function nextImage() {
    currentIndex = (currentIndex + 1) % thumbnails.length;
    changeImageByIndex(currentIndex);
}
// Hiện đầy đủ số điện thoại ở nút lớn
function showPhoneNumber(button) {
    button.innerHTML = `
        <img class="phone-btn-icon" src="images/goi.svg" alt="">
        <span>0908861234</span>
    `;
}
// Hiện đầy đủ số điện thoại trong phần mô tả
function showPhoneNumberMini(button) {
    const phoneBox = button.closest('.phone-mini');
    const phoneText = phoneBox.querySelector('.hidden-phone');

    phoneText.textContent = '0908867879';
    button.style.display = 'none';
}