// ============================================================
// PERSONAL FINANCE TRACKER - COMPLETE SCRIPT
// ============================================================


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let transactions = [];
let editedTransaction = null;
let expensePieChart = null;


// ============================================================
// DOM CONTENT LOADED
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    // Active navigation
    initializeNavigation();

    // Keyboard navigation
    initKeyboardNavigation();

    // Keyboard shortcuts
    initKeyboardShortcuts();

    // Mobile menu
    initializeMobileMenu();

    // Invite email
    initializeInviteEmail();

    // Search
    initializeSearch();

    // Transaction page
    initializeTransactionPage();
});


// ============================================================
// NAVIGATION
// ============================================================

function initializeNavigation() {

    const currentPath = window.location.pathname;
    const currentPage =
        currentPath.split("/").pop() || "index.html";

    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(function (link) {
        link.classList.remove("active");
    });

    if (
        currentPage === "index.html" ||
        currentPage === ""
    ) {

        const homeLink = document.querySelector(
            '.nav-links a[href="#"], .nav-links a[href="./index.html"]'
        );

        if (homeLink) {
            homeLink.classList.add("active");
        }

    } else if (currentPage === "support.html") {

        const supportLink = document.querySelector(
            '.nav-links a[href="./support.html"]'
        );

        if (supportLink) {
            supportLink.classList.add("active");
        }

    } else if (currentPage === "login.html") {

        const homeLink = document.querySelector(
            '.nav-links a[href="./index.html"]'
        );

        if (homeLink) {
            homeLink.classList.add("active");
        }

    } else if (currentPage === "sign-up.html") {

        const homeLink = document.querySelector(
            '.nav-links a[href="./index.html"]'
        );

        if (homeLink) {
            homeLink.classList.add("active");
        }
    }
}


// ============================================================
// MOBILE MENU
// ============================================================

function initializeMobileMenu() {

    const menuToggle =
        document.getElementById("menu-toggle");

    const navLinksContainer =
        document.querySelector(".nav-links");

    const navLinks =
        document.querySelectorAll(".nav-links a");

    if (!menuToggle || !navLinksContainer) {
        return;
    }

    menuToggle.addEventListener("click", function () {

        navLinksContainer.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (!icon) {
            return;
        }

        if (navLinksContainer.classList.contains("active")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");

        } else {

            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });


    // Close menu when clicking a link

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinksContainer.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }
        });
    });


    // Close menu when clicking outside

    document.addEventListener("click", function (event) {

        if (
            !menuToggle.contains(event.target) &&
            !navLinksContainer.contains(event.target)
        ) {

            navLinksContainer.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-times");
                icon.classList.add("fa-bars");
            }
        }
    });
}


// ============================================================
// TRANSACTION PAGE INITIALIZATION
// ============================================================

function initializeTransactionPage() {

    const transactionTable =
        document.getElementById("transaction-table");

    const balanceElement =
        document.getElementById("balance");

    // If this is not the tracker page,
    // don't execute tracker-specific code.

    if (!transactionTable && !balanceElement) {
        return;
    }


    // Table scroll
    initializeTableScroll();


    // Add transaction button

    const addButton =
        document.getElementById("add-transaction-btn");

    if (addButton) {

        addButton.addEventListener(
            "click",
            addTransaction
        );
    }


    // Save transaction button

    const saveButton =
        document.getElementById("save-transaction-btn");

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveTransaction
        );

        saveButton.style.display = "none";
    }


    // Initial display

    updateBalance();
    updateTransactionTable();
    updateExpensePieChart();
}


// ============================================================
// TABLE SCROLL
// ============================================================

function initializeTableScroll() {

    const tablePart =
        document.querySelector(".table-part");

    const transactionTable =
        document.getElementById("transaction-table");

    if (!tablePart || !transactionTable) {
        return;
    }


    function checkTableScroll() {

        if (!transactionTable) {
            return;
        }

        const rowCount =
            transactionTable.rows.length - 1;

        const maxRowCount = 10;

        if (rowCount > maxRowCount) {

            tablePart.classList.add("scrollable");

        } else {

            tablePart.classList.remove("scrollable");
        }
    }


    checkTableScroll();


    const observer =
        new MutationObserver(checkTableScroll);

    observer.observe(transactionTable, {
        childList: true,
        subtree: true
    });
}


// ============================================================
// ADD TRANSACTION
// ============================================================

function addTransaction() {

    const descriptionInput =
        document.getElementById("description");

    const amountInput =
        document.getElementById("amount");

    const typeInput =
        document.getElementById("type");

    const dateInput =
        document.getElementById("date");


    if (
        !descriptionInput ||
        !amountInput ||
        !typeInput ||
        !dateInput
    ) {
        return;
    }


    const description =
        descriptionInput.value.trim();

    const amount =
        parseFloat(amountInput.value);

    const type =
        typeInput.value;

    const dateValue =
        dateInput.value;


    // Validate

    if (
        description === "" ||
        isNaN(amount) ||
        amount <= 0 ||
        dateValue === ""
    ) {

        showNotification(
            "Please enter valid transaction details.",
            "error"
        );

        return;
    }


    const chosenDate =
        new Date(dateValue);


    if (isNaN(chosenDate.getTime())) {

        showNotification(
            "Please select a valid date.",
            "error"
        );

        return;
    }


    // Create unique ID

    const transaction = {

        primeId:
            Date.now(),

        description:
            description,

        amount:
            amount,

        type:
            type,

        // For now we use description as category
        // because your HTML doesn't have a category field.

        category:
            description
    };


    // Add transaction

    transactions.push(transaction);


    // Clear fields

    descriptionInput.value = "";
    amountInput.value = "";
    dateInput.value = "";


    // Update everything

    updateBalance();
    updateTransactionTable();
    updateExpensePieChart();


    showNotification(
        "Transaction added successfully!",
        "success"
    );
}


