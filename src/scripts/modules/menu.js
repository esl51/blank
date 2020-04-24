/* Menu */
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.js-menu-toggle')
  const menu = document.querySelector('.js-menu')
  if (toggle && menu) {
    toggle.addEventListener('change', function () {
      if (toggle.checked) {
        menu.classList.add('is-active')
      } else {
        menu.classList.remove('is-active')
      }
    })
  }
})
