function renderSimilarJobs() {
    const similarJobsContainer = document.getElementById("similarJobsList");

    if (!similarJobsContainer || typeof similarJobs === "undefined") {
        return;
    }

    similarJobsContainer.innerHTML = similarJobs.map(function (job) {
        const parts = job.time.split('·');
        const timePart = parts[0] ? parts[0].trim() : '';
        const contactPart = parts[1] ? parts[1].trim() : '';

        return `
            <div class="similar-job">
                <img src="${job.image}" alt="${job.company}" class="similar-logo">

                <div class="similar-info">
                    <h4>${job.title}</h4>
                    <p class="similar-company">${job.company}</p>
                    <strong>${job.salary}</strong>

                    <p class="similar-location">
                        <img src="images/dia_chi.svg" alt="">
                        <span>${job.location}</span>
                    </p>

                    <div class="similar-bottom">
                        <span class="time-small">${timePart}</span>
                        <img src="images/cham.svg" class="dot-icon" alt="chấm">
                        <span class="contacts-small">${contactPart}</span>

                        <div class="remaining-days">
                            <img src="images/thoi_han.svg" alt="">
                            <span>${job.deadline}</span>
                        </div>
                    </div>
                </div>

                <img src="images/yeu_thich.svg" alt="Yêu thích" class="similar-heart">
            </div>
        `;
    }).join("");
}

function renderKeywords() {
    const keywordContainer = document.getElementById("keywordList");

    if (!keywordContainer || typeof keywordData === "undefined") {
        return;
    }

    keywordContainer.innerHTML = keywordData.map(function (group) {
        return `
            <div>
                <h4>${group.title}</h4>
                ${group.items.map(function (item) {
                    return `<p>${item}</p>`;
                }).join("")}
            </div>
        `;
    }).join("");
}

function setupDescriptionToggle() {
    const descCard = document.getElementById("descCard");
    const seeMoreBtn = document.getElementById("seeMoreBtn");

    if (!descCard || !seeMoreBtn) {
        return;
    }

    const seeMoreText = seeMoreBtn.querySelector("span");

    seeMoreBtn.addEventListener("click", function () {
        descCard.classList.toggle("expanded");

        if (descCard.classList.contains("expanded")) {
            seeMoreText.textContent = "Thu gọn";
        } else {
            seeMoreText.textContent = "Xem thêm";
        }
    });
}

function initApp() {
    renderSimilarJobs();
    renderKeywords();
    setupDescriptionToggle();
    setupQuickChatSlider();
    setupSalaryModal();
    setupTaxModal();
    setupMoneyInputs();
    setupInsuranceRadioToggle();
    setupApplyModal();
}

document.addEventListener("DOMContentLoaded", initApp);

window.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".similar-job");
    let maxHeight = 0;

    cards.forEach(function (card) {
        const height = card.offsetHeight;

        if (height > maxHeight) {
            maxHeight = height;
        }
    });

    cards.forEach(function (card) {
        card.style.height = maxHeight + "px";
    });
});

function setupQuickChatSlider() {
    const arrow = document.querySelector(".quick-chat-arrow");
    const list = document.querySelector(".quick-chat-list");
    const windowBox = document.querySelector(".quick-chat-window");

    if (!arrow || !list || !windowBox) {
        return;
    }

    let offset = 0;
    const step = 180;

    arrow.addEventListener("click", function () {
        const visibleWidth = windowBox.offsetWidth;
        const totalWidth = list.scrollWidth;
        const maxOffset = totalWidth - visibleWidth;

        if (maxOffset <= 0) {
            return;
        }

        offset += step;

        if (offset > maxOffset) {
            offset = 0;
        }

        list.style.transform = `translateX(-${offset}px)`;
    });
}

function setupSalaryModal() {
    const salaryBanner = document.querySelector('.banner img[src="images/banner_tinhluong.png"]');
    const salaryModal = document.getElementById("salaryModal");
    const closeModal = document.getElementById("closeModal");
    const grossBtn = document.getElementById("grossToNetBtn");
    const netBtn = document.getElementById("netToGrossBtn");
    const modalTitle = document.querySelector(".modal-box h2");

    if (!salaryBanner || !salaryModal) {
        return;
    }

    salaryBanner.style.cursor = "pointer";

    salaryBanner.addEventListener("click", function () {
        resetSalaryModal();
        salaryModal.classList.add("active");
    });

    closeModal.addEventListener("click", function () {
        salaryModal.classList.remove("active");
        resetSalaryModal();
    });

    salaryModal.addEventListener("click", function (e) {
        if (e.target === salaryModal) {
            salaryModal.classList.remove("active");
            resetSalaryModal();
        }
    });

    if (grossBtn) {
        grossBtn.addEventListener("click", function () {
            calculateGrossToNet();

            if (modalTitle) {
                modalTitle.textContent = "Công cụ tính lương Gross sang Net [Chuẩn 2026]";
            }
        });
    }

    if (netBtn) {
        netBtn.addEventListener("click", function () {
            calculateNetToGross();

            if (modalTitle) {
                modalTitle.textContent = "Công cụ tính lương Net sang Gross [Chuẩn 2026]";
            }
        });
    }
}

