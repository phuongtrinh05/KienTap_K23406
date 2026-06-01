document.addEventListener("DOMContentLoaded", function () {
    const headerChatBtn = document.querySelector('.contact-header');
    const stickyChatBtn = document.querySelector('.sticky-chat-btn');
    const sellerChatBtn = document.getElementById('seller-chat-btn');

    const goToChat = () => {
        window.location.href = 'chat_index.html?seller=letuan';
    };

    if (headerChatBtn) headerChatBtn.addEventListener('click', goToChat);
    if (stickyChatBtn) stickyChatBtn.addEventListener('click', goToChat);
    if (sellerChatBtn) sellerChatBtn.addEventListener('click', goToChat);
    
    const range = document.getElementById("down-payment-range");
    const bubble = document.querySelector(".range-percent .bubble-frame");
    const bubbleWrap = bubble.parentElement;

    const carPriceInput = document.getElementById("car-price");
    const loanAmountInput = document.getElementById("down-payment");
    const loanTermInput = document.getElementById("loan-term");
    const interestRateInput = document.getElementById("interest-rate");
    const paymentTabs = document.querySelectorAll("[data-payment-tab]");
    const installmentFields = document.getElementById("installment-fields");
    const loanAmountLabel = document.getElementById("loan-amount-label");

    let paymentMode = "installment";
    const loanTypeInput = document.getElementById("loan-type");
    const monthlyPaymentLabelEl = document.getElementById("monthly-payment-label");
    const monthlyPaymentEl = document.getElementById("monthly-payment");
    const totalInterestEl = document.getElementById("total-interest");
    const interestDetailLink = document.getElementById("interest-detail-link");
    const totalPaymentEl = document.getElementById("total-payment");
    const sideInstallmentCheck = document.getElementById("side-installment-check");
    const sideCashCheck = document.getElementById("side-cash-check");
    const sideInstallmentPrice = document.getElementById("side-installment-price");
    const sideInstallmentUnit = document.getElementById("side-installment-unit");
    const sideCashPrice = document.getElementById("side-cash-price");
    const sideLoanNote = document.getElementById("side-loan-note");

    function parseMoney(value) {
        return Number(String(value).replace(/[^\d]/g, "")) || 0;
    }

    function formatMoney(value) {
        return Math.round(value).toLocaleString("vi-VN");
    }

    function updateSliderUI() {
        const val = Number(range.value);
        const min = Number(range.min);
        const max = Number(range.max);

        const percent = ((val - min) / (max - min)) * 100;

        bubble.textContent = val + "%";
        range.style.setProperty("--range-fill", percent + "%");

        const thumbWidth = 20;
        const sliderWidth = range.offsetWidth;
        const thumbCenter = (percent / 100) * (sliderWidth - thumbWidth) + thumbWidth / 2;

        bubbleWrap.style.left = (thumbCenter - bubbleWrap.offsetWidth / 2) + "px";
    }

    function calculateLoan() {
        const carPrice = parseMoney(carPriceInput.value);
        const loanAmount = parseMoney(loanAmountInput.value);
        const months = Number(loanTermInput.value) || 1;
        const annualRate = Number(String(interestRateInput.value).replace(",", ".")) || 0;
        const monthlyRate = annualRate / 100 / 12;
        const loanType = loanTypeInput.value;

        let monthlyPayment = 0;
        let totalInterest = 0;
        let totalPayment = 0;

        if (paymentMode === "cash") {
            const paidAmount = loanAmount;
            const remainingAmount = Math.max(carPrice - paidAmount, 0);

            monthlyPaymentLabelEl.textContent = "Trả trước";
            monthlyPaymentEl.textContent = formatMoney(paidAmount) + " VNĐ";

            totalInterestEl.previousElementSibling.textContent = "Thanh toán còn lại";
            totalInterestEl.textContent = formatMoney(remainingAmount) + " VNĐ";

            totalPaymentEl.previousElementSibling.textContent = "Tổng số tiền phải trả";
            totalPaymentEl.textContent = formatMoney(carPrice) + " VNĐ";
            interestDetailLink.style.display = "none";
            return;
        }
        interestDetailLink.style.display = "inline-block";
        totalInterestEl.previousElementSibling.textContent = "Tổng số tiền lãi phải trả";
        totalPaymentEl.previousElementSibling.textContent = "Tổng số tiền phải trả";

        if (loanType === "flat") {
            totalInterest = loanAmount * (annualRate / 100) * (months / 12);
            totalPayment = loanAmount + totalInterest;
            monthlyPayment = totalPayment / months;
        } else {
            const principalPerMonth = loanAmount / months;

            for (let i = 0; i < months; i++) {
                const remainingPrincipal = loanAmount - principalPerMonth * i;
                const interestThisMonth = remainingPrincipal * monthlyRate;
                totalInterest += interestThisMonth;
            }

            totalPayment = loanAmount + totalInterest;
            monthlyPayment = principalPerMonth + loanAmount * monthlyRate;
        }

        if (loanType === "flat") {
            monthlyPaymentLabelEl.textContent = "Số tiền trả góp hằng tháng ước tính";
            monthlyPaymentEl.textContent = formatMoney(monthlyPayment) + " VNĐ / Tháng";

            sideInstallmentPrice.textContent = formatMoney(monthlyPayment);
            sideInstallmentUnit.textContent = "VNĐ / Tháng";
        } else {
            monthlyPaymentLabelEl.textContent = "Số tiền trả tháng đầu";
            monthlyPaymentEl.textContent = formatMoney(monthlyPayment) + " VNĐ";

            sideInstallmentPrice.textContent = formatMoney(monthlyPayment);
            sideInstallmentUnit.textContent = "VNĐ tháng đầu";
        }

        totalInterestEl.textContent = formatMoney(totalInterest) + " VNĐ";
        totalPaymentEl.textContent = formatMoney(totalPayment) + " VNĐ";

        sideCashPrice.textContent = formatMoney(carPrice);
        sideLoanNote.textContent = "Lãi suất hằng năm " + annualRate + "% trong " + months + " tháng.";
    }
    function switchPaymentMode(mode) {
        paymentMode = mode;

        paymentTabs.forEach(function (tab) {
            tab.classList.toggle("is-active", tab.dataset.paymentTab === mode);
        });
        sideInstallmentCheck.checked = mode === "installment";
        sideCashCheck.checked = mode === "cash";

        if (mode === "cash") {
            installmentFields.style.display = "none";
            loanAmountLabel.textContent = "Trả trước";
            sideLoanNote.style.display = "none";
        } else {
            installmentFields.style.display = "block";
            loanAmountLabel.textContent = "Số tiền vay";
            sideLoanNote.style.display = "block";
        }

        calculateLoan();
    }
    function syncLoanAmountFromRange() {
        const carPrice = parseMoney(carPriceInput.value);
        const percent = Number(range.value) / 100;
        const loanAmount = carPrice * percent;

        loanAmountInput.value = formatMoney(loanAmount);

        updateSliderUI();
        calculateLoan();
    }

    function syncRangeFromLoanAmount() {
        const carPrice = parseMoney(carPriceInput.value);
        const loanAmount = parseMoney(loanAmountInput.value);

        if (carPrice > 0) {
            const percent = Math.min(Math.max((loanAmount / carPrice) * 100, 0), 100);
            range.value = Math.round(percent);
        }

        loanAmountInput.value = formatMoney(loanAmount);

        updateSliderUI();
        calculateLoan();
    }

    carPriceInput.addEventListener("input", function () {
        const carPrice = parseMoney(carPriceInput.value);
        carPriceInput.value = formatMoney(carPrice);

        syncLoanAmountFromRange();
    });

    loanAmountInput.addEventListener("input", syncRangeFromLoanAmount);

    range.addEventListener("input", syncLoanAmountFromRange);

    loanTermInput.addEventListener("change", calculateLoan);
    interestRateInput.addEventListener("input", calculateLoan);
    loanTypeInput.addEventListener("change", calculateLoan);
    paymentTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            switchPaymentMode(tab.dataset.paymentTab);
        });
    });

    sideInstallmentCheck.addEventListener("change", function () {
        if (sideInstallmentCheck.checked) {
            switchPaymentMode("installment");
        } else {
            sideInstallmentCheck.checked = true;
        }
    });

    sideCashCheck.addEventListener("change", function () {
        if (sideCashCheck.checked) {
            switchPaymentMode("cash");
        } else {
            sideCashCheck.checked = true;
        }
    });
    const requestModal = document.getElementById("request-modal");
    const closeRequestModal = document.getElementById("close-request-modal");
    const requestButtons = document.querySelectorAll(".loan-actions .primary-btn, .price-box .primary-btn");

    const modalEstimateTotal = document.getElementById("modal-estimate-total");
    const modalCarPrice = document.getElementById("modal-car-price");
    const paymentDetailToggle = document.getElementById("payment-detail-toggle");
    const paymentDetailList = document.getElementById("payment-detail-list");
    const paymentDetailArrow = document.getElementById("payment-detail-arrow");
    const modalPrepaidPercent = document.getElementById("modal-prepaid-percent");
    const modalPrepaid = document.getElementById("modal-prepaid");
    const modalMonthlyLabel = document.getElementById("modal-monthly-label");
    const modalMonthlyPayment = document.getElementById("modal-monthly-payment");
    const modalMonthlyRow = document.getElementById("modal-monthly-row");
    const modalInterestRow = document.getElementById("modal-interest-row");
    const modalInterestLabel = document.getElementById("modal-interest-label");
    const modalTotalInterest = document.getElementById("modal-total-interest");

    function updateRequestModalData() {
        const carPrice = parseMoney(carPriceInput.value);
        const loanAmount = parseMoney(loanAmountInput.value);
        const prepaidAmount = Math.max(carPrice - loanAmount, 0);
        const prepaidPercent = carPrice > 0 ? Math.round((prepaidAmount / carPrice) * 100) : 0;

        const months = Number(loanTermInput.value) || 1;
        const annualRate = Number(String(interestRateInput.value).replace(",", ".")) || 0;
        const monthlyRate = annualRate / 100 / 12;
        const loanType = loanTypeInput.value;

        let totalInterest = 0;
        let totalPayment = 0;
        let monthlyPayment = 0;

        modalCarPrice.textContent = formatMoney(carPrice) + " đ";
        modalPrepaidPercent.textContent = prepaidPercent;
        modalPrepaid.textContent = formatMoney(prepaidAmount) + " đ";

        if (paymentMode === "cash") {
            const remainingAmount = Math.max(carPrice - prepaidAmount, 0);

            modalEstimateTotal.textContent = formatMoney(carPrice) + " đ";

            modalMonthlyRow.style.display = "none";
            modalInterestRow.style.display = "flex";

            modalInterestLabel.textContent = "Thanh toán còn lại";
            modalTotalInterest.textContent = formatMoney(remainingAmount) + " đ";

            return;
        }

        modalMonthlyRow.style.display = "flex";
        modalInterestRow.style.display = "flex";
        modalInterestLabel.textContent = "Tổng số tiền lãi phải trả";

        if (loanType === "flat") {
            totalInterest = loanAmount * (annualRate / 100) * (months / 12);
            totalPayment = loanAmount + totalInterest;
            monthlyPayment = totalPayment / months;

            modalMonthlyLabel.textContent = "Khoản trả góp/tháng";
            modalMonthlyPayment.textContent = formatMoney(monthlyPayment) + " đ/tháng";
        } else {
            const principalPerMonth = loanAmount / months;

            for (let i = 0; i < months; i++) {
                const remainingPrincipal = loanAmount - principalPerMonth * i;
                const interestThisMonth = remainingPrincipal * monthlyRate;
                totalInterest += interestThisMonth;
            }

            totalPayment = loanAmount + totalInterest;
            monthlyPayment = principalPerMonth + loanAmount * monthlyRate;

            modalMonthlyLabel.textContent = "Số tiền trả tháng đầu";
            modalMonthlyPayment.textContent = formatMoney(monthlyPayment) + " đ/tháng đầu";
        }

        modalEstimateTotal.textContent = formatMoney(totalPayment) + " đ";
        modalTotalInterest.textContent = formatMoney(totalInterest) + " đ";
    }

    requestButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            updateRequestModalData();

            paymentDetailList.classList.remove("is-open");
            paymentDetailArrow.src = "images/GuiYeuCau/Vector_chi_xuong.svg";

            requestModal.classList.add("is-open");
        });
    });

    closeRequestModal.addEventListener("click", function () {
        requestModal.classList.remove("is-open");
    });

    requestModal.addEventListener("click", function (event) {
        if (event.target.classList.contains("request-modal-overlay")) {
            requestModal.classList.remove("is-open");
        }
    });
    const interestModal = document.getElementById("interest-modal");
    const closeInterestModal = document.getElementById("close-interest-modal");
    const interestTableBody = document.getElementById("interest-table-body");
    const successModal = document.getElementById("success-modal");
    const submitRequestModal = document.getElementById("submit-request-modal");
    const requestNameInput = document.getElementById("request-name");
    const requestPhoneInput = document.getElementById("request-phone");
    const requestNameError = document.getElementById("request-name-error");
    const requestPhoneError = document.getElementById("request-phone-error");
    const closeSuccessModal = document.getElementById("close-success-modal");
    requestNameInput.addEventListener("input", function () {
        requestNameInput.closest(".request-field").classList.remove("is-error");
        requestNameError.textContent = "";
    });

    requestPhoneInput.addEventListener("input", function () {
        requestPhoneInput.closest(".request-field").classList.remove("is-error");
        requestPhoneError.textContent = "";
    });
    submitRequestModal.addEventListener("click", function () {
        const nameValue = requestNameInput.value.trim();
        const phoneValue = requestPhoneInput.value.trim();

        let isValid = true;

        requestNameInput.closest(".request-field").classList.remove("is-error");
        requestPhoneInput.closest(".request-field").classList.remove("is-error");

        requestNameError.textContent = "";
        requestPhoneError.textContent = "";

        if (nameValue === "") {
            requestNameError.textContent = "Vui lòng nhập họ và tên";
            requestNameInput.closest(".request-field").classList.add("is-error");
            isValid = false;
        }
        const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;

        if (phoneValue === "") {
            requestPhoneError.textContent = "Vui lòng nhập số điện thoại";
            requestPhoneInput.closest(".request-field").classList.add("is-error");
            isValid = false;
        } else if (!phoneRegex.test(phoneValue)) {
            requestPhoneError.textContent = "Số điện thoại phải gồm 10-11 chữ số";
            requestPhoneInput.closest(".request-field").classList.add("is-error");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        requestModal.classList.remove("is-open");
        successModal.classList.add("is-open");
    });

    successModal.addEventListener("click", function (event) {
        if (event.target.classList.contains("success-modal-overlay")) {
            successModal.classList.remove("is-open");
        }
    });
    closeSuccessModal.addEventListener("click", function () {
        successModal.classList.remove("is-open");
    });
    paymentDetailToggle.addEventListener("click", function () {
        const isOpen = paymentDetailList.classList.toggle("is-open");

        if (isOpen) {
            paymentDetailArrow.src = "images/GuiYeuCau/Vector_chi_len.svg";
        } else {
            paymentDetailArrow.src = "images/GuiYeuCau/Vector_chi_xuong.svg";
        }
    });
    function formatTableMoney(value) {
        return Math.round(value).toLocaleString("en-US");
    }

    function renderInterestTable() {
        const loanAmount = parseMoney(loanAmountInput.value);
        const months = Number(loanTermInput.value) || 1;
        const annualRate = Number(String(interestRateInput.value).replace(",", ".")) || 0;
        const monthlyRate = annualRate / 100 / 12;
        const loanType = loanTypeInput.value;

        let rows = "";

        if (loanType === "flat") {
            const principalPerMonth = loanAmount / months;
            const interestPerMonth = loanAmount * monthlyRate;
            const paymentPerMonth = principalPerMonth + interestPerMonth;

            for (let i = 1; i <= months; i++) {
                const openingBalance = Math.max(loanAmount - principalPerMonth * (i - 1), 0);

                rows += `
                    <tr>
                        <td>${i}</td>
                        <td>${formatTableMoney(openingBalance)}</td>
                        <td>${formatTableMoney(principalPerMonth)}</td>
                        <td>${formatTableMoney(interestPerMonth)}</td>
                        <td>${formatTableMoney(paymentPerMonth)}</td>
                    </tr>
                `;
            }
        } else {
            const principalPerMonth = loanAmount / months;

            for (let i = 1; i <= months; i++) {
                const openingBalance = Math.max(loanAmount - principalPerMonth * (i - 1), 0);
                const interestThisMonth = openingBalance * monthlyRate;
                const paymentThisMonth = principalPerMonth + interestThisMonth;

                rows += `
                    <tr>
                        <td>${i}</td>
                        <td>${formatTableMoney(openingBalance)}</td>
                        <td>${formatTableMoney(principalPerMonth)}</td>
                        <td>${formatTableMoney(interestThisMonth)}</td>
                        <td>${formatTableMoney(paymentThisMonth)}</td>
                    </tr>
                `;
            }
        }

        interestTableBody.innerHTML = rows;
    }

    interestDetailLink.addEventListener("click", function (event) {
        event.preventDefault();

        renderInterestTable();
        interestModal.classList.add("is-open");
    });

    closeInterestModal.addEventListener("click", function () {
        interestModal.classList.remove("is-open");
    });

    interestModal.addEventListener("click", function (event) {
        if (event.target.classList.contains("interest-modal-overlay")) {
            interestModal.classList.remove("is-open");
        }
    });
    const sellerPhoneBtn = document.getElementById("seller-phone-btn");
    const sellerPhoneText = document.getElementById("seller-phone-text");

    if (sellerPhoneBtn && sellerPhoneText) {
        let isPhoneVisible = false;

        sellerPhoneBtn.addEventListener("click", function () {
            isPhoneVisible = !isPhoneVisible;

            if (isPhoneVisible) {
                sellerPhoneText.textContent = "0918984245";
            } else {
                sellerPhoneText.textContent = "0918984xxx";
            }
        });
    }
    const galleryItems = [
        { src: "images/gallery/anh1.svg", type: "video" },
        { src: "images/gallery/anh2.svg", type: "image" },
        { src: "images/gallery/anh3.svg", type: "image" },
        { src: "images/gallery/anh4.svg", type: "image" },
        { src: "images/gallery/anh5.svg", type: "image" },
        { src: "images/gallery/anh6.svg", type: "image" },
        { src: "images/gallery/anh7.svg", type: "image" },
        { src: "images/gallery/anh75.jpg", type: "image" },
        { src: "images/gallery/anh8.jpg", type: "image" },
        { src: "images/gallery/anh9.jpg", type: "image" },
        { src: "images/gallery/anh10.jpg", type: "image" },
        { src: "images/gallery/anh11.jpg", type: "image" },
        { src: "images/gallery/anh12.jpg", type: "image" },
        { src: "images/gallery/anh13.jpg", type: "image" },
        { src: "images/gallery/anh14.jpg", type: "image" },
        { src: "images/gallery/anh15.jpg", type: "image" },
        { src: "images/gallery/anh16.jpg", type: "image" },
        { src: "images/gallery/anh17.jpg", type: "image" },
        { src: "images/gallery/anh18.jpg", type: "image" },
        { src: "images/gallery/anh19.jpg", type: "image" },
    ];

    const mainCarImg = document.getElementById("main-car-img");
    const galleryCounter = document.getElementById("gallery-counter");
    const galleryOverlay = document.getElementById("gallery-contact-overlay");
    const mainGallery = document.querySelector(".main-gallery");
    let thumbs = [];
    const galleryPrev = document.querySelector(".gallery-prev");
    const galleryNext = document.querySelector(".gallery-next");
    const thumbnailRow = document.getElementById("thumbnail-row");
    const thumbPrev = document.querySelector(".thumb-prev");
    const thumbNext = document.querySelector(".thumb-next");

    let currentGalleryIndex = 0;
    function renderGalleryThumbs() {
        if (!thumbnailRow) return;

        thumbnailRow.innerHTML = "";

        galleryItems.forEach(function (item, index) {
            const thumb = document.createElement("div");
            thumb.className = "thumb";
            thumb.dataset.index = index;

            thumb.innerHTML = `
                <img src="${item.src}" alt="Ảnh xe ${index + 1}">
                ${item.type === "video" ? "<span>▶</span>" : ""}
            `;

            thumb.addEventListener("click", function () {
                showGalleryImage(index);
            });

            thumbnailRow.appendChild(thumb);
        });

        thumbs = thumbnailRow.querySelectorAll(".thumb");
    }

    function showGalleryImage(index) {
        if (!mainCarImg) return;

        if (index < 0 || index >= galleryItems.length) {
            return;
        }

        currentGalleryIndex = index;
        mainCarImg.src = galleryItems[currentGalleryIndex].src;

        if (galleryCounter) {
            galleryCounter.textContent = (currentGalleryIndex + 1) + " / " + galleryItems.length;
        }

        thumbs.forEach(function (thumb) {
            thumb.classList.toggle("active", Number(thumb.dataset.index) === currentGalleryIndex);
        });

        const activeThumb = thumbnailRow
            ? thumbnailRow.querySelector('.thumb[data-index="' + currentGalleryIndex + '"]')
            : null;
        if (activeThumb && thumbnailRow) {
            const rowRect = thumbnailRow.getBoundingClientRect();
            const thumbRect = activeThumb.getBoundingClientRect();

            const scrollLeft =
                thumbnailRow.scrollLeft +
                (thumbRect.left - rowRect.left) -
                (thumbnailRow.clientWidth / 2) +
                (activeThumb.clientWidth / 2);

            thumbnailRow.scrollTo({
                left: scrollLeft,
                behavior: "smooth"
            });
        }

        const currentItem = galleryItems[currentGalleryIndex];
        const isVideo = currentItem.type === "video";
        const isLastImage = currentGalleryIndex === galleryItems.length - 1;
        const galleryPlayBtn = document.getElementById("gallery-play-btn");

        if (galleryPlayBtn) {
            galleryPlayBtn.style.display = isVideo ? "flex" : "none";
        }

        if (galleryOverlay) {
            galleryOverlay.classList.toggle("is-show", isLastImage);
        }

        if (mainGallery) {
            mainGallery.classList.toggle("is-last", isLastImage);
        }
        if (galleryPrev) {
            galleryPrev.classList.toggle("is-hidden", currentGalleryIndex === 0);
        }

        if (galleryNext) {
            galleryNext.classList.toggle("is-hidden", currentGalleryIndex === galleryItems.length - 1);
        }

        if (thumbPrev) {
            thumbPrev.classList.toggle("is-hidden", currentGalleryIndex === 0);
        }

        if (thumbNext) {
            thumbNext.classList.toggle("is-hidden", currentGalleryIndex === galleryItems.length - 1);
        }

    }



    if (galleryPrev) {
        galleryPrev.addEventListener("click", function () {
            showGalleryImage(currentGalleryIndex - 1);
        });
    }

    if (galleryNext) {
        galleryNext.addEventListener("click", function () {
            showGalleryImage(currentGalleryIndex + 1);
        });
    }

    if (thumbPrev && thumbnailRow) {
        thumbPrev.addEventListener("click", function () {
            showGalleryImage(currentGalleryIndex - 1);
        });
    }

    if (thumbNext && thumbnailRow) {
        thumbNext.addEventListener("click", function () {
            showGalleryImage(currentGalleryIndex + 1);
        });
    }

    renderGalleryThumbs();
    showGalleryImage(0);
    updateSliderUI();
    calculateLoan();
    // Scroll ngang feature cards
    const featureList = document.querySelector(".feature-list");
    const slideLeft = document.querySelector(".slide-left");
    const slideRight = document.querySelector(".slide-right");

    if (slideLeft && slideRight && featureList) {
        function updateFeatureArrows() {
            const maxScrollLeft = featureList.scrollWidth - featureList.clientWidth;

            slideLeft.classList.toggle("is-hidden", featureList.scrollLeft <= 2);
            slideRight.classList.toggle("is-hidden", featureList.scrollLeft >= maxScrollLeft - 2);
        }
        slideRight.addEventListener("click", function () {
            featureList.scrollBy({
                left: 210,
                behavior: "smooth"
            });

            setTimeout(updateFeatureArrows, 250);
        });

        slideLeft.addEventListener("click", function () {
            featureList.scrollBy({
                left: -210,
                behavior: "smooth"
            });

            setTimeout(updateFeatureArrows, 250);
        });

        featureList.addEventListener("scroll", updateFeatureArrows);
        window.addEventListener("resize", updateFeatureArrows);

        updateFeatureArrows();
    }
    const listingSliders = document.querySelectorAll(".listing-slider");

    listingSliders.forEach(function (slider) {
        const track = slider.querySelector(".listing-track");
        const prevBtn = slider.querySelector(".listing-prev");
        const nextBtn = slider.querySelector(".listing-next");

        if (!track || !prevBtn || !nextBtn) return;

            function getScrollAmount() {
                const firstCard = track.querySelector(".car-card");
                if (!firstCard) return 220;
                const gap = 14;
                return firstCard.offsetWidth + gap;
            }

        function updateListingArrows() {
            const maxScrollLeft = track.scrollWidth - track.clientWidth;

            prevBtn.classList.toggle("is-hidden", track.scrollLeft <= 2);
            nextBtn.classList.toggle("is-hidden", track.scrollLeft >= maxScrollLeft - 2);
        }

        prevBtn.addEventListener("click", function () {
            track.scrollBy({
                left: -getScrollAmount(),
                behavior: "smooth"
            });

            setTimeout(updateListingArrows, 250);
        });

        nextBtn.addEventListener("click", function () {
            track.scrollBy({
                left: getScrollAmount(),
                behavior: "smooth"
            });

            setTimeout(updateListingArrows, 250);
        });

        track.addEventListener("scroll", updateListingArrows);
        window.addEventListener("resize", updateListingArrows);

        updateListingArrows();
    });
    const moreListingButtons = document.querySelectorAll(".more-listing");

    moreListingButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const listingSection = button.closest(".listing-section");

            if (!listingSection) return;

            listingSection.classList.toggle("is-expanded");

            if (listingSection.classList.contains("is-expanded")) {
                button.textContent = "Thu gọn";
            } else {
                button.textContent = "Xem thêm tin đăng";
            }
        });
    });
    const descCard = document.getElementById("desc-card");
    const descToggle = document.getElementById("desc-toggle");

    if (descCard && descToggle) {
        descToggle.addEventListener("click", function () {
            descCard.classList.toggle("is-expanded");

            if (descCard.classList.contains("is-expanded")) {
                descToggle.innerHTML = 'Thu gọn <span>▾</span>';
            } else {
                descToggle.innerHTML = 'Xem thêm <span>▾</span>';
            }
        });
    }
    const featureBtn = document.querySelector(".view-all-btn");
    const carInfoModal = document.getElementById("carInfoModal");
    const closeCarInfoModal = document.getElementById("closeCarInfoModal");

    if (featureBtn && carInfoModal && closeCarInfoModal) {
        featureBtn.addEventListener("click", function() {
            carInfoModal.classList.add("active");
        });

        closeCarInfoModal.addEventListener("click", function() {
            carInfoModal.classList.remove("active");
        });

        carInfoModal.addEventListener("click", function(e){
            if(e.target === carInfoModal) {
                carInfoModal.classList.remove("active");
            }
        });
    }

    // ============================================================
    // STICKY BAR
    // ============================================================
    var stickyBar      = document.getElementById("stickyBar");
    var stickyThumb    = document.getElementById("sticky-thumb");
    var stickyPhoneBtn = document.getElementById("sticky-phone-btn");
    var stickyPhoneText = document.getElementById("sticky-phone-text");
    var commitSection = document.querySelector(".commit-section");
    var stickyTabLinks = document.querySelectorAll(".sticky-tab");
    // Sticky bar — hiện khi scroll qua thông tin xe
    var stickyTrigger = document.querySelector(".quick-info"); // trigger duy nhất

    window.addEventListener("scroll", function() {
        if (!stickyBar || !stickyTrigger) return;

        const triggerTop = stickyTrigger.getBoundingClientRect().top;

        // Khi scroll tới gần top viewport, hiện sticky bar
        if (triggerTop <= 60) { // 60px offset, điều chỉnh tuỳ giao diện
            stickyBar.classList.add("is-visible");
        } else {
            stickyBar.classList.remove("is-visible");
        }
    });

    // Keep sticky thumbnail in sync with main gallery image
    if (stickyThumb && mainCarImg) {
        var thumbObserver = new MutationObserver(function() {
            stickyThumb.src = mainCarImg.src;
        });
        thumbObserver.observe(mainCarImg, { attributes: true, attributeFilter: ["src"] });
    }

    // Highlight active tab as user scrolls
    var stickyScrollSections = ["thong-so", "desc-card", "loan-calculator", "cam-ket"]
        .map(id => document.getElementById(id))
        .filter(Boolean);

    if (stickyTabLinks.length && stickyScrollSections.length) {
        var tabObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    stickyTabLinks.forEach(function(t) { t.classList.remove("active"); });
                    var match = document.querySelector('.sticky-tab[href="#' + entry.target.id + '"]');
                    if (match) match.classList.add("active");
                }
            });
        }, { threshold: 0.3 });

        stickyScrollSections.forEach(function(s) { tabObserver.observe(s); });
    }

    // Sticky phone button — reveal number on click (mirrors seller box logic)
    if (stickyPhoneBtn && stickyPhoneText) {
        var stickyPhoneVisible = false;
        stickyPhoneBtn.addEventListener("click", function() {
            stickyPhoneVisible = !stickyPhoneVisible;
            stickyPhoneText.textContent = stickyPhoneVisible
                ? "0918984245"
                : "0918984xxx";
        });
    }
    // LOGIC CHO TIN ĐĂNG (SLIDER & XEM THÊM)
    const allListingSliders = document.querySelectorAll(".listing-slider");

    allListingSliders.forEach(function (slider) {
        const track = slider.querySelector(".listing-track");
        const prevBtn = slider.querySelector(".listing-prev");
        const nextBtn = slider.querySelector(".listing-next");
        const moreBtn = slider.closest('.listing-section, .similar-listing-section').querySelector('.more-listing');

        if (!track || !prevBtn || !nextBtn) return;

        // Hàm tính toán khoảng cách cuộn
        function getScrollAmount() {
            const firstCard = track.querySelector(".car-card");
            const cardWidth = firstCard ? firstCard.offsetWidth : 180;
            const gap = 14;
            return cardWidth + gap;
        }

        // Sự kiện nút Next
        nextBtn.addEventListener("click", function () {
            track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
        });

        // Sự kiện nút Prev
        prevBtn.addEventListener("click", function () {
            track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
        });

        // Xử lý nút Xem thêm tin đăng
        if (moreBtn) {
            moreBtn.addEventListener("click", function () {
                const section = moreBtn.closest('.listing-section, .similar-listing-section');
                section.classList.toggle("is-expanded");

                if (section.classList.contains("is-expanded")) {
                    moreBtn.textContent = "Thu gọn";
                    track.scrollTo({ left: 0, behavior: "instant" }); // Reset slider khi mở rộng
                } else {
                    moreBtn.textContent = "Xem thêm tin đăng";
                }
            });
        }
    });
    const setupSliders = () => {
        const sliders = document.querySelectorAll(".listing-slider");

        sliders.forEach(slider => {
            const track = slider.querySelector(".listing-track");
            const next = slider.querySelector(".listing-next");
            const prev = slider.querySelector(".listing-prev");
            const section = slider.closest('.listing-section, .similar-listing-section');

            if (!track || !next || !prev) return;

            const scrollAmount = 180 + 14; // Width card + gap

            next.onclick = () => {
                track.scrollBy({ left: scrollAmount, behavior: "smooth" });
            };

            prev.onclick = () => {
                track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            };

            // Kiểm tra ẩn/hiện mũi tên khi cuộn
            track.onscroll = () => {
                const maxScroll = track.scrollWidth - track.clientWidth;
                prev.style.display = track.scrollLeft <= 0 ? "none" : "flex";
                next.style.display = track.scrollLeft >= maxScroll - 5 ? "none" : "flex";
            };
            
            // Khởi tạo trạng thái mũi tên ban đầu
            prev.style.display = "none"; 
        });
    };

    setupSliders();   
