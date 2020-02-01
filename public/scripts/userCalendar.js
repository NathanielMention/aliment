logOut.addEventListener("submit", e => {
  fetch("http://127.0.0.1:3000/logout", {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      return res.json();
    })
    .then(() => {
      window.location.href = "/login";
    });
});