// ============================================================
// DELETE TRANSACTION
// ============================================================

function deleteTransaction(primeId) {

    const index =
        transactions.findIndex(
            function (transaction) {
                return transaction.primeId === primeId;
            }
        );


    if (index === -1) {
        return;
    }


    transactions.splice(index, 1);


    // If deleted transaction was being edited

    if (
        editedTransaction &&
        editedTransaction.primeId === primeId
    ) {

        editedTransaction = null;

        const addButton =
            document.getElementById(
                "add-transaction-btn"
            );

        const saveButton =
            document.getElementById(
                "save-transaction-btn"
            );

        if (addButton) {
            addButton.style.display =
                "inline-block";
        }

        if (saveButton) {
            saveButton.style.display =
                "none";
        }
    }


    updateBalance();
    updateTransactionTable();
    updateExpensePieChart();


    showNotification(
        "Transaction deleted successfully!",
        "success"
    );
}


// ============================================================
// EDIT TRANSACTION
// ============================================================

function editTransaction(primeId) {

    const transaction =
        transactions.find(
            function (transaction) {
                return transaction.primeId === primeId;
            }
        );


    if (!transaction) {
        return;
    }


    const descriptionInput =
        document.getElementById("description");

    const amountInput =
        document.getElementById("amount");

    const typeInput =
        document.getElementById("type");

    const dateInput =
        document.getElementById("date");


    if (
        !descriptionInput ||
        !amountInput ||
        !typeInput ||
        !dateInput
    ) {
        return;
    }


    // Fill form

    descriptionInput.value =
        transaction.description;

    amountInput.value =
        transaction.amount;

    typeInput.value =
        transaction.type;


    // Set date

    const chosenDate =
        new Date(transaction.primeId);


    if (!isNaN(chosenDate.getTime())) {

        const year =
            chosenDate.getFullYear();

        const month =
            String(
                chosenDate.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                chosenDate.getDate()
            ).padStart(2, "0");


        dateInput.value =
            `${year}-${month}-${day}`;
    }


    // Store transaction being edited

    editedTransaction =
        transaction;


    // Button visibility

    const addButton =
        document.getElementById(
            "add-transaction-btn"
        );

    const saveButton =
        document.getElementById(
            "save-transaction-btn"
        );


    if (addButton) {
        addButton.style.display =
            "none";
    }

    if (saveButton) {
        saveButton.style.display =
            "inline-block";
    }


    showNotification(
        "Edit the transaction and click Save.",
        "info"
    );
}


// ============================================================
// SAVE EDITED TRANSACTION
// ============================================================

function saveTransaction() {

    if (!editedTransaction) {

        showNotification(
            "Please select a transaction to edit.",
            "error"
        );

        return;
    }


    const descriptionInput =
        document.getElementById("description");

    const amountInput =
        document.getElementById("amount");

    const typeInput =
        document.getElementById("type");

    const dateInput =
        document.getElementById("date");


    if (
        !descriptionInput ||
        !amountInput ||
        !typeInput ||
        !dateInput
    ) {
        return;
    }


    const description =
        descriptionInput.value.trim();

    const amount =
        parseFloat(amountInput.value);

    const type =
        typeInput.value;

    const dateValue =
        dateInput.value;


    // Validate

    if (
        description === "" ||
        isNaN(amount) ||
        amount <= 0 ||
        dateValue === ""
    ) {

        showNotification(
            "Please enter valid transaction details.",
            "error"
        );

        return;
    }


    const chosenDate =
        new Date(dateValue);


    if (isNaN(chosenDate.getTime())) {

        showNotification(
            "Please select a valid date.",
            "error"
        );

        return;
    }


    // Update transaction

    editedTransaction.description =
        description;

    editedTransaction.amount =
        amount;

    editedTransaction.type =
        type;

    editedTransaction.category =
        description;

    /*
       We don't use the date timestamp as the unique ID anymore.
       Otherwise two transactions on the same date could get
       the same ID.
    */

    editedTransaction.date =
        dateValue;


    // Clear fields

    descriptionInput.value = "";
    amountInput.value = "";
    dateInput.value = "";


    // Reset editing

    editedTransaction = null;


    // Reset buttons

    const addButton =
        document.getElementById(
            "add-transaction-btn"
        );

    const saveButton =
        document.getElementById(
            "save-transaction-btn"
        );


    if (addButton) {
        addButton.style.display =
            "inline-block";
    }

    if (saveButton) {
        saveButton.style.display =
            "none";
    }


    // Update

    updateBalance();
    updateTransactionTable();
    updateExpensePieChart();


    showNotification(
        "Transaction updated successfully!",
        "success"
    );
}


// ============================================================
// UPDATE BALANCE
// ============================================================

