const menuIcon = document.getElementById("menu");
  const menuList = document.querySelector(".menu");

  menuIcon.addEventListener("click", () => {
    menuList.classList.toggle("show");
  });

  document.querySelectorAll(".item-menu a").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) {
        menuList.classList.remove("show");
      }
    });
  });