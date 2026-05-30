document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("chat-send-btn");
    const chatMessages = document.getElementById("chat-messages");
    const track = document.getElementById("quick-replies-track");
    const chatList = document.getElementById("chat-list");

    // 1. Dữ liệu xe riêng của từng người
    const allSellerData = {
        "cuong": {
            name: "Mazda 3 Premium 2023 Màu Đỏ Chính Chủ",
            price: "650.000.000 đ",
            img: "images/tindang/2.jpg" 
        },
        "letuan": {
            name: "Toyota Innova Cross Hybrid 2024 25100 km xanh Đen",
            price: "979.000.000 đ",
            img: "images/gallery/anh1.svg"
        }
    };

    // Biến lưu người đang chat hiện tại (mặc định là Lê Tuấn)
    let currentSellerId = "letuan";

// 1. Chuyển đổi giữa các người chat
    chatList.addEventListener("click", (e) => {
        const clickedItem = e.target.closest(".chat-item");
        if (clickedItem) {
            currentSellerId = clickedItem.getAttribute("data-id");

            document.querySelectorAll(".chat-item").forEach(item => item.classList.remove("active"));
            clickedItem.classList.add("active");

            chatMessages.innerHTML = ""; 

            const name = clickedItem.querySelector(".chat-item-name").innerText;
            document.querySelector(".chat-conv-name").innerText = name;
            document.querySelector(".chat-info-name").innerText = name;

            const car = allSellerData[currentSellerId];

            // --- THÊM 3 DÒNG NÀY ĐỂ CẬP NHẬT THANH TIN ĐĂNG Ở GIỮA ---
            document.querySelector(".chat-listing-card img").src = car.img;
            document.querySelector(".chat-listing-title").innerText = car.name;
            document.querySelector(".chat-listing-price").innerText = car.price;
            // -------------------------------------------------------

            // Cập nhật thông tin xe ở cột phải (Info Panel)
            document.querySelector(".listing-title").innerText = car.name;
            document.querySelector(".listing-price").innerText = car.price;
            document.querySelector(".listing-img").src = car.img;
        }
    });

    // 2. Cập nhật Sidebar
    function updateSidebar(text, isMe = false) {
        const activeItem = document.querySelector(".chat-item.active");
        if (activeItem) {
            const preview = activeItem.querySelector(".chat-item-preview");
            const time = activeItem.querySelector(".chat-item-time");
            if (preview) preview.innerText = isMe ? "Bạn: " + text : text;
            if (time) time.innerText = "Vừa xong";
            chatList.prepend(activeItem);
        }
    }

    // 3. Hàm gửi tin nhắn (Đã xóa đoạn code lặp)
    function sendMessage(text) {
        if (!text.trim()) return;
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const currentCar = allSellerData[currentSellerId];
        const existingMessages = chatMessages.querySelectorAll(".chat-msg-row");
        let msgHTML = "";

        if (existingMessages.length === 0) {
            // Tin đầu tiên kèm khung xe
            msgHTML = `
                <div class="chat-msg-row outgoing">
                    <div class="chat-msg-wrapper">
                        <div class="chat-bubble outgoing">
                            <div class="chat-msg-product-ref">
                                <img src="${currentCar.img}">
                                <div class="ref-details">
                                    <p class="ref-title">${currentCar.name}</p>
                                    <p class="ref-price">${currentCar.price}</p>
                                </div>
                            </div>
                            <div class="chat-text">${text}</div>
                        </div>
                        <span class="chat-msg-time-outside">${timeStr}</span>
                    </div>
                </div>`;
        } else {
            // Tin nhắn thường
            msgHTML = `
                <div class="chat-msg-row outgoing">
                    <div class="chat-msg-wrapper">
                        <div class="chat-bubble outgoing"><div class="chat-text">${text}</div></div>
                        <div class="chat-msg-meta-outside">
                            <span class="chat-msg-time">${timeStr}</span>
                            <span class="chat-msg-read pending-status">
                                | Đã gửi <img src="images/chat/tick.png" class="read-icon">
                            </span>
                        </div>
                    </div>
                </div>`;
        }

        chatMessages.insertAdjacentHTML('beforeend', msgHTML);
        updateSidebar(text, true); 
        chatInput.value = "";
        sendBtn.style.display = "none";
        scrollToBottom();

        // Trả lời tự động
        setTimeout(() => {
            updateStatusToRead();
            const reply = autoReplies[text] || "Dạ mình đã nhận được thông tin, bạn đợi mình xíu nhé!";
            sellerReply(reply);
        }, 1000);
    }

    // 4. Hàm người bán trả lời
    function sellerReply(text) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const replyHTML = `
            <div class="chat-msg-row incoming">
                <div class="chat-msg-bubble-wrap">
                    <div class="chat-bubble incoming">
                        ${text}
                        <div class="selected-reaction-pill"></div>
                    </div>
                    <button class="reaction-trigger-btn"><img src="images/chat/like-outline.png"></button>
                    <div class="reaction-popup">
                        <span class="emoji" data-emoji="❤️">❤️</span>
                        <span class="emoji" data-emoji="😆">😆</span>
                        <span class="emoji" data-emoji="😮">😮</span>
                        <span class="emoji" data-emoji="😢">😢</span>
                        <span class="emoji" data-emoji="😡">😡</span>
                        <span class="emoji" data-emoji="👍">👍</span>
                    </div>
                    <span class="chat-msg-time">${timeStr}</span>
                </div>
            </div>`;
        chatMessages.insertAdjacentHTML('beforeend', replyHTML);
        updateSidebar(text, false);
        scrollToBottom();
    }

    function updateStatusToRead() {
        document.querySelectorAll(".pending-status").forEach(status => {
            status.innerHTML = `| Đã đọc <img src="images/chat/tick.png" class="read-icon">`;
            status.classList.remove("pending-status");
        });
    }

    // 5. Sự kiện Click Emoji & Quick Replies
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("selected-reaction-pill")) {
            e.target.style.display = "none";
            e.target.innerText = "";
            return;
        }

        if (e.target.classList.contains("emoji")) {
            const parent = e.target.closest(".chat-msg-bubble-wrap");
            const pill = parent.querySelector(".selected-reaction-pill");
            pill.innerText = e.target.dataset.emoji;
            pill.style.display = "flex";
            e.target.parentElement.classList.remove("active");
        }

        if (e.target.classList.contains("quick-reply-btn")) {
            sendMessage(e.target.innerText);
        }
    });

    function scrollToBottom() { chatMessages.scrollTop = chatMessages.scrollHeight; }

    sendBtn.addEventListener("click", () => sendMessage(chatInput.value));
    chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(chatInput.value); });
    chatInput.addEventListener("input", () => {
        sendBtn.style.display = chatInput.value.trim() ? "flex" : "none";
    });

    const nextBtn = document.getElementById("qr-next");
    const prevBtn = document.getElementById("qr-prev");
    if (nextBtn && prevBtn && track) {
        nextBtn.addEventListener("click", () => track.scrollBy({ left: 250, behavior: 'smooth' }));
        prevBtn.addEventListener("click", () => track.scrollBy({ left: -250, behavior: 'smooth' }));
    }

    scrollToBottom();
});