function updateBalance() {

    const balanceElement =
        document.getElementById("balance");

    const currencySelect =
        document.getElementById("currency");


    if (!balanceElement) {
        return;
    }


    let balance = 0;


    transactions.forEach(
        function (transaction) {

            const amount =
                Number(transaction.amount) || 0;


            if (transaction.type === "income") {

                balance += amount;

            } else if (
                transaction.type === "expense"
            ) {

                balance -= amount;
            }
        }
    );


    let currencyCode = "INR";


    if (currencySelect) {

        currencyCode =
            currencySelect.value;
    }


    const formattedBalance =
        formatCurrency(
            balance,
            currencyCode
        );


    balanceElement.textContent =
        formattedBalance;


    // Positive / negative class

    if (balance < 0) {

        balanceElement.classList.remove(
            "positive-balance"
        );

        balanceElement.classList.add(
            "negative-balance"
        );

    } else {

        balanceElement.classList.remove(
            "negative-balance"
        );

        balanceElement.classList.add(
            "positive-balance"
        );
    }
}


// ============================================================
// FORMAT CURRENCY
// ============================================================

function formatCurrency(
    amount,
    currencyCode
) {

    const currencySymbols = {

        USD: "$",

        EUR: "€",

        INR: "₹"
    };


    const decimalSeparators = {

        USD: ".",

        EUR: ",",

        INR: "."
    };


    const symbol =
        currencySymbols[currencyCode] || "";

    const decimalSeparator =
        decimalSeparators[currencyCode] || ".";


    const numericAmount =
        Number(amount) || 0;


    const formattedAmount =
        numericAmount
            .toFixed(2)
            .replace(
                ".",
                decimalSeparator
            );


    return symbol + formattedAmount;
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(date) {

    if (
        !date ||
        isNaN(date.getTime())
    ) {
        return "";
    }


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const year =
        date.getFullYear();


    return `${day}/${month}/${year}`;
}


// ============================================================
// GET TRANSACTION DATE
// ============================================================

function getTransactionDate(transaction) {

    // New transactions can have date property

    if (transaction.date) {

        const date =
            new Date(transaction.date);

        if (!isNaN(date.getTime())) {
            return date;
        }
    }


    // Backward compatibility with old transactions

    if (transaction.primeId) {

        const date =
            new Date(transaction.primeId);

        if (!isNaN(date.getTime())) {
            return date;
        }
    }


    return null;
}


// ============================================================
// UPDATE TRANSACTION TABLE
// ============================================================

function updateTransactionTable() {

    const transactionTable =
        document.getElementById(
            "transaction-table"
        );


    if (!transactionTable) {
        return;
    }


    // Remove old rows

    while (
        transactionTable.rows.length > 1
    ) {

        transactionTable.deleteRow(1);
    }


    // Add transactions

    transactions.forEach(
        function (transaction) {

            const newRow =
                transactionTable.insertRow();


            // DATE

            const dateCell =
                newRow.insertCell();

            const date =
                getTransactionDate(
                    transaction
                );

            dateCell.textContent =
                formatDate(date);


            // DESCRIPTION

            const descriptionCell =
                newRow.insertCell();

            descriptionCell.textContent =
                transaction.description;


            // AMOUNT

            const amountCell =
                newRow.insertCell();

            const currencySelect =
                document.getElementById(
                    "currency"
                );

            const currencyCode =
                currencySelect
                    ? currencySelect.value
                    : "INR";


            amountCell.textContent =
                formatCurrency(
                    transaction.amount,
                    currencyCode
                );


            // TYPE

            const typeCell =
                newRow.insertCell();

            typeCell.textContent =
                transaction.type;


            // ACTION

            const actionCell =
                newRow.insertCell();


            // EDIT BUTTON

            const editButton =
                document.createElement("button");

            editButton.textContent =
                "Edit";

            editButton.classList.add(
                "edit-button"
            );


            editButton.addEventListener(
                "click",
                function () {

                    editTransaction(
                        transaction.primeId
                    );
                }
            );


            actionCell.appendChild(
                editButton
            );


            // DELETE BUTTON

            const deleteButton =
                document.createElement("button");

            deleteButton.textContent =
                "Delete";

            deleteButton.classList.add(
                "delete-button"
            );


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteTransaction(
                        transaction.primeId
                    );
                }
            );


            actionCell.appendChild(
                deleteButton
            );


            // SAVE BUTTON

            const saveButton =
                document.createElement("button");

            saveButton.textContent =
                "Save";

            saveButton.classList.add(
                "save-button"
            );


            saveButton.addEventListener(
                "click",
                function () {

                    /*
                       First select this transaction
                       for editing, then save it.
                    */

                    editTransaction(
                        transaction.primeId
                    );
                }
            );


            actionCell.appendChild(
                saveButton
            );
        }
    );


    // Update table scroll

    const tablePart =
        document.querySelector(".table-part");


    if (tablePart) {

        const rowCount =
            transactionTable.rows.length - 1;


        if (rowCount > 10) {

            tablePart.classList.add(
                "scrollable"
            );

        } else {

            tablePart.classList.remove(
                "scrollable"
            );
        }
    }


    // IMPORTANT:
    // Update pie chart whenever table changes

    updateExpensePieChart();
}


// ============================================================
// EXPENSE PIE CHART
// ============================================================