function getNumberValue(id) {
    const input = document.getElementById(id);

    if (!input) {
        return 0;
    }

    const value = input.value.replace(/,/g, "");
    return Number(value) || 0;
}

function formatMoney(number) {
    return Math.round(number).toLocaleString("en-US");
}

function calculatePersonalTax(taxableIncome) {
    const brackets = [
        { limit: 10000000, rate: 0.05, label: "Đến 10 triệu VNĐ" },
        { limit: 30000000, rate: 0.10, label: "Trên 10 triệu VNĐ đến 30 triệu VNĐ" },
        { limit: 60000000, rate: 0.20, label: "Trên 30 triệu VNĐ đến 60 triệu VNĐ" },
        { limit: 100000000, rate: 0.30, label: "Trên 60 triệu VNĐ đến 100 triệu VNĐ" },
        { limit: Infinity, rate: 0.35, label: "Trên 100 triệu VNĐ" }
    ];

    let remainingIncome = taxableIncome;
    let previousLimit = 0;
    let totalTax = 0;
    const details = [];

    brackets.forEach(function (bracket) {
        const bracketRange = bracket.limit - previousLimit;
        const taxableInBracket = Math.max(0, Math.min(remainingIncome, bracketRange));
        const taxAmount = taxableInBracket * bracket.rate;

        details.push({
            label: bracket.label,
            rate: bracket.rate,
            taxable: taxableInBracket,
            tax: taxAmount
        });

        totalTax += taxAmount;
        remainingIncome -= taxableInBracket;
        previousLimit = bracket.limit;
    });

    return {
        totalTax,
        details
    };
}

function clearSalaryErrors() {
    const incomeError = document.getElementById("incomeError");
    const insuranceError = document.getElementById("insuranceError");

    const inputIncome = document.getElementById("inputIncome");
    const inputInsurance = document.getElementById("inputInsurance");

    const incomeInputWrap = inputIncome?.closest(".modal-input-wrap");
    const insuranceInputWrap = inputInsurance?.closest(".modal-inline-wrap");

    if (incomeError) {
        incomeError.textContent = "";
    }

    if (insuranceError) {
        insuranceError.textContent = "";
    }

    if (inputIncome) {
        inputIncome.placeholder = "";
        inputIncome.classList.remove("placeholder-error");
    }

    if (inputInsurance) {
        inputInsurance.placeholder = "";
        inputInsurance.classList.remove("placeholder-error");
    }

    if (incomeInputWrap) {
        incomeInputWrap.classList.remove("error");
    }

    if (insuranceInputWrap) {
        insuranceInputWrap.classList.remove("error");
    }
}

function showInputError(input, inputWrap, message) {
    if (input) {
        input.value = "";
        input.placeholder = message;
        input.classList.add("placeholder-error");
    }

    if (inputWrap) {
        inputWrap.classList.add("error");
    }
}

const REGIONAL_MINIMUM_WAGE = {
    1: 5310000,
    2: 4730000,
    3: 4140000,
    4: 3700000
};

function getSelectedRegion() {
    const selectedRegion = document.querySelector('input[name="vung"]:checked');
    return selectedRegion ? Number(selectedRegion.value) : 1;
}

function getMinimumInsuranceSalaryByRegion() {
    const region = getSelectedRegion();
    return REGIONAL_MINIMUM_WAGE[region] || REGIONAL_MINIMUM_WAGE[1];
}

function calculateSalaryDataFromGross(gross, dependents, insuranceType, customInsuranceSalary) {
    const minimumInsuranceSalary = getMinimumInsuranceSalaryByRegion();

    let insuranceSalary = gross;
    let insuranceWarning = "";

    if (insuranceType === "chinh_thuc") {
        if (gross < minimumInsuranceSalary) {
            insuranceSalary = minimumInsuranceSalary;
            insuranceWarning = "Lương thấp hơn lương tối thiểu vùng nên bảo hiểm sẽ được tính theo lương tối thiểu vùng";
        }
    }

    if (insuranceType === "khac") {
        insuranceSalary = customInsuranceSalary;
    }

    const socialInsurance = insuranceSalary * 0.08;
    const healthInsurance = insuranceSalary * 0.015;
    const unemploymentInsurance = insuranceSalary * 0.01;
    const totalInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

    const incomeBeforeTax = gross - totalInsurance;

    const personalDeduction = 15500000;
    const dependentDeductionPerPerson = 6200000;
    const totalDependentDeduction = dependents * dependentDeductionPerPerson;

    let taxableIncome = incomeBeforeTax - personalDeduction - totalDependentDeduction;

    if (taxableIncome < 0) {
        taxableIncome = 0;
    }

    const taxResult = calculatePersonalTax(taxableIncome);
    const personalTax = taxResult.totalTax;
    const net = gross - totalInsurance - personalTax;

    const employerSocialInsurance = insuranceSalary * 0.17;
    const employerAccidentInsurance = insuranceSalary * 0.005;
    const employerHealthInsurance = insuranceSalary * 0.03;
    const employerUnemploymentInsurance = insuranceSalary * 0.01;

    const employerTotal =
        gross +
        employerSocialInsurance +
        employerAccidentInsurance +
        employerHealthInsurance +
        employerUnemploymentInsurance;

    return {
        gross,
        insuranceSalary,
        minimumInsuranceSalary,
        insuranceWarning,
        socialInsurance,
        healthInsurance,
        unemploymentInsurance,
        totalInsurance,
        incomeBeforeTax,
        personalDeduction,
        totalDependentDeduction,
        taxableIncome,
        personalTax,
        net,
        taxDetails: taxResult.details,
        employerSocialInsurance,
        employerAccidentInsurance,
        employerHealthInsurance,
        employerUnemploymentInsurance,
        employerTotal
    };
}

