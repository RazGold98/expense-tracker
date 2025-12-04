let salary = 0;
let savingPlan = 0;
const formExpense = document.getElementById("expense-form");
const formPlan = document.getElementById("setup-form");
const expensesList = document.getElementById("expenses-list");
const totalOutPut = document.getElementById("total");
const clearBtn = document.getElementById("clear-all");
const setupBoxEl = document.getElementById("add-salary");
const allFilter = document.getElementById("all-filter");
const foodFilter = document.getElementById("food-filter");
const rentFilter = document.getElementById("rent-filter");
const otherFilter = document.getElementById("other-filter");
const funFilter = document.getElementById("fun-filter");
const editModal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");
const editTitleInput = document.getElementById("edit-title");
const editAmountInput = document.getElementById("edit-amount");
const editDateInput = document.getElementById("edit-date");
const editCancelBtn = document.getElementById("edit-cancel");

let editingIndex = null;
const transportFilter = document.getElementById("transport-filter");

const setActiveFilter = (btn) => {
  document.querySelectorAll(".filter-btn").forEach((b) => {
    b.classList.remove("filter-active");
  });
  btn.classList.add("filter-active");
};

let expenses = [];

const renderExpenses = (list = expenses) => {
  expensesList.innerHTML = "";
  list.forEach((expense) => {
    const index = expenses.indexOf(expense);
    const li = document.createElement("li");

    li.textContent = `${expense.category} : ${expense.title} - ${
      expense.amount
    }₪ - ${formatDate(expense.date)}`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "EDIT";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "DELETE";

    deleteBtn.addEventListener("click", () => deleteAction(index));
    editBtn.addEventListener("click", () => openEditModal(index));

    expensesList.appendChild(li);
    li.appendChild(deleteBtn);
    li.appendChild(editBtn);
  });
};

const sortExpenses = (category) => {
  let expensesFiltered =
    category === "All"
      ? expenses
      : expenses.filter((expense) => expense.category === category);
  renderExpenses(expensesFiltered);
};

const deleteAction = (index) => {
  expenses = expenses.filter((expense, i) => i !== index);
  renderStorage();
  renderExpenses();
  calcTotal();
  renderSavingStatus();
};

editCancelBtn.addEventListener("click", () => {
  closeEditModal();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (editingIndex === null) return;

  const expense = expenses[editingIndex];

  expense.title = editTitleInput.value;
  expense.amount = Number(editAmountInput.value);
  expense.date = editDateInput.value;

  renderStorage();
  renderExpenses();
  renderSavingStatus();
  closeEditModal();
});

const openEditModal = (index) => {
  editingIndex = index;
  const expense = expenses[index];

  
  editTitleInput.value = expense.title;
  editAmountInput.value = expense.amount;
  editDateInput.value = expense.date; 

  editModal.classList.remove("hidden");
};

const closeEditModal = () => {
  editingIndex = null;
  editModal.classList.add("hidden");
};

const calcTotal = () => {
  const total = expenses.reduce(
    (accumulator, currentValue) => accumulator + currentValue.amount,
    0
  );
  totalOutPut.textContent = `Total: ${total} ₪`;
  return total;
};

const renderStorage = () => {
  const expensesJson = JSON.stringify(expenses);
  localStorage.setItem("expenses", expensesJson);

  localStorage.setItem("salary", salary);
  localStorage.setItem("savingPlan", savingPlan);
};

const storageCheck = () => {
  let savedExpenses = localStorage.getItem("expenses");
  const savedSalary = localStorage.getItem("salary");
  const savedSavingPlan = localStorage.getItem("savingPlan");
  if (savedExpenses !== null) {
    expenses = JSON.parse(savedExpenses);
    renderExpenses();
    calcTotal();
  }
  if (savedSalary) {
    salary = +savedSalary;
  }

  if (savedSavingPlan) {
    savingPlan = +savedSavingPlan;
  }

  if (savedSalary && savedSavingPlan) {
    savingPlan = +savedSavingPlan;
    salary = +savedSalary;
    setupBoxEl.classList.add("fade");
  }

  renderSavingStatus();
};

formExpense.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const amount = +document.getElementById("amount").value;
  const date = document.getElementById("date").value;
  const category = capitalize(document.getElementById("category").value);

  const expense = {
    title: title,
    amount: amount,
    date: date,
    category: category,
  };
  expenses.push(expense);
  renderStorage();
  calcTotal();
  renderExpenses();
  renderSavingStatus();
  formExpense.reset();
});

formPlan.addEventListener("submit", (e) => {
  e.preventDefault();
  salary = +document.getElementById("salary").value;
  savingPlan = +document.getElementById("saving").value;
  if (savingPlan > salary) {
    alert("YOU CANT SAVE MORE THEN YOU MAKE");
    return;
  }
  renderStorage();
  renderSavingStatus();
  setupBoxEl.classList.add("fade");
  formPlan.reset();
});

const renderSavingStatus = () => {
  const totalSpending = calcTotal();
  currentMoney = salary - savingPlan - totalSpending;
  const savingStatusEl = document.getElementById("status");
  if (currentMoney <= 0) {
    savingStatusEl.innerHTML = `
      ${totalSpending} 
     / ${salary - savingPlan} ₪ Already was spend <br>
     You are an exception of ${currentMoney}`;
    return;
  }
  savingStatusEl.innerHTML = `${
    salary - savingPlan
  } / ${totalSpending} ₪ Already was spend, <br>  
  you got ${salary - savingPlan - totalSpending} left to spend.`;
};

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const clearAll = () => {
  localStorage.clear();
  salary = 0;
  savingPlan = 0;
  expenses = [];

  renderExpenses();
  calcTotal();
  renderSavingStatus();
  setupBoxEl.classList.remove("fade");
};

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

clearBtn.addEventListener("click", clearAll);

allFilter.addEventListener("click", (e) => {
  setActiveFilter(e.target);
  sortExpenses("All");
});
foodFilter.addEventListener("click", (e) => {
  setActiveFilter(e.target);
  sortExpenses("Food");
});
rentFilter.addEventListener("click", (e) => {
  setActiveFilter(e.target);
  sortExpenses("Rent");
});
transportFilter.addEventListener("click", (e) => {
  setActiveFilter(e.target);
  sortExpenses("Transport");
});
funFilter.addEventListener("click", (e) => {
  setActiveFilter(e.target);
  sortExpenses("Fun");
});
otherFilter.addEventListener("click", (e) => {
  setActiveFilter(e.target);
  sortExpenses("Other");
});

storageCheck();
setActiveFilter(allFilter);