function updateExpensePieChart() {

    const chartCanvas =
        document.getElementById(
            "expensePieChart"
        );


    // If chart doesn't exist on current page

    if (!chartCanvas) {
        return;
    }


    // Check Chart.js

    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js is not loaded."
        );

        return;
    }


    // Only expenses

    const expenses =
        transactions.filter(
            function (transaction) {

                return (
                    transaction.type ===
                    "expense"
                );
            }
        );


    // If there are no expenses

    if (expenses.length === 0) {

        if (expensePieChart) {

            expensePieChart.destroy();

            expensePieChart = null;
        }


        return;
    }


    // Group expenses

    const categoryTotals = {};


    expenses.forEach(
        function (transaction) {

            /*
               Your current HTML does not have
               a category field.

               Therefore we use description
               as the category.

               Example:

               food   → Food
               ration → Ration
            */

            const category =
                transaction.category ||
                transaction.description ||
                "Other";


            const amount =
                Number(transaction.amount) || 0;


            if (!categoryTotals[category]) {

                categoryTotals[category] = 0;
            }


            categoryTotals[category] +=
                amount;
        }
    );


    const categories =
        Object.keys(categoryTotals);


    const amounts =
        Object.values(categoryTotals);


    // Destroy previous chart

    if (expensePieChart) {

        expensePieChart.destroy();

        expensePieChart = null;
    }


    // Create new chart

    expensePieChart =
        new Chart(
            chartCanvas,
            {
                type: "pie",

                data: {

                    labels: categories,

                    datasets: [
                        {
                            label: "Expenses",

                            data: amounts,

                            borderWidth: 2,

                            borderColor:
                                "#ffffff"
                        }
                    ]
                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                padding: 20,

                                font: {
                                    size: 14
                                }
                            }
                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function (context) {

                                        const value =
                                            Number(
                                                context.raw
                                            ) || 0;


                                        const currencySelect =
                                            document.getElementById(
                                                "currency"
                                            );


                                        const currencyCode =
                                            currencySelect
                                                ? currencySelect.value
                                                : "INR";


                                        return (
                                            context.label +
                                            ": " +
                                            formatCurrency(
                                                value,
                                                currencyCode
                                            )
                                        );
                                    }
                            }
                        }
                    }
                }
            }
        );
}


// ============================================================
// CURRENCY CHANGE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const currencySelect =
            document.getElementById(
                "currency"
            );


        if (currencySelect) {

            currencySelect.addEventListener(
                "change",
                function () {

                    updateBalance();

                    updateTransactionTable();

                    updateExpensePieChart();
                }
            );
        }
    }
);


// ============================================================
// EXPORT
// ============================================================

function handleDownload() {

    const input =
        prompt(
            "Select export format: PDF or CSV"
        );


    // User pressed Cancel

    if (!input) {
        return;
    }


    const exportFormat =
        input.trim().toLowerCase();


    if (exportFormat === "pdf") {

        exportToPDF();

    } else if (exportFormat === "csv") {

        exportToCSV();

    } else {

        showNotification(
            'Invalid export format. Please enter either "PDF" or "CSV".',
            "error"
        );
    }
}


// ============================================================
// EXPORT TO PDF
// ============================================================

function exportToPDF() {

    if (
        typeof pdfMake === "undefined"
    ) {

        showNotification(
            "PDF library is not loaded.",
            "error"
        );

        return;
    }


    const docDefinition = {

        content: [

            {
                text: "Personal Finance Tracker",
                style: "title",
                margin: [0, 0, 0, 15]
            },

            {
                table: {

                    headerRows: 1,

                    widths: [
                        "auto",
                        "*",
                        "auto",
                        "auto"
                    ],

                    body: [

                        [
                            {
                                text: "Date",
                                style: "header"
                            },

                            {
                                text: "Description",
                                style: "header"
                            },

                            {
                                text: "Amount",
                                style: "header"
                            },

                            {
                                text: "Type",
                                style: "header"
                            }
                        ],


                        ...transactions.map(
                            function (transaction) {

                                const date =
                                    formatDate(
                                        getTransactionDate(
                                            transaction
                                        )
                                    );


                                const description =
                                    transaction.description;


                                const amount =
                                    transaction.amount;


                                const type =
                                    transaction.type;


                                return [
                                    date,
                                    description,
                                    amount.toString(),
                                    type
                                ];
                            }
                        )
                    ]
                }
            }
        ],


        styles: {

            title: {

                fontSize: 18,

                bold: true
            },


            header: {

                fontSize: 12,

                bold: true,

                margin: [0, 5]
            }
        }
    };


    pdfMake
        .createPdf(docDefinition)
        .download(
            "transactions.pdf"
        );
}


// ============================================================
// EXPORT TO CSV
// ============================================================