function calculateGrossToNet() {
    clearSalaryErrors();

    const inputIncome = document.getElementById("inputIncome");
    const inputInsurance = document.getElementById("inputInsurance");

    const incomeInputWrap = inputIncome?.closest(".modal-input-wrap");
    const insuranceInputWrap = inputInsurance?.closest(".modal-inline-wrap");

    const gross = getNumberValue("inputIncome");
    const dependents = getNumberValue("inputDependents");

    const insuranceType = document.querySelector('input[name="insurance"]:checked')?.value;
    const customInsuranceSalary = getNumberValue("inputInsurance");
    const minimumInsuranceSalary = getMinimumInsuranceSalaryByRegion();

    if (gross <= 0) {
        showInputError(inputIncome, incomeInputWrap, "Vui lòng nhập Thu Nhập");
        return;
    }

    if (insuranceType === "khac") {
        if (customInsuranceSalary <= 0) {
            showInputError(inputInsurance, insuranceInputWrap, "Vui lòng nhập số tiền đóng bảo hiểm");
            return;
        }

        if (customInsuranceSalary < minimumInsuranceSalary) {
            showInputError(inputInsurance, insuranceInputWrap, "Không thấp hơn lương tối thiểu vùng");
            return;
        }

        if (customInsuranceSalary > gross) {
            showInputError(inputInsurance, insuranceInputWrap, "Không được lớn hơn Thu Nhập");
            return;
        }
    }

    const result = calculateSalaryDataFromGross(
        gross,
        dependents,
        insuranceType,
        customInsuranceSalary
    );

    renderSalaryResult(result);
}

function calculateNetToGross() {
    clearSalaryErrors();

    const inputIncome = document.getElementById("inputIncome");
    const inputInsurance = document.getElementById("inputInsurance");

    const incomeInputWrap = inputIncome?.closest(".modal-input-wrap");
    const insuranceInputWrap = inputInsurance?.closest(".modal-inline-wrap");

    const targetNet = getNumberValue("inputIncome");
    const dependents = getNumberValue("inputDependents");

    const insuranceType = document.querySelector('input[name="insurance"]:checked')?.value;
    const customInsuranceSalary = getNumberValue("inputInsurance");
    const minimumInsuranceSalary = getMinimumInsuranceSalaryByRegion();

    if (targetNet <= 0) {
        showInputError(inputIncome, incomeInputWrap, "Vui lòng nhập Thu Nhập");
        return;
    }

    if (insuranceType === "khac") {
        if (customInsuranceSalary <= 0) {
            showInputError(inputInsurance, insuranceInputWrap, "Vui lòng nhập số tiền đóng bảo hiểm");
            return;
        }

        if (customInsuranceSalary < minimumInsuranceSalary) {
            showInputError(inputInsurance, insuranceInputWrap, "Không thấp hơn lương tối thiểu vùng");
            return;
        }
    }

    let low = 0;
    let high = targetNet * 3;

    for (let i = 0; i < 100; i++) {
        const testData = calculateSalaryDataFromGross(
            high,
            dependents,
            insuranceType,
            customInsuranceSalary
        );

        if (testData.net >= targetNet) {
            break;
        }

        high *= 2;
    }

    for (let i = 0; i < 100; i++) {
        const mid = (low + high) / 2;

        const testData = calculateSalaryDataFromGross(
            mid,
            dependents,
            insuranceType,
            customInsuranceSalary
        );

        if (testData.net < targetNet) {
            low = mid;
        } else {
            high = mid;
        }
    }

    const gross = Math.round(high);

    if (insuranceType === "khac" && customInsuranceSalary > gross) {
        showInputError(inputInsurance, insuranceInputWrap, "Không được lớn hơn Gross ước tính");
        return;
    }

    const result = calculateSalaryDataFromGross(
        gross,
        dependents,
        insuranceType,
        customInsuranceSalary
    );

    result.net = targetNet;

    renderSalaryResult(result);
}