// Xử lý bấm Xem thêm
    const btnMore = document.querySelectorAll(".more-listing");
    btnMore.forEach(btn => {
        btn.onclick = function() {
            const section = this.closest('.listing-section, .similar-listing-section');
            section.classList.toggle("is-expanded");
            
            if (section.classList.contains("is-expanded")) {
                this.textContent = "Thu gọn";
            } else {
                this.textContent = "Xem thêm tin đăng";
            }
        };
    });

    // Xử lý Slider cho mũi tên
    const sliders = document.querySelectorAll(".listing-slider");
    sliders.forEach(s => {
        const track = s.querySelector(".listing-track");
        const next = s.querySelector(".listing-next");
        const prev = s.querySelector(".listing-prev");
        
        if(!next || !prev) return;

        next.onclick = () => track.parentElement.scrollBy({left: 194, behavior: 'smooth'});
        prev.onclick = () => track.parentElement.scrollBy({left: -194, behavior: 'smooth'});
    });
    // Bình luận ở sidebar xe
    const vehCommentInput = document.getElementById("veh-comment-input");
    const vehCommentSend = document.getElementById("veh-comment-send");
    const vehCommentList = document.getElementById("veh-comment-list");
    const vehEmptyComment = document.getElementById("veh-empty-comment");

    function addVehComment() {
        if (!vehCommentInput || !vehCommentList) return;

        const text = vehCommentInput.value.trim();
        if (text === "") return;

        const commentItem = document.createElement("div");
        commentItem.className = "veh-comment-item";
        commentItem.innerHTML = `
            <strong>Bạn</strong>
            <span>${text}</span>
        `;

        vehCommentList.appendChild(commentItem);
        vehCommentInput.value = "";

        if (vehEmptyComment) {
            vehEmptyComment.style.display = "none";
        }
    }

    if (vehCommentSend) {
        vehCommentSend.addEventListener("click", addVehComment);
    }

    if (vehCommentInput) {
        vehCommentInput.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                addVehComment();
            }
        });
    }
});