const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("../auth/api/logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = "../auth/login.html";
        console.log(result);
      } else {
        alert("Logout failed");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
}
