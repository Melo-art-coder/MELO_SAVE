function meloToast(title, message, type = "success") {

    const oldToast = document.querySelector(".melo-toast");

    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");

    toast.className = `melo-toast ${type}`;

    toast.innerHTML = `
        <div class="toast-icon">
            ${type === "success" ? "💜" :
              type === "error" ? "❌" :
              type === "warning" ? "⚠️" : "ℹ️"}
        </div>

        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => toast.remove(), 300);

    }, 3500);

}