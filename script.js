let pieChart;

/* ---------- LOCAL STORAGE HELPERS ---------- */
function saveToLocalStorage(expenses) {
    localStorage.setItem("smartspend_expenses", JSON.stringify(expenses));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem("smartspend_expenses");
    return data ? JSON.parse(data) : [];
}

/* ---------- ADD EXPENSE ---------- */
function addExpense() {
    const amount = document.getElementById("amount").value;
    const description = document.getElementById("description").value;

    if (amount === "" || description === "") {
        alert("Please enter amount and description");
        return;
    }

    fetch("/add-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description })
    })
    .then(res => res.json())
    .then(data => updateUI(data));

    document.getElementById("amount").value = "";
    document.getElementById("description").value = "";
}

/* ---------- UPDATE UI ---------- */
function updateUI(expenses) {
    const table = document.getElementById("expenseTable");
    table.innerHTML = "";

    let categoryTotals = {};
    let totalSpent = 0;

    expenses.forEach(exp => {
        table.innerHTML += `
            <tr>
                <td>${exp.description}</td>
                <td>${exp.category}</td>
                <td>${exp.amount}</td>
            </tr>
        `;

        categoryTotals[exp.category] =
            (categoryTotals[exp.category] || 0) + exp.amount;

        totalSpent += exp.amount;
    });

    drawPieChart(categoryTotals);
    generateInsights(categoryTotals, totalSpent);

    /* 🔥 SAVE DATA */
    saveToLocalStorage(expenses);
}

/* ---------- PIE CHART (FINAL) ---------- */
function drawPieChart(data) {
    const ctx = document.getElementById("pieChart").getContext("2d");

    if (pieChart) pieChart.destroy();

    pieChart = new Chart(ctx, {
        type: "pie",
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "right",
                    labels: {
                        color: "#e5e5e5",
                        boxWidth: 14,
                        padding: 15,
                        font: { size: 13 }
                    }
                }
            }
        },
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: [
                    "#22c55e", // Food
                    "#3b82f6", // Travel
                    "#8b5cf6", // Rent
                    "#ec4899", // Lifestyle
                    "#6366f1", // Entertainment
                    "#f97316", // Shopping
                    "#14b8a6", // Health
                    "#94a3b8"  // Others
                ]
            }]
        }
    });
}

/* ---------- AI BUDGET INSIGHTS ---------- */
function generateInsights(categoryTotals, totalSpent) {
    const insightsDiv = document.getElementById("insights");
    insightsDiv.innerHTML = "";

    if (totalSpent === 0) {
        insightsDiv.innerHTML =
            "<p>No insights yet. Add expenses to see advice.</p>";
        return;
    }

    if (categoryTotals["Food"] && categoryTotals["Food"] / totalSpent > 0.35) {
        insightsDiv.innerHTML +=
            "• High food spending detected. Try reducing online orders.<br>";
    }

    if (categoryTotals["Lifestyle"] && categoryTotals["Lifestyle"] / totalSpent > 0.20) {
        insightsDiv.innerHTML +=
            "• Lifestyle habits like smoking or drinking are impacting savings.<br>";
    }

    if (categoryTotals["Entertainment"] && categoryTotals["Entertainment"] / totalSpent > 0.25) {
        insightsDiv.innerHTML +=
            "• Entertainment expenses are high. Consider setting a weekly cap.<br>";
    }

    if (categoryTotals["Travel"] && categoryTotals["Travel"] / totalSpent > 0.30) {
        insightsDiv.innerHTML +=
            "• Travel costs are significant. Explore cost-effective transport.<br>";
    }

    if (insightsDiv.innerHTML === "") {
        insightsDiv.innerHTML =
            "• Your spending looks balanced. Keep it up! ✅";
    }
}

/* ---------- LOAD SAVED DATA ON PAGE LOAD ---------- */
window.onload = function () {
    const savedExpenses = loadFromLocalStorage();
    if (savedExpenses.length > 0) {
        updateUI(savedExpenses);
    }
};