function exportToCSV() {

    if (transactions.length === 0) {

        showNotification(
            "There are no transactions to export.",
            "error"
        );

        return;
    }


    const rows = [];


    // Header

    rows.push(
        [
            "Date",
            "Description",
            "Amount",
            "Type"
        ]
    );


    // Data

    transactions.forEach(
        function (transaction) {

            const date =
                formatDate(
                    getTransactionDate(
                        transaction
                    )
                );


            const description =
                transaction.description;


            const amount =
                transaction.amount;


            const type =
                transaction.type;


            rows.push(
                [
                    date,
                    description,
                    amount,
                    type
                ]
            );
        }
    );


    // Convert to CSV

    const csvContent =
        rows
            .map(
                function (row) {

                    return row
                        .map(
                            function (value) {

                                const text =
                                    String(
                                        value
                                    ).replace(
                                        /"/g,
                                        '""'
                                    );


                                return `"${text}"`;
                            }
                        )
                        .join(",");
                }
            )
            .join("\n");


    // Create file

    const blob =
        new Blob(
            [csvContent],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const link =
        document.createElement("a");


    link.href =
        URL.createObjectURL(blob);


    link.download =
        "transactions.csv";


    document.body.appendChild(link);


    link.click();


    document.body.removeChild(link);


    URL.revokeObjectURL(link.href);
}


// ============================================================
// EMAIL INVITE
// ============================================================

function initializeInviteEmail() {

    const emailInput =
        document.getElementById(
            "invite-email"
        );


    if (!emailInput) {
        return;
    }


    emailInput.addEventListener(
        "keypress",
        function (event) {

            if (event.key === "Enter") {

                sendEmailInvite();
            }
        }
    );
}


function sendEmailInvite() {

    const emailInput =
        document.getElementById(
            "invite-email"
        );


    if (!emailInput) {
        return;
    }


    const email =
        emailInput.value.trim();


    if (!email) {

        showNotification(
            "Please enter an email address.",
            "error"
        );

        return;
    }


    if (!isValidEmail(email)) {

        showNotification(
            "Please enter a valid email address.",
            "error"
        );

        return;
    }


    const subject =
        "Join our Personal Finance Tracker community!";


    const body =
        `Hi! I've been using this Personal Finance Tracker app to manage my finances. It helps track income, expenses, and manage your budget effectively. Check it out: ${window.location.href}`;


    const mailtoLink =
        `mailto:${email}?subject=${encodeURIComponent(
            subject
        )}&body=${encodeURIComponent(
            body
        )}`;


    window.location.href =
        mailtoLink;


    emailInput.value = "";


    showNotification(
        "Community invite sent!",
        "success"
    );
}


// ============================================================
// LINKEDIN SHARE
// ============================================================

function shareOnLinkedIn() {

    const url =
        encodeURIComponent(
            window.location.href
        );


    const linkedinUrl =
        `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;


    window.open(
        linkedinUrl,
        "linkedin-share",
        "width=600,height=400,scrollbars=yes,resizable=yes"
    );


    showNotification(
        "LinkedIn share opened!",
        "success"
    );
}


// ============================================================
// TWITTER SHARE
// ============================================================

function shareOnTwitter() {

    const url =
        encodeURIComponent(
            window.location.href
        );


    const text =
        encodeURIComponent(
            "Join our Personal Finance Tracker community! Track your finances effortlessly."
        );


    const twitterUrl =
        `https://twitter.com/intent/tweet?url=${url}&text=${text}`;


    window.open(
        twitterUrl,
        "twitter-share",
        "width=600,height=400,scrollbars=yes,resizable=yes"
    );


    showNotification(
        "Community share opened!",
        "success"
    );
}


// ============================================================
// EMAIL VALIDATION
// ============================================================

function isValidEmail(email) {

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return emailRegex.test(email);
}


// ============================================================
// NOTIFICATION
// ============================================================

function showNotification(
    message,
    type = "info"
) {

    const notification =
        document.createElement("div");


    notification.className =
        `notification notification-${type}`;


    notification.textContent =
        message;


    let background =
        "#17a2b8";


    if (type === "success") {

        background =
            "#28a745";

    } else if (type === "error") {

        background =
            "#dc3545";
    }


    notification.style.cssText =
        `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${background};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        max-width: 350px;
        `;


    // Add animation styles

    if (
        !document.getElementById(
            "notification-styles"
        )
    ) {

        const style =
            document.createElement("style");


        style.id =
            "notification-styles";


        style.textContent =
            `
            @keyframes slideIn {

                from {
                    transform: translateX(100%);
                    opacity: 0;
                }

                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {

                from {
                    transform: translateX(0);
                    opacity: 1;
                }

                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            @keyframes slideInRight {

                from {
                    transform: translateX(100%);
                    opacity: 0;
                }

                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {

                from {
                    transform: translateX(0);
                    opacity: 1;
                }

                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }

            @keyframes fadeInUp {

                from {
                    opacity: 0;
                    transform: translateY(10px);
                }

                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            `;


        document.head.appendChild(style);
    }


    document.body.appendChild(
        notification
    );


    setTimeout(
        function () {

            notification.style.animation =
                "slideOut 0.3s ease-in";


            setTimeout(
                function () {

                    if (
                        notification.parentNode
                    ) {

                        notification.parentNode.removeChild(
                            notification
                        );
                    }
                },
                300
            );

        },
        3000
    );
}


// ============================================================
// SEARCH INITIALIZATION
// ============================================================

function initializeSearch() {

    const searchInput =
        document.getElementById(
            "search-input"
        );


    if (!searchInput) {
        return;
    }


    // Keyboard shortcut

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                (event.metaKey ||
                    event.ctrlKey) &&
                event.key.toLowerCase() === "k" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                event.stopPropagation();

                searchInput.focus();

                searchInput.select();

                searchInput.style.borderColor =
                    "#0b0081";


                setTimeout(
                    function () {

                        searchInput.style.borderColor =
                            "";
                    },
                    1000
                );
            }


            // Ctrl + Shift + K

            if (
                event.ctrlKey &&
                event.shiftKey &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                event.stopPropagation();

                searchInput.focus();

                searchInput.select();

                searchInput.style.borderColor =
                    "#0b0081";


                setTimeout(
                    function () {

                        searchInput.style.borderColor =
                            "";
                    },
                    1000
                );
            }
        },
        true
    );


    // Search input

    searchInput.addEventListener(
        "input",
        function (event) {

            const query =
                event.target.value
                    .toLowerCase()
                    .trim();


            if (query.length > 2) {

                performSearch(query);

            } else if (
                query.length === 0
            ) {

                clearSearchHighlights();
                hideSearchResults();
            }
        }
    );


    // Enter

    searchInput.addEventListener(
        "keypress",
        function (event) {

            if (event.key === "Enter") {

                const query =
                    event.target.value
                        .toLowerCase()
                        .trim();


                if (query.length > 0) {

                    performSearch(query);
                }
            }
        }
    );
}


