const themeToggler = document.getElementById('theme-toggler')
const themeStorage = localStorage.getItem('theme')

if(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)){
    document.documentElement.classList.add('dark');
}

function setTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem('theme', theme)
}

themeToggler.addEventListener('click', () => {
  setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
})
