const navbarTogglers = document.querySelectorAll('.nav-toggler')

navbarTogglers.forEach((toggler) => {
  toggler.addEventListener('click', () => {
    let target = document.querySelector(toggler.dataset.target)
    target.classList.toggle('show')
  })
})
