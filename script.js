const baseUrl = "https://api.exchangerate-api.com/v4/latest/";

const form = document.querySelector("form");
const amountInput = document.querySelector("input");
const fromCurrency = document.querySelector("select[name='from']");
const toCurrency = document.querySelector("select[name='to']");
const msg = document.querySelector(".msg p");
const fromFlag = document.querySelector(".from img");
const toFlag = document.querySelector(".to img");

// Mapping of currency codes to representative country codes for flags
const currencyToCountry = {
    USD: "US",
    EUR: "DE",
    INR: "IN",
    AUD: "AU"
};

function updateFlag(selectElement, flagElement) {
    const currencyCode = selectElement.value;
    const countryCode = currencyToCountry[currencyCode];
    flagElement.src = `https://flagsapi.com/${countryCode}/shiny/64.png`;
}

// Update flags on currency change
fromCurrency.addEventListener("change", () => updateFlag(fromCurrency, fromFlag));
toCurrency.addEventListener("change", () => updateFlag(toCurrency, toFlag));

// Initial flag load
updateFlag(fromCurrency, fromFlag);
updateFlag(toCurrency, toFlag);

// Handle form submission and fetch exchange rate
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount) || amount <= 0) {
        msg.textContent = "Please enter a valid amount.";
        return;
    }

    try {
        const response = await fetch(`${baseUrl}${from}`);
        if (!response.ok) throw new Error("API error");

        const data = await response.json();
        const rate = data.rates[to];

        if (!rate) {
            msg.textContent = "Conversion rate not available.";
            return;
        }

        const converted = (amount * rate).toFixed(2);
        msg.textContent = `${amount} ${from} = ${converted} ${to}`;
    } catch (error) {
        console.error(error);
        msg.textContent = "Failed to fetch exchange rate.";
    }
});