function renderSalaryResult(data) {
    const resultArea = document.getElementById("salaryResultArea");

    if (!resultArea) {
        return;
    }

    resultArea.classList.add("active");

    resultArea.innerHTML = `
        <div class="salary-section">
            <h3>Kết quả</h3>

            <table class="salary-table">
                <thead>
                    <tr>
                        <th>Lương Gross</th>
                        <th>Bảo hiểm</th>
                        <th>Thuế TNCN</th>
                        <th>Lương Net</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>${formatMoney(data.gross)}</td>
                        <td>- ${formatMoney(data.totalInsurance)}</td>
                        <td>- ${formatMoney(data.personalTax)}</td>
                        <td>${formatMoney(data.net)}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="salary-section">
            <h3>Diễn giải chi tiết (VNĐ)</h3>

            <table class="salary-table">
                <tbody>
                    <tr class="bold-row">
                        <td>Lương GROSS</td>
                        <td>${formatMoney(data.gross)}</td>
                    </tr>

                    <tr>
                        <td>Mức lương đóng bảo hiểm</td>
                        <td>${formatMoney(data.insuranceSalary)}</td>
                    </tr>

                    ${data.insuranceWarning ? `
                        <tr>
                            <td colspan="2" style="color:#e53935; font-weight:600;">
                                ${data.insuranceWarning}
                            </td>
                        </tr>
                    ` : ""}

                    <tr>
                        <td>Bảo hiểm xã hội (8%)</td>
                        <td>- ${formatMoney(data.socialInsurance)}</td>
                    </tr>

                    <tr>
                        <td>Bảo hiểm y tế (1.5%)</td>
                        <td>- ${formatMoney(data.healthInsurance)}</td>
                    </tr>

                    <tr>
                        <td>Bảo hiểm thất nghiệp (1%)</td>
                        <td>- ${formatMoney(data.unemploymentInsurance)}</td>
                    </tr>

                    <tr class="bold-row">
                        <td>Thu nhập trước thuế</td>
                        <td>${formatMoney(data.incomeBeforeTax)}</td>
                    </tr>

                    <tr>
                        <td>Giảm trừ gia cảnh bản thân</td>
                        <td>- ${formatMoney(data.personalDeduction)}</td>
                    </tr>

                    <tr>
                        <td>Giảm trừ gia cảnh người phụ thuộc</td>
                        <td>- ${formatMoney(data.totalDependentDeduction)}</td>
                    </tr>

                    <tr class="bold-row">
                        <td>Thu nhập chịu thuế</td>
                        <td>${formatMoney(data.taxableIncome)}</td>
                    </tr>

                    <tr>
                        <td>Thuế thu nhập cá nhân(*)</td>
                        <td>- ${formatMoney(data.personalTax)}</td>
                    </tr>

                    <tr class="net-row">
                        <td>Lương NET</td>
                        <td>${formatMoney(data.net)}</td>
                    </tr>
                </tbody>
            </table>

            <p class="salary-note">(Thu nhập trước thuế - Thuế thu nhập cá nhân.)</p>
        </div>

        <div class="salary-section">
            <h3>(*) Chi tiết thuế thu nhập cá nhân (VNĐ)</h3>

            <table class="salary-table">
                <thead>
                    <tr>
                        <th>Mức chịu thuế</th>
                        <th>Thuế suất</th>
                        <th>Lương chịu thuế</th>
                        <th>Tiền nộp</th>
                    </tr>
                </thead>

                <tbody>
                    ${data.taxDetails.map(function (item) {
                        return `
                            <tr>
                                <td>${item.label}</td>
                                <td>${item.rate * 100}%</td>
                                <td>${formatMoney(item.taxable)}</td>
                                <td>${formatMoney(item.tax)}</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>

            <h3 style="margin-top: 22px;">Người sử dụng lao động trả (VNĐ)</h3>

            <table class="salary-table">
                <tbody>
                    <tr>
                        <td>Lương GROSS</td>
                        <td>${formatMoney(data.gross)}</td>
                    </tr>

                    <tr>
                        <td>Bảo hiểm xã hội (17%)</td>
                        <td>${formatMoney(data.employerSocialInsurance)}</td>
                    </tr>

                    <tr>
                        <td>Bảo hiểm Tai nạn lao động - Bệnh nghề nghiệp (0.5%)</td>
                        <td>${formatMoney(data.employerAccidentInsurance)}</td>
                    </tr>

                    <tr>
                        <td>Bảo hiểm y tế (3%)</td>
                        <td>${formatMoney(data.employerHealthInsurance)}</td>
                    </tr>

                    <tr>
                        <td>Bảo hiểm thất nghiệp (1%)</td>
                        <td>${formatMoney(data.employerUnemploymentInsurance)}</td>
                    </tr>

                    <tr class="net-row">
                        <td>Tổng cộng</td>
                        <td>${formatMoney(data.employerTotal)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

function formatMoneyInput(input) {
    if (!input) {
        return;
    }

    input.addEventListener("input", function () {
        let value = input.value.replace(/,/g, "").replace(/\D/g, "");

        if (value === "") {
            input.value = "";
            return;
        }

        input.value = Number(value).toLocaleString("en-US");
    });
}

function setupMoneyInputs() {
    formatMoneyInput(document.getElementById("inputIncome"));
    formatMoneyInput(document.getElementById("inputInsurance"));
    formatMoneyInput(document.getElementById("taxInputIncome"));
    formatMoneyInput(document.getElementById("taxInputInsurance"));
}

function setupInsuranceRadioToggle() {
    const officialRadio = document.querySelector('input[name="insurance"][value="chinh_thuc"]');
    const customRadio = document.querySelector('input[name="insurance"][value="khac"]');
    const inputInsurance = document.getElementById("inputInsurance");
    const insuranceInputWrap = inputInsurance?.closest(".modal-inline-wrap");
    const insuranceError = document.getElementById("insuranceError");

    if (!officialRadio || !customRadio || !inputInsurance) {
        return;
    }

    customRadio.addEventListener("change", function () {
        if (customRadio.checked) {
            inputInsurance.focus();
        }
    });

    inputInsurance.addEventListener("focus", function () {
        customRadio.checked = true;
    });

    officialRadio.addEventListener("change", function () {
        if (officialRadio.checked) {
            inputInsurance.value = "";
            inputInsurance.placeholder = "";
            inputInsurance.classList.remove("placeholder-error");

            if (insuranceInputWrap) {
                insuranceInputWrap.classList.remove("error");
            }

            if (insuranceError) {
                insuranceError.textContent = "";
            }
        }
    });
}

function resetSalaryModal() {
    const modalTitle = document.querySelector('.modal-box h2');
    const resultArea = document.getElementById('salaryResultArea');
    const modalBox = document.querySelector('.modal-box');

    const inputIncome = document.getElementById('inputIncome');
    const inputDependents = document.getElementById('inputDependents');
    const inputInsurance = document.getElementById('inputInsurance');

    const incomeError = document.getElementById('incomeError');
    const insuranceError = document.getElementById('insuranceError');

    const incomeInputWrap = inputIncome?.closest('.modal-input-wrap');
    const insuranceInputWrap = inputInsurance?.closest('.modal-inline-wrap');

    const period2026 = document.querySelector('input[name="period"][value="2026"]');
    const insuranceOfficial = document.querySelector('input[name="insurance"][value="chinh_thuc"]');
    const vung1 = document.querySelector('input[name="vung"][value="1"]');

    if (modalTitle) {
        modalTitle.textContent = 'Công cụ tính lương Gross sang Net và ngược lại [Chuẩn 2026]';
    }

    if (resultArea) {
        resultArea.classList.remove('active');
        resultArea.innerHTML = '';
    }

    if (modalBox) {
        modalBox.classList.remove('calculated');
    }

    if (inputIncome) {
        inputIncome.value = '';
        inputIncome.defaultValue = '';
        inputIncome.placeholder = '';
        inputIncome.classList.remove('placeholder-error');
        inputIncome.blur();

    }

    if (inputDependents) {
        inputDependents.value = '0';
        inputDependents.defaultValue = '0';
    }

    if (inputInsurance) {
        inputInsurance.value = '';
        inputInsurance.defaultValue = '';
        inputInsurance.placeholder = '';
        inputInsurance.classList.remove('placeholder-error');
    }

    if (incomeError) {
        incomeError.textContent = '';
    }

    if (insuranceError) {
        insuranceError.textContent = '';
    }

    if (incomeInputWrap) {
        incomeInputWrap.classList.remove('error');
    }

    if (insuranceInputWrap) {
        insuranceInputWrap.classList.remove('error');
    }

    if (period2026) {
        period2026.checked = true;
    }

    if (insuranceOfficial) {
        insuranceOfficial.checked = true;
    }

    if (vung1) {
        vung1.checked = true;
    }
}


/* ===== CÔNG CỤ TÍNH THUẾ TNCN ===== */
const BASE_SALARY_2026 = 2340000;
const PERSONAL_DEDUCTION_2026 = 15500000;
const DEPENDENT_DEDUCTION_2026 = 6200000;
const SOCIAL_HEALTH_CAP = BASE_SALARY_2026 * 20; // 46,800,000

function setupTaxModal() {
    const taxBanner = document.querySelector('.banner img[src="images/banner_tinhthue.png"]');
    const taxModal = document.getElementById("taxModal");
    const closeTaxModal = document.getElementById("closeTaxModal");
    const taxCalculateBtn = document.getElementById("taxCalculateBtn");
    const taxIncomeInput = document.getElementById("taxInputIncome");

    if (!taxBanner || !taxModal) {
        return;
    }

    taxBanner.style.cursor = "pointer";

    taxBanner.addEventListener("click", function () {
        resetTaxModal();
        taxModal.classList.add("active");
    });

    if (closeTaxModal) {
        closeTaxModal.addEventListener("click", function () {
            taxModal.classList.remove("active");
            resetTaxModal();
        });
    }

    taxModal.addEventListener("click", function (e) {
        if (e.target === taxModal) {
            taxModal.classList.remove("active");
            resetTaxModal();
        }
    });

    setupTaxInsuranceRadioToggle();
    setupTaxCalculateButtonState();

    if (taxCalculateBtn) {
        taxCalculateBtn.addEventListener("click", calculatePersonalIncomeTaxOnly);
    }

    if (taxIncomeInput) {
        taxIncomeInput.addEventListener("input", setupTaxCalculateButtonState);
    }
}

function setupTaxCalculateButtonState() {
    const taxInputIncome = document.getElementById("taxInputIncome");
    const taxCalculateBtn = document.getElementById("taxCalculateBtn");

    if (!taxInputIncome || !taxCalculateBtn) {
        return;
    }

    const rawValue = taxInputIncome.value.replace(/,/g, "").trim();
    taxCalculateBtn.disabled = !(rawValue && Number(rawValue) > 0);
}

function setupTaxInsuranceRadioToggle() {
    const officialRadio = document.querySelector('input[name="tax_insurance"][value="chinh_thuc"]');
    const customRadio = document.querySelector('input[name="tax_insurance"][value="khac"]');
    const taxInputInsurance = document.getElementById("taxInputInsurance");
    const taxInsuranceError = document.getElementById("taxInsuranceError");

    if (!officialRadio || !customRadio || !taxInputInsurance) {
        return;
    }

    taxInputInsurance.addEventListener("focus", function () {
        customRadio.checked = true;
    });

    officialRadio.addEventListener("change", function () {
        if (officialRadio.checked) {
            taxInputInsurance.value = "";
            taxInputInsurance.placeholder = "";
            taxInputInsurance.classList.remove("placeholder-error");

            const wrap = taxInputInsurance.closest(".tax-input-wrap");
            if (wrap) {
                wrap.classList.remove("error");
            }

            if (taxInsuranceError) {
                taxInsuranceError.textContent = "";
            }
        }
    });
}

function getTaxNumberValue(id) {
    const input = document.getElementById(id);
    if (!input) return 0;
    return Number(input.value.replace(/,/g, "")) || 0;
}

function getSelectedTaxRegion() {
    const selected = document.querySelector('input[name="tax_vung"]:checked');
    return selected ? Number(selected.value) : 1;
}

function getTaxMinimumInsuranceSalaryByRegion() {
    const region = getSelectedTaxRegion();
    return REGIONAL_MINIMUM_WAGE[region] || REGIONAL_MINIMUM_WAGE[1];
}

function getUnemploymentInsuranceCap(regionMinimumSalary) {
    return regionMinimumSalary * 20;
}

function clearTaxErrors() {
    const taxIncomeError = document.getElementById("taxIncomeError");
    const taxInsuranceError = document.getElementById("taxInsuranceError");
    const taxInputIncome = document.getElementById("taxInputIncome");
    const taxInputInsurance = document.getElementById("taxInputInsurance");

    const incomeWrap = taxInputIncome?.closest(".tax-input-wrap");
    const insuranceWrap = taxInputInsurance?.closest(".tax-input-wrap");

    if (taxIncomeError) taxIncomeError.textContent = "";
    if (taxInsuranceError) taxInsuranceError.textContent = "";

    if (taxInputIncome) {
        taxInputIncome.classList.remove("placeholder-error");
        taxInputIncome.placeholder = "VD: 10,000,000";
    }

    if (taxInputInsurance) {
        taxInputInsurance.classList.remove("placeholder-error");
        taxInputInsurance.placeholder = "";
    }

    if (incomeWrap) incomeWrap.classList.remove("error");
    if (insuranceWrap) insuranceWrap.classList.remove("error");
}

function showTaxInputError(input, wrap, message) {
    if (input) {
        input.value = "";
        input.placeholder = message;
        input.classList.add("placeholder-error");
    }

    if (wrap) {
        wrap.classList.add("error");
    }
}

function calculateTaxInsurance(insuranceSalary, regionMinimumSalary) {
    const socialHealthBase = Math.min(insuranceSalary, SOCIAL_HEALTH_CAP);
    const unemploymentBase = Math.min(
        insuranceSalary,
        getUnemploymentInsuranceCap(regionMinimumSalary)
    );

    const socialInsurance = socialHealthBase * 0.08;
    const healthInsurance = socialHealthBase * 0.015;
    const unemploymentInsurance = unemploymentBase * 0.01;

    return {
        socialInsurance,
        healthInsurance,
        unemploymentInsurance,
        totalInsurance: socialInsurance + healthInsurance + unemploymentInsurance
    };
}

function calculatePersonalIncomeTaxOnly() {
    clearTaxErrors();

    const taxInputIncome = document.getElementById("taxInputIncome");
    const taxInputInsurance = document.getElementById("taxInputInsurance");

    const incomeWrap = taxInputIncome?.closest(".tax-input-wrap");
    const insuranceWrap = taxInputInsurance?.closest(".tax-input-wrap");

    const gross = getTaxNumberValue("taxInputIncome");
    const dependents = getTaxNumberValue("taxInputDependents");
    const insuranceType = document.querySelector('input[name="tax_insurance"]:checked')?.value;
    const customInsuranceSalary = getTaxNumberValue("taxInputInsurance");
    const minimumInsuranceSalary = getTaxMinimumInsuranceSalaryByRegion();

    if (gross <= 0) {
        showTaxInputError(taxInputIncome, incomeWrap, "Vui lòng nhập Thu Nhập (Gross)");
        return;
    }

    let insuranceSalary = gross;
    let insuranceWarning = "";

    if (insuranceType === "chinh_thuc") {
        if (gross < minimumInsuranceSalary) {
            insuranceSalary = minimumInsuranceSalary;
            insuranceWarning = "Lương thấp hơn lương tối thiểu vùng nên bảo hiểm sẽ được tính theo lương tối thiểu vùng";
        }
    } else if (insuranceType === "khac") {
        if (customInsuranceSalary <= 0) {
            showTaxInputError(taxInputInsurance, insuranceWrap, "Vui lòng nhập số tiền đóng bảo hiểm");
            return;
        }

        if (customInsuranceSalary < minimumInsuranceSalary) {
            showTaxInputError(taxInputInsurance, insuranceWrap, "Không thấp hơn lương tối thiểu vùng");
            return;
        }

        if (customInsuranceSalary > gross) {
            showTaxInputError(taxInputInsurance, insuranceWrap, "Không được lớn hơn Thu Nhập");
            return;
        }

        insuranceSalary = customInsuranceSalary;
    }

    const insurance = calculateTaxInsurance(insuranceSalary, minimumInsuranceSalary);

    const incomeBeforeTax = gross - insurance.totalInsurance;
    const totalDependentDeduction = dependents * DEPENDENT_DEDUCTION_2026;
    let taxableIncome = incomeBeforeTax - PERSONAL_DEDUCTION_2026 - totalDependentDeduction;

    if (taxableIncome < 0) {
        taxableIncome = 0;
    }

    const personalTaxResult = calculatePersonalTax(taxableIncome);

    renderTaxResult({
        gross,
        socialInsurance: insurance.socialInsurance,
        healthInsurance: insurance.healthInsurance,
        unemploymentInsurance: insurance.unemploymentInsurance,
        incomeBeforeTax,
        personalDeduction: PERSONAL_DEDUCTION_2026,
        dependentDeduction: totalDependentDeduction,
        taxableIncome,
        personalTax: personalTaxResult.totalTax,
        detailRows: personalTaxResult.details,
        insuranceWarning
    });
}

function renderTaxResult(data) {
    const taxResultArea = document.getElementById("taxResultArea");
    if (!taxResultArea) return;

    taxResultArea.classList.add("active");

    taxResultArea.innerHTML = `
        <div class="tax-section">
            <table class="tax-table">
                <tbody>
                    <tr class="bold-row">
                        <td>Lương GROSS</td>
                        <td>${formatMoney(data.gross)}</td>
                    </tr>
                    <tr>
                        <td>Bảo hiểm xã hội (8%)</td>
                        <td>${formatMoney(data.socialInsurance)}</td>
                    </tr>
                    <tr>
                        <td>Bảo hiểm y tế (1.5%)</td>
                        <td>${formatMoney(data.healthInsurance)}</td>
                    </tr>
                    <tr>
                        <td>Bảo hiểm thất nghiệp (1%)</td>
                        <td>${formatMoney(data.unemploymentInsurance)}</td>
                    </tr>
                    <tr class="bold-row">
                        <td>Thu nhập trước thuế</td>
                        <td>${formatMoney(data.incomeBeforeTax)}</td>
                    </tr>
                    <tr>
                        <td>Giảm trừ gia cảnh bản thân</td>
                        <td>${formatMoney(data.personalDeduction)}</td>
                    </tr>
                    <tr>
                        <td>Giảm trừ gia cảnh người phụ thuộc</td>
                        <td>${formatMoney(data.dependentDeduction)}</td>
                    </tr>
                    <tr class="bold-row">
                        <td>Thu nhập chịu thuế</td>
                        <td>${formatMoney(data.taxableIncome)}</td>
                    </tr>
                    <tr class="tax-row">
                        <td>Thuế thu nhập cá nhân(*)</td>
                        <td>${formatMoney(data.personalTax)}</td>
                    </tr>
                </tbody>
            </table>
            ${data.insuranceWarning ? `<p class="salary-note" style="color:#e53935; margin-top:10px;">${data.insuranceWarning}</p>` : ""}
        </div>

        <div class="tax-section">
            <h3>(*) Chi tiết thuế thu nhập cá nhân (VND)</h3>
            <table class="tax-table">
                <thead>
                    <tr>
                        <th>Mức chịu thuế</th>
                        <th>Thuế suất</th>
                        <th>Lương chịu thuế</th>
                        <th>Tiền nộp</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.detailRows.map(function (row) {
                        return `
                            <tr>
                                <td>${row.label}</td>
                                <td>${row.rate * 100}%</td>
                                <td>${formatMoney(row.taxable)}</td>
                                <td>${formatMoney(row.tax)}</td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function resetTaxModal() {
    const taxInputIncome = document.getElementById("taxInputIncome");
    const taxInputInsurance = document.getElementById("taxInputInsurance");
    const taxInputDependents = document.getElementById("taxInputDependents");
    const taxResultArea = document.getElementById("taxResultArea");
    const taxCalculateBtn = document.getElementById("taxCalculateBtn");

    const period2026 = document.querySelector('input[name="tax_period"][value="2026"]');
    const insuranceOfficial = document.querySelector('input[name="tax_insurance"][value="chinh_thuc"]');
    const region1 = document.querySelector('input[name="tax_vung"][value="1"]');

    if (taxInputIncome) {
        taxInputIncome.value = "";
        taxInputIncome.placeholder = "VD: 10,000,000";
        taxInputIncome.classList.remove("placeholder-error");
    }

    if (taxInputInsurance) {
        taxInputInsurance.value = "";
        taxInputInsurance.placeholder = "";
        taxInputInsurance.classList.remove("placeholder-error");
    }

    if (taxInputDependents) {
        taxInputDependents.value = "0";
    }

    if (period2026) period2026.checked = true;
    if (insuranceOfficial) insuranceOfficial.checked = true;
    if (region1) region1.checked = true;

    if (taxResultArea) {
        taxResultArea.classList.remove("active");
        taxResultArea.innerHTML = "";
    }

    if (taxCalculateBtn) {
        taxCalculateBtn.disabled = true;
    }

    clearTaxErrors();
}

function setupApplyModal() {
    const applyBtn = document.querySelector(".apply");
    const applyModal = document.getElementById("applyModal");
    const closeApplyModal = document.getElementById("closeApplyModal");
    const cancelApplyModal = document.getElementById("cancelApplyModal");
    const experienceButtons = document.querySelectorAll(".experience-options button");

    const applySubmitBtn = document.getElementById("applySubmitBtn");
    const applyFormError = document.getElementById("applyFormError");
    const applyPolicyCheck = document.getElementById("applyPolicyCheck");
    const applyPhoneInput = document.getElementById("applyPhone");

    if (!applyBtn || !applyModal) {
        return;
    }

    applyBtn.addEventListener("click", function () {
        applyModal.classList.add("active");

        setTimeout(function () {
            const applyBody = applyModal.querySelector(".apply-modal-body");

            if (applyBody) {
                applyBody.scrollTop = 0;
            }
        }, 0);
    });

    function closeModal() {
        applyModal.classList.remove("active");

        if (applyFormError) {
            applyFormError.textContent = "";
        }

        const applyErrorFields = applyModal.querySelectorAll(".apply-error");
        applyErrorFields.forEach(function (field) {
            field.classList.remove("apply-error");
        });
    }

    if (closeApplyModal) {
        closeApplyModal.addEventListener("click", closeModal);
    }

    if (cancelApplyModal) {
        cancelApplyModal.addEventListener("click", closeModal);
    }

    applyModal.addEventListener("click", function (e) {
        if (e.target === applyModal) {
            closeModal();
        }
    });

    if (applyPhoneInput) {
        applyPhoneInput.addEventListener("input", function () {
            applyPhoneInput.value = applyPhoneInput.value.replace(/\D/g, "").slice(0, 10);

            applyPhoneInput.classList.remove("apply-error");

            if (applyFormError) {
                applyFormError.textContent = "";
            }
        });
    }

    experienceButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            experienceButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            const experienceOptions = document.querySelector(".experience-options");

            if (experienceOptions) {
                experienceOptions.classList.remove("apply-error");
            }

            if (applyFormError) {
                applyFormError.textContent = "";
            }
        });
    });

    const applyRequiredInputs = document.querySelectorAll("#applyName, #applyPhone");

    applyRequiredInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            input.classList.remove("apply-error");

            if (applyFormError) {
                applyFormError.textContent = "";
            }
        });
    });

    if (applyPolicyCheck) {
        applyPolicyCheck.addEventListener("change", function () {
            if (applyPolicyCheck.checked && applyFormError) {
                applyFormError.textContent = "";
            }
        });
    }

    if (applySubmitBtn) {
        applySubmitBtn.addEventListener("click", function () {
            const applyName = document.getElementById("applyName");
            const applyPhone = document.getElementById("applyPhone");
            const experienceOptions = document.querySelector(".experience-options");
            const selectedExperience = document.querySelector(".experience-options button.active");

            if (applyName) applyName.classList.remove("apply-error");
            if (applyPhone) applyPhone.classList.remove("apply-error");
            if (experienceOptions) experienceOptions.classList.remove("apply-error");

            const phoneValue = applyPhone ? applyPhone.value.trim() : "";
            const phoneRegex = /^[0-9]{10}$/;

            const isNameEmpty = !applyName || applyName.value.trim() === "";
            const isPhoneEmpty = !applyPhone || phoneValue === "";
            const isPhoneInvalid = !isPhoneEmpty && !phoneRegex.test(phoneValue);
            const isExperienceEmpty = !selectedExperience;

            if (isNameEmpty && applyName) {
                applyName.classList.add("apply-error");
            }

            if ((isPhoneEmpty || isPhoneInvalid) && applyPhone) {
                applyPhone.classList.add("apply-error");
            }

            if (isExperienceEmpty && experienceOptions) {
                experienceOptions.classList.add("apply-error");
            }

            if (isNameEmpty || isPhoneEmpty || isExperienceEmpty) {
                if (applyFormError) {
                    applyFormError.textContent = "Vui lòng nhập đầy đủ thông tin!";
                }

                return;
            }

            if (isPhoneInvalid) {
                if (applyFormError) {
                    applyFormError.textContent = "Số điện thoại không hợp lệ";
                }

                return;
            }

            if (!applyPolicyCheck || !applyPolicyCheck.checked) {
                if (applyFormError) {
                    applyFormError.textContent = "Vui lòng xác nhận đồng ý Chính sách";
                }

                return;
            }

            if (applyFormError) {
                applyFormError.textContent = "";
            }

            applyModal.classList.remove("active");

            const applySuccessModal = document.getElementById("applySuccessModal");

            if (applySuccessModal) {
                applySuccessModal.classList.add("active");
            }
        });
    }
    const applySuccessModal = document.getElementById("applySuccessModal");
    const closeApplySuccessModal = document.getElementById("closeApplySuccessModal");

    function closeSuccessModal() {
        if (applySuccessModal) {
            applySuccessModal.classList.remove("active");
        }
    }

    if (closeApplySuccessModal) {
        closeApplySuccessModal.addEventListener("click", closeSuccessModal);
    }

    if (applySuccessModal) {
        applySuccessModal.addEventListener("click", function (e) {
            if (e.target === applySuccessModal) {
                closeSuccessModal();
            }
        });
    }
}