// ============================================================
// SEARCH
// ============================================================

function performSearch(query) {

    clearSearchHighlights();


    const searchableElements =
        document.querySelectorAll(
            "h1, h2, h3, h4, h5, h6, p, span, a, li, td, th, button, input[placeholder]"
        );


    let foundResults = false;

    let firstResult = null;

    const searchResults = [];


    searchableElements.forEach(
        function (element) {

            const text =
                element.textContent
                    .toLowerCase();


            const placeholder =
                element.placeholder
                    ? element.placeholder.toLowerCase()
                    : "";


            if (
                text.includes(query) ||
                placeholder.includes(query)
            ) {

                element.classList.add(
                    "search-highlight"
                );


                foundResults = true;


                searchResults.push({

                    element:
                        element,

                    text:
                        element.textContent.trim(),

                    tagName:
                        element.tagName.toLowerCase(),

                    type:
                        element.placeholder
                            ? "input"
                            : element.tagName.toLowerCase()
                });


                if (!firstResult) {

                    firstResult =
                        element;
                }
            }
        }
    );


    if (foundResults) {

        showEnhancedSearchNotification(
            searchResults,
            query,
            "success"
        );


        if (firstResult) {

            setTimeout(
                function () {

                    firstResult.scrollIntoView(
                        {
                            behavior: "smooth",
                            block: "center",
                            inline: "nearest"
                        }
                    );


                    firstResult.classList.add(
                        "search-focus"
                    );


                    setTimeout(
                        function () {

                            firstResult.classList.remove(
                                "search-focus"
                            );
                        },
                        2000
                    );

                },
                300
            );
        }

    } else {

        showEnhancedSearchNotification(
            [],
            query,
            "error"
        );
    }
}


// ============================================================
// CLEAR SEARCH HIGHLIGHTS
// ============================================================

function clearSearchHighlights() {

    const previousHighlights =
        document.querySelectorAll(
            ".search-highlight"
        );


    previousHighlights.forEach(
        function (element) {

            element.classList.remove(
                "search-highlight"
            );
        }
    );
}


// ============================================================
// HIDE SEARCH RESULTS
// ============================================================

function hideSearchResults() {

    const notification =
        document.getElementById(
            "search-notification"
        );


    if (notification) {

        notification.remove();
    }
}


// ============================================================
// SEARCH NOTIFICATION
// ============================================================

function showEnhancedSearchNotification(
    results,
    query,
    type
) {

    const existingNotification =
        document.getElementById(
            "search-notification"
        );


    if (existingNotification) {

        existingNotification.remove();
    }


    const notification =
        document.createElement("div");


    notification.id =
        "search-notification";


    const background =
        type === "success"
            ? "linear-gradient(135deg, #0b0081 0%, #1a1a8a 100%)"
            : "linear-gradient(135deg, #dc3545 0%, #c82333 100%)";


    notification.style.cssText =
        `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${background};
        color: white;
        padding: 20px;
        border-radius: 12px;
        font-size: 14px;
        z-index: 10000;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        max-width: 350px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
        animation: slideInRight 0.3s ease-out;
        `;


    if (
        type === "success" &&
        results.length > 0
    ) {

        notification.innerHTML =
            `
            <div style="
                display:flex;
                align-items:center;
                gap:10px;
                margin-bottom:15px;
            ">

                <i
                    class="fas fa-search"
                    style="
                        color:#f4ff61;
                        font-size:16px;
                    "
                ></i>

                <strong>
                    ${results.length}
                    result${results.length > 1 ? "s" : ""}
                    found
                </strong>

            </div>

            <div style="
                max-height:200px;
                overflow-y:auto;
            ">

                ${results
                    .slice(0, 5)
                    .map(
                        function (result) {

                            const safeText =
                                result.text
                                    .substring(
                                        0,
                                        80
                                    );


                            return `
                                <div style="
                                    padding:10px 0;
                                    border-bottom:
                                    1px solid
                                    rgba(255,255,255,0.1);
                                ">

                                    <div style="
                                        color:#f4ff61;
                                        font-weight:bold;
                                        text-transform:uppercase;
                                        font-size:11px;
                                        margin-bottom:4px;
                                    ">

                                        ${
                                            result.type ===
                                            "input"
                                                ? "INPUT FIELD"
                                                : result.tagName
                                        }

                                    </div>

                                    <div style="
                                        font-size:13px;
                                        opacity:0.9;
                                        line-height:1.4;
                                    ">

                                        ${safeText}

                                        ${
                                            result.text.length > 80
                                                ? "..."
                                                : ""
                                        }

                                    </div>

                                </div>
                            `;
                        }
                    )
                    .join("")}

                ${
                    results.length > 5
                        ? `
                            <div style="
                                text-align:center;
                                margin-top:10px;
                                font-size:12px;
                                opacity:0.7;
                            ">

                                +${results.length - 5}
                                more results

                            </div>
                        `
                        : ""
                }

            </div>
            `;

    } else {

        notification.innerHTML =
            `
            <div style="
                display:flex;
                align-items:center;
                gap:10px;
            ">

                <i
                    class="fas fa-exclamation-triangle"
                    style="
                        color:#ffc107;
                        font-size:16px;
                    "
                ></i>

                <div>

                    <strong>
                        No results found
                    </strong>

                    <div style="
                        font-size:12px;
                        margin-top:4px;
                        opacity:0.8;
                    ">

                        Try different keywords
                        or check spelling

                    </div>

                </div>

            </div>
            `;
    }


    document.body.appendChild(
        notification
    );


    setTimeout(
        function () {

            if (
                notification.parentNode
            ) {

                notification.style.animation =
                    "slideOutRight 0.3s ease-in";


                setTimeout(
                    function () {

                        if (
                            notification.parentNode
                        ) {

                            notification.remove();
                        }
                    },
                    300
                );
            }

        },
        5000
    );
}


