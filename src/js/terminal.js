const terminalInput = document.getElementById('terminal-input')

const terminalCommands = {
  arabic: () => changeLanguage('ar'),
  english: () => changeLanguage('en'),
  dark: () => setTheme('dark'),
  light: () => setTheme('light'),
}

terminalInput.addEventListener('keydown', async (event) => {
  if (event.key !== 'Enter' || event.isComposing) return

  const command = terminalInput.value.trim().toLowerCase()
  terminalInput.value = ''
  await terminalCommands[command]?.()
})
