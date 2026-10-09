const terminalInput = document.getElementById('terminal-input')

const terminalCommands = {
  arabic: () => changeLanguage('ar'),
  english: () => changeLanguage('en'),
  dark: () => setTheme('dark'),
  light: () => setTheme('light'),
}

const terminalGhost = document.getElementById('terminal-ghost')
const terminalTextMeasurer = document.createElement('canvas').getContext('2d')
let suggestedCommand = ''

function updateTerminalGhost() {
  const value = terminalInput.value
  const normalizedValue = value.toLowerCase()

  suggestedCommand = normalizedValue
    ? Object.keys(terminalCommands).find((command) => command.startsWith(normalizedValue) && command !== normalizedValue) || ''
    : ''

  if (!suggestedCommand) {
    terminalGhost.textContent = ''
    return
  }

  if (!terminalTextMeasurer) {
    throw new Error('Unable to measure terminal command text.')
  }

  terminalTextMeasurer.font = getComputedStyle(terminalInput).font
  const typedWidth = terminalTextMeasurer.measureText(value).width
  terminalInput.style.setProperty('--terminal-typed-width', `${typedWidth}px`)
  terminalGhost.textContent = suggestedCommand.slice(value.length)
}

terminalInput.addEventListener('input', updateTerminalGhost)

terminalInput.addEventListener('keydown', async (event) => {
  if (event.key === 'Tab' && suggestedCommand) {
    event.preventDefault()
    terminalInput.value = suggestedCommand
    terminalInput.setSelectionRange(suggestedCommand.length, suggestedCommand.length)
    updateTerminalGhost()
    return
  }

  if (event.key !== 'Enter' || event.isComposing) return

  const command = terminalInput.value.trim().toLowerCase()
  terminalInput.value = ''
  updateTerminalGhost()
  if (Object.hasOwn(terminalCommands, command)) {
    await terminalCommands[command]()
  }
})
