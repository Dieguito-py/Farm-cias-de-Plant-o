document.getElementById("login-tab").addEventListener("click", function () {
    document.getElementById("login-form").classList.add("active");
    document.getElementById("signup-form").classList.remove("active");
    this.classList.add("active");
    document.getElementById("signup-tab").classList.remove("active");
});

document.getElementById("signup-tab").addEventListener("click", function () {
    document.getElementById("signup-form").classList.add("active");
    document.getElementById("login-form").classList.remove("active");
    this.classList.add("active");
    document.getElementById("login-tab").classList.remove("active");
});