// ============================================================
// LOADING STATES
// ============================================================

function showLoadingState(
    element,
    type = "button"
) {

    if (!element) {
        return;
    }


    if (type === "button") {

        element.classList.add(
            "btn-loading"
        );

        element.disabled = true;

    } else if (type === "form") {

        element.classList.add(
            "form-loading"
        );

    } else if (type === "page") {

        element.classList.add(
            "loading"
        );
    }
}


function hideLoadingState(
    element,
    type = "button"
) {

    if (!element) {
        return;
    }


    if (type === "button") {

        element.classList.remove(
            "btn-loading"
        );

        element.disabled = false;

    } else if (type === "form") {

        element.classList.remove(
            "form-loading"
        );

    } else if (type === "page") {

        element.classList.remove(
            "loading"
        );
    }
}


// ============================================================
// FORM SUBMISSION
// ============================================================

function handleFormSubmission(
    form,
    callback
) {

    if (!form) {
        return;
    }


    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );


    if (submitButton) {

        showLoadingState(
            submitButton,
            "button"
        );

        showLoadingState(
            form,
            "form"
        );


        setTimeout(
            function () {

                if (callback) {
                    callback();
                }


                hideLoadingState(
                    submitButton,
                    "button"
                );


                hideLoadingState(
                    form,
                    "form"
                );

            },
            2000
        );
    }
}


// ============================================================
// FORM VALIDATION
// ============================================================

function validateForm(form) {

    if (!form) {

        return {
            isValid: false,
            errors: ["Form not found"]
        };
    }


    const inputs =
        form.querySelectorAll(
            "input[required], select[required], textarea[required]"
        );


    let isValid = true;

    const errors = [];


    inputs.forEach(
        function (input) {

            const value =
                input.value.trim();


            const fieldName =
                input.name ||
                input.id ||
                "field";


            clearFieldError(input);


            // Required

            if (!value) {

                showFieldError(
                    input,
                    `${fieldName} is required`
                );


                errors.push(
                    `${fieldName} is required`
                );


                isValid = false;

                return;
            }


            // Email

            if (
                input.type === "email" &&
                value
            ) {

                if (
                    !isValidEmail(value)
                ) {

                    showFieldError(
                        input,
                        "Please enter a valid email address"
                    );


                    errors.push(
                        "Invalid email format"
                    );


                    isValid = false;
                }
            }


            // Password

            if (
                input.type === "password" &&
                value
            ) {

                if (
                    value.length < 8
                ) {

                    showFieldError(
                        input,
                        "Password must be at least 8 characters long"
                    );


                    errors.push(
                        "Password too short"
                    );


                    isValid = false;
                }
            }


            // Phone

            if (
                input.type === "tel" &&
                value
            ) {

                const phoneRegex =
                    /^\+?[1-9][\d]{0,15}$/;


                const cleanPhone =
                    value.replace(
                        /[\s\-()]/g,
                        ""
                    );


                if (
                    !phoneRegex.test(
                        cleanPhone
                    )
                ) {

                    showFieldError(
                        input,
                        "Please enter a valid phone number"
                    );


                    errors.push(
                        "Invalid phone number"
                    );


                    isValid = false;
                }
            }
        }
    );


    return {
        isValid,
        errors
    };
}


// ============================================================
// FIELD ERROR
// ============================================================

function showFieldError(
    input,
    message
) {

    if (!input) {
        return;
    }


    const errorDiv =
        document.createElement("div");


    errorDiv.className =
        "field-error";


    errorDiv.textContent =
        message;


    errorDiv.style.cssText =
        `
        color:#dc3545;
        font-size:12px;
        margin-top:4px;
        animation:fadeInUp 0.3s ease-out;
        `;


    input.classList.add(
        "error"
    );


    input.style.borderColor =
        "#dc3545";


    if (input.parentNode) {

        input.parentNode.insertBefore(
            errorDiv,
            input.nextSibling
        );
    }
}


function clearFieldError(input) {

    if (!input) {
        return;
    }


    input.classList.remove(
        "error"
    );


    input.style.borderColor =
        "";


    if (input.parentNode) {

        const existingError =
            input.parentNode.querySelector(
                ".field-error"
            );


        if (existingError) {

            existingError.remove();
        }
    }
}


// ============================================================
// SUCCESS MESSAGE
// ============================================================

function showSuccessMessage(
    message
) {

    showNotification(
        message,
        "success"
    );
}


// ============================================================
// ERROR MESSAGE
// ============================================================

function showErrorMessage(
    message
) {

    showNotification(
        message,
        "error"
    );
}


