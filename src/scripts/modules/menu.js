/* Menu */
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.js-menu-toggle');
  var menu = document.querySelector('.js-menu');
  if (toggle && menu) {
    toggle.addEventListener('change', function () {
      if (toggle.checked) {
        menu.classList.add('is-active');
      } else {
        menu.classList.remove('is-active');
      }
    });
  }
});