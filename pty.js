document.addEventListener("DOMContentLoaded", function () {
    /* ================= HIỆN SỐ ĐIỆN THOẠI ================= */
    const phoneButtons = document.querySelectorAll(".btn-phone");

    phoneButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const full = btn.dataset.fullPhone || "0356191234";

            if (btn.textContent.includes("xxx")) {
                btn.innerHTML = `<img src="images/seller_phone.svg" alt=""> ${full}`;
            } else {
                btn.innerHTML = `<img src="images/seller_phone.svg" alt=""> Hiện số ${full.slice(0, 6)}xxx`;
            }
        });
    });

    /* ================= CLICK THUMBNAIL ĐỔI ẢNH CHÍNH ================= */
    const mainGalleryImage = document.getElementById("mainGalleryImage");
    const thumbs = document.querySelectorAll(".thumb");

    thumbs.forEach(function (thumb) {
        thumb.addEventListener("click", function () {
            thumbs.forEach(function (item) {
                item.classList.remove("active");
            });

            thumb.classList.add("active");

            const img = thumb.querySelector("img");
            if (img && mainGalleryImage) {
                mainGalleryImage.src = img.src;
            }
        });
    });

    /* ================= TRƯỢT ĐẶC ĐIỂM BẤT ĐỘNG SẢN ================= */
    const featureGrid = document.getElementById("featureGrid");
    const featurePrev = document.getElementById("featurePrev");
    const featureNext = document.getElementById("featureNext");

    if (featureGrid && featurePrev && featureNext) {
        featureNext.addEventListener("click", function () {
            featureGrid.scrollLeft += 260;
        });

        featurePrev.addEventListener("click", function () {
            featureGrid.scrollLeft -= 260;
        });
    }

    /* ================= XEM TẤT CẢ TÍNH NĂNG ================= */
    const viewAllBtn = document.querySelector(".view-all-btn");
    const houseInfoModal = document.getElementById("houseInfoModal");
    const closeHouseInfoModal = document.getElementById("closeHouseInfoModal");

    if (viewAllBtn && houseInfoModal) {
        viewAllBtn.addEventListener("click", function () {
            houseInfoModal.classList.add("active");
        });
    }

    if (closeHouseInfoModal && houseInfoModal) {
        closeHouseInfoModal.addEventListener("click", function () {
            houseInfoModal.classList.remove("active");
        });
    }

    if (houseInfoModal) {
        houseInfoModal.addEventListener("click", function (e) {
            if (e.target === houseInfoModal) {
                houseInfoModal.classList.remove("active");
            }
        });
    }

    /* ================= XEM THÊM MÔ TẢ ================= */
    const seeMoreBtn = document.querySelector(".see-more");
    const descriptionBox = document.querySelector(".description");

    if (seeMoreBtn && descriptionBox) {
        let expanded = false;

        descriptionBox.style.maxHeight = "150px";
        descriptionBox.style.overflow = "hidden";

        seeMoreBtn.addEventListener("click", function () {
            expanded = !expanded;

            if (expanded) {
                descriptionBox.style.maxHeight = "none";
                seeMoreBtn.childNodes[0].textContent = "Thu gọn ";
            } else {
                descriptionBox.style.maxHeight = "150px";
                seeMoreBtn.childNodes[0].textContent = "Xem thêm ";
            }
        });
    }

    /* ================= TÍNH TOÁN TRẢ GÓP ================= */
    const ASSET_PRICE = 5400000000;

    const inputLoan = document.getElementById("inputLoan");
    const inputLoanRate = document.getElementById("inputLoanRate");
    const inputTerm = document.getElementById("inputTerm");
    const inputRate = document.getElementById("inputRate");

    const resDownPayment = document.getElementById("resDownPayment");
    const resPrincipal = document.getElementById("resPrincipal");
    const resInterest = document.getElementById("resInterest");
    const resMonthly = document.getElementById("resMonthly");
    const resTotal = document.getElementById("resTotal");

    const monthlyPreviews = document.querySelectorAll("[data-monthly-preview]");
    const cashPreviews = document.querySelectorAll("[data-cash-preview]");

    function toNumber(value) {
        return Number(String(value).replace(/\D/g, "")) || 0;
    }

    function formatMoney(number) {
        return Math.round(number).toLocaleString("vi-VN") + "đ";
    }

    function calculatePayment() {
        if (!inputLoan || !inputTerm || !inputRate) return;

        const loanAmount = toNumber(inputLoan.value);
        const years = toNumber(inputTerm.value);
        const annualRate = Number(String(inputRate.value).replace("%", "")) || 0;

        const months = years * 12;
        const monthlyRate = annualRate / 100 / 12;

        let monthlyPayment = 0;

        if (monthlyRate > 0 && months > 0) {
            monthlyPayment =
                loanAmount *
                monthlyRate *
                Math.pow(1 + monthlyRate, months) /
                (Math.pow(1 + monthlyRate, months) - 1);
        }

        const totalPayment = monthlyPayment * months;
        const interest = totalPayment - loanAmount;
        const downPayment = ASSET_PRICE - loanAmount;
        const total = downPayment + loanAmount + interest;

        if (resDownPayment) resDownPayment.textContent = formatMoney(downPayment);
        if (resPrincipal) resPrincipal.textContent = formatMoney(loanAmount);
        if (resInterest) resInterest.textContent = formatMoney(interest);
        if (resMonthly) resMonthly.textContent = formatMoney(monthlyPayment);
        if (resTotal) resTotal.textContent = formatMoney(total);

        monthlyPreviews.forEach(function (item) {
            item.textContent = Math.round(monthlyPayment).toLocaleString("vi-VN");
        });

        cashPreviews.forEach(function (item) {
            item.textContent = ASSET_PRICE.toLocaleString("vi-VN");
        });
    }

    [inputLoan, inputLoanRate, inputTerm, inputRate].forEach(function (input) {
        if (input) {
            input.addEventListener("input", calculatePayment);
        }
    });

    calculatePayment();

    /* ================= TAB TRẢ GÓP / THANH TOÁN NGAY ================= */
    const paymentTabs = document.querySelectorAll(".payment-tab");
    const installmentContent = document.getElementById("installmentContent");
    const fullpayContent = document.getElementById("fullpayContent");

    function switchPaymentTab(mode) {
        paymentTabs.forEach(function (tab) {
            if (tab.dataset.paymentTab === mode) {
                tab.classList.add("active");

                const radio = tab.querySelector("input");
                if (radio) radio.checked = true;
            } else {
                tab.classList.remove("active");
            }
        });

        if (mode === "installment") {
            if (installmentContent) installmentContent.style.display = "grid";
            if (fullpayContent) fullpayContent.classList.remove("active");
        } else {
            if (installmentContent) installmentContent.style.display = "none";
            if (fullpayContent) fullpayContent.classList.add("active");
        }
    }

    paymentTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            switchPaymentTab(tab.dataset.paymentTab);
        });
    });

    switchPaymentTab("installment");

    /* ================= MODAL CHI TIẾT LÃI VAY ================= */
    const interestDetail = document.querySelector(".interest-detail");
    const loanModal = document.getElementById("loanModal");
    const loanModalClose = document.getElementById("loanModalClose");
    const loanModalOverlay = document.getElementById("loanModalOverlay");
    const loanDetailBody = document.getElementById("loanDetailBody");

    function renderLoanTable() {
        if (!loanDetailBody || !inputLoan || !inputTerm || !inputRate) return;

        loanDetailBody.innerHTML = "";

        const loanAmount = toNumber(inputLoan.value);
        const years = toNumber(inputTerm.value);
        const annualRate = Number(String(inputRate.value).replace("%", "")) || 0;

        const months = years * 12;
        const monthlyPrincipal = loanAmount / months;
        let remaining = loanAmount;

        for (let i = 1; i <= months; i++) {
            const interest = remaining * annualRate / 100 / 12;
            const total = monthlyPrincipal + interest;

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${i}</td>
                <td>${formatMoney(remaining)}</td>
                <td>${formatMoney(monthlyPrincipal)}</td>
                <td>${formatMoney(interest)}</td>
                <td>${formatMoney(total)}</td>
            `;

            loanDetailBody.appendChild(row);
            remaining -= monthlyPrincipal;
        }
    }

    if (interestDetail && loanModal) {
        interestDetail.addEventListener("click", function () {
            renderLoanTable();
            loanModal.classList.add("active");
        });
    }

    function closeLoanModal() {
        if (loanModal) loanModal.classList.remove("active");
    }

    if (loanModalClose) loanModalClose.addEventListener("click", closeLoanModal);
    if (loanModalOverlay) loanModalOverlay.addEventListener("click", closeLoanModal);

    /* ================= MODAL GỬI YÊU CẦU ================= */
    const requestBtns = document.querySelectorAll("[data-request-mode]");
    const requestModal = document.getElementById("requestModal");
    const requestModalOverlay = document.getElementById("requestModalOverlay");
    const requestCancelBtn = document.getElementById("requestCancelBtn");
    const requestForm = document.getElementById("requestForm");

    const requestHighlightTitle = document.getElementById("requestHighlightTitle");
    const requestHighlightPrice = document.getElementById("requestHighlightPrice");
    const requestHighlightUnit = document.getElementById("requestHighlightUnit");
    const requestHighlightNote = document.getElementById("requestHighlightNote");
    const requestFormTitle = document.getElementById("requestFormTitle");

    requestBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const mode = btn.dataset.requestMode || "installment";

            if (!requestModal) return;

            requestModal.dataset.mode = mode;

            if (mode === "fullpay") {
                if (requestHighlightTitle) requestHighlightTitle.textContent = "Thanh toán ngay";
                if (requestHighlightPrice) requestHighlightPrice.textContent = "5.400.000.000đ";
                if (requestHighlightUnit) requestHighlightUnit.textContent = "";
                if (requestHighlightNote) requestHighlightNote.textContent = "Đặt cọc dự kiến 10%";
                if (requestFormTitle) requestFormTitle.textContent = "Đăng ký tư vấn thanh toán";
            } else {
                if (requestHighlightTitle) requestHighlightTitle.textContent = "Ước tính trả góp";
                if (requestHighlightPrice && resMonthly) requestHighlightPrice.textContent = resMonthly.textContent;
                if (requestHighlightUnit) requestHighlightUnit.textContent = "/tháng";
                if (requestHighlightNote) requestHighlightNote.textContent = "Lãi suất 7.5%/năm - 20 năm";
                if (requestFormTitle) requestFormTitle.textContent = "Đăng ký tư vấn trả góp";
            }

            requestModal.classList.add("active");
        });
    });

    function closeRequestModal() {
        if (requestModal) requestModal.classList.remove("active");
    }

    if (requestCancelBtn) requestCancelBtn.addEventListener("click", closeRequestModal);
    if (requestModalOverlay) requestModalOverlay.addEventListener("click", closeRequestModal);

    /* ================= MỞ / ĐÓNG CHI TIẾT KHOẢN VAY TRONG FORM ================= */
    const requestDetailToggle = document.getElementById("requestDetailToggle");
    const requestDetailBox = document.getElementById("requestDetailBox");

    if (requestDetailToggle && requestDetailBox) {
        requestDetailToggle.addEventListener("click", function () {
            requestDetailBox.classList.toggle("is-open");
        });
    }

    /* ================= CHỌN NGÀY GIỜ ================= */
    const requestCalendarBtn = document.getElementById("requestCalendarBtn");
    const requestTime = document.getElementById("requestTime");

    if (requestCalendarBtn && requestTime) {
        requestCalendarBtn.addEventListener("click", function () {
            requestTime.showPicker();
        });
    }

    /* ================= SUBMIT FORM GỬI YÊU CẦU ================= */
    const successModal = document.getElementById("successModal");
    const successClose = document.getElementById("successClose");
    const successModalOverlay = document.getElementById("successModalOverlay");

    const requestName = document.getElementById("requestName");
    const requestPhone = document.getElementById("requestPhone");
    const requestNameError = document.getElementById("requestNameError");
    const requestPhoneError = document.getElementById("requestPhoneError");
    const requestTimeError = document.getElementById("requestTimeError");

    if (requestForm) {
        requestForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let valid = true;

            if (requestNameError) requestNameError.textContent = "";
            if (requestPhoneError) requestPhoneError.textContent = "";
            if (requestTimeError) requestTimeError.textContent = "";

            if (!requestName || requestName.value.trim() === "") {
                if (requestNameError) requestNameError.textContent = "Vui lòng nhập họ và tên";
                valid = false;
            }

            if (!requestPhone || requestPhone.value.trim() === "") {
                if (requestPhoneError) requestPhoneError.textContent = "Vui lòng nhập số điện thoại";
                valid = false;
            }

            if (!requestTime || requestTime.value.trim() === "") {
                if (requestTimeError) requestTimeError.textContent = "Vui lòng chọn thời gian xem nhà";
                valid = false;
            }

            if (!valid) return;

            closeRequestModal();

            if (successModal) {
                successModal.classList.add("active");
            }

            requestForm.reset();
        });
    }

    function closeSuccessModal() {
        if (successModal) successModal.classList.remove("active");
    }

    if (successClose) successClose.addEventListener("click", closeSuccessModal);
    if (successModalOverlay) successModalOverlay.addEventListener("click", closeSuccessModal);

    /* ================= STICKY BAR KHI SCROLL ================= */
    const stickyBar = document.getElementById("stickyBar");

    window.addEventListener("scroll", function () {
        if (!stickyBar) return;

        if (window.scrollY > 500) {
            stickyBar.classList.add("is-visible");
        } else {
            stickyBar.classList.remove("is-visible");
        }
    });

    /* ================= ACTIVE TAB TRÊN STICKY ================= */
    const stickyTabs = document.querySelectorAll(".sticky-tab");

    stickyTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            stickyTabs.forEach(function (item) {
                item.classList.remove("active");
            });

            tab.classList.add("active");
        });
    });
});