// ============================================================
// KEYBOARD NAVIGATION
// ============================================================

function initKeyboardNavigation() {

    document.addEventListener(
        "keydown",
        function (event) {

            // Tab skip

            if (
                event.key === "Tab" &&
                !event.shiftKey &&
                document.activeElement ===
                    document.body
            ) {

                const mainContent =
                    document.querySelector(
                        "main, .main-content, .section-box"
                    );


                if (mainContent) {

                    mainContent.focus();

                    event.preventDefault();
                }
            }


            // Escape

            if (
                event.key === "Escape"
            ) {

                const navLinks =
                    document.querySelector(
                        ".nav-links"
                    );


                const menuToggle =
                    document.getElementById(
                        "menu-toggle"
                    );


                if (
                    navLinks &&
                    navLinks.classList.contains(
                        "active"
                    )
                ) {

                    navLinks.classList.remove(
                        "active"
                    );


                    if (menuToggle) {

                        const icon =
                            menuToggle.querySelector(
                                "i"
                            );


                        if (icon) {

                            icon.classList.remove(
                                "fa-times"
                            );

                            icon.classList.add(
                                "fa-bars"
                            );
                        }
                    }
                }


                const searchInput =
                    document.getElementById(
                        "search-input"
                    );


                if (
                    searchInput &&
                    document.activeElement ===
                        searchInput
                ) {

                    searchInput.value = "";

                    clearSearchHighlights();

                    hideSearchResults();

                    searchInput.blur();
                }
            }


            // Arrow navigation

            if (
                event.key === "ArrowDown" ||
                event.key === "ArrowUp"
            ) {

                const activeElement =
                    document.activeElement;


                const listItems =
                    Array.from(
                        document.querySelectorAll(
                            "li, .nav-links a, .benefit-item"
                        )
                    );


                const currentIndex =
                    listItems.indexOf(
                        activeElement
                    );


                if (
                    currentIndex !== -1 &&
                    listItems.length > 0
                ) {

                    event.preventDefault();


                    const nextIndex =
                        event.key === "ArrowDown"
                            ? (
                                currentIndex + 1
                            ) %
                                listItems.length
                            : (
                                currentIndex -
                                1 +
                                listItems.length
                            ) %
                                listItems.length;


                    listItems[
                        nextIndex
                    ].focus();
                }
            }
        }
    );


    // Focus trap

    const focusableElements =
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";


    function trapFocus(element) {

        const focusableContent =
            element.querySelectorAll(
                focusableElements
            );


        if (
            focusableContent.length === 0
        ) {
            return;
        }


        const firstFocusableElement =
            focusableContent[0];


        const lastFocusableElement =
            focusableContent[
                focusableContent.length - 1
            ];


        element.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Tab"
                ) {

                    if (
                        event.shiftKey &&
                        document.activeElement ===
                            firstFocusableElement
                    ) {

                        lastFocusableElement.focus();

                        event.preventDefault();

                    } else if (
                        !event.shiftKey &&
                        document.activeElement ===
                            lastFocusableElement
                    ) {

                        firstFocusableElement.focus();

                        event.preventDefault();
                    }
                }
            }
        );
    }


    const navLinks =
        document.querySelector(
            ".nav-links"
        );


    if (navLinks) {

        trapFocus(navLinks);
    }
}


// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

function initKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        function (event) {

            // Alt + H

            if (
                event.altKey &&
                event.key.toLowerCase() === "h"
            ) {

                event.preventDefault();


                const homeLink =
                    document.querySelector(
                        'a[href="#"], a[href="./index.html"]'
                    );


                if (homeLink) {
                    homeLink.click();
                }
            }


            // Alt + S

            if (
                event.altKey &&
                event.key.toLowerCase() === "s"
            ) {

                event.preventDefault();


                const supportLink =
                    document.querySelector(
                        'a[href="./support.html"]'
                    );


                if (supportLink) {
                    supportLink.click();
                }
            }


            // Alt + L

            if (
                event.altKey &&
                event.key.toLowerCase() === "l"
            ) {

                event.preventDefault();


                const loginLink =
                    document.querySelector(
                        'a[href="./login.html"]'
                    );


                if (loginLink) {
                    loginLink.click();
                }
            }


            // Alt + U

            if (
                event.altKey &&
                event.key.toLowerCase() === "u"
            ) {

                event.preventDefault();


                const signupLink =
                    document.querySelector(
                        'a[href="./sign-up.html"]'
                    );


                if (signupLink) {
                    signupLink.click();
                }
            }
        }
    );
}


// ============================================================
// PAGE TRANSITION
// ============================================================

function addPageTransition() {

    document.body.classList.add(
        "page-enter"
    );


    setTimeout(
        function () {

            document.body.classList.remove(
                "page-enter"
            );

        },
        500
    );
}


// ============================================================
// SCROLL TO FIRST SEARCH RESULT
// ============================================================

function scrollToFirstResult() {

    const firstResult =
        document.querySelector(
            ".search-highlight"
        );


    if (firstResult) {

        firstResult.scrollIntoView(
            {
                behavior: "smooth",
                block: "center"
            }
        );
    }
}


// ============================================================
// SIMPLE SEARCH NOTIFICATION
// ============================================================

function showSearchNotification(
    message,
    type = "info"
) {

    showNotification(
        message,
        type
    );
}


// ============================================================
// FEATHER ICONS
// ============================================================

if (
    typeof feather !== "undefined"
) {

    feather.replace();
}