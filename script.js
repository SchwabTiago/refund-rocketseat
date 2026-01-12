const form = document.querySelector("form")
const expenseList = document.querySelector("ul")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const expensesQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")
    value = Number(value) / 100
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })
}

form.onsubmit = (e) => {
    e.preventDefault()

    const newExpanse = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    expenseAdd(newExpanse)
}

function expenseAdd(newExpanse) {
    try {
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpanse.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpanse.category_name)

        const expenseDiv = document.createElement("div")
        expenseDiv.classList.add("expense-info")

        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpanse.expense

        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpanse.category_name

        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        // Mantém o "R$" em <small>, mas o textContent ainda terá tudo e será parseado corretamente
        expenseAmount.innerHTML = `<small>R$</small>${newExpanse.amount
            .toUpperCase()
            .replace("R$", "")
            .trim()}`

        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "Remover")

        expenseDiv.append(expenseName, expenseCategory)
        expenseItem.append(expenseIcon, expenseDiv, expenseAmount, removeIcon)
        expenseList.append(expenseItem)

        updateTotal()
        clearForm()
    } catch (error) {
        alert("Houve um erro no expenseAdd :(")
        console.log(error)
    }
}

function updateTotal() {
    try {
        const itens = expenseList.children
        expensesQuantity.textContent = `${itens.length} ${itens.length > 1 ? "despesas" : "despesa"
            }`

        updateTotalValue()
    } catch (error) {
        alert("Houve um erro no updateTotal :(")
        console.log(error)
    }
}

function updateTotalValue() {
    try {
        let total = 0

        const amounts = expenseList.querySelectorAll(".expense-amount")

        amounts.forEach((amountEl) => {
            // Ex.: "R$1.234,56" (mesmo com <small>) vira "1.234,56"
            const value = amountEl.textContent
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim()

            total += Number(value)
        })

        expenseTotal.textContent = total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })
    } catch (error) {
        alert("Houve um erro ao calcular o total :(")
        console.log(error)
    }
}

function clearForm() {
    expense.value = ""
    category.value = ""
    amount.value = ""
}

expenseList.onclick = (e) => {
    if (e.target.classList.contains("remove-icon")) {
        e.target.parentElement.remove()
        updateTotal()
    }
}
