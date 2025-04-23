import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { WebLinksAddon } from 'xterm-addon-web-links'

export class TerminalService {
  private term: Terminal
  private fitAddon: FitAddon
  private webLinksAddon: WebLinksAddon
  private commandBuffer: string = ''

  constructor() {
    this.term = new Terminal({
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 14,
      theme: {
        background: '#1e1e1e',
        foreground: '#e0e0e0',
        cursor: '#ffffff'
      },
      cursorBlink: true,
      convertEol: true
    })

    this.fitAddon = new FitAddon()
    this.webLinksAddon = new WebLinksAddon()
    
    this.term.loadAddon(this.fitAddon)
    this.term.loadAddon(this.webLinksAddon)
  }

  init(element: HTMLElement) {
    this.term.open(element)
    this.fitAddon.fit()
    this.setupListeners()
    this.printWelcome()

    window.addEventListener('resize', () => this.fitAddon.fit())
  }

  destroy() {
    window.removeEventListener('resize', () => this.fitAddon.fit())
    this.term.dispose()
  }

  private printWelcome() {
    this.term.writeln('Welcome to the terminal!\r\n')
    this.term.writeln('Try these commands:')
    this.term.writeln('- help: Show available commands')
    this.term.writeln('- clear: Clear the terminal\r\n')
    this.prompt()
  }

  private prompt() {
    this.term.write('\r\n$ ')
  }

  private setupListeners() {
    this.term.onData(data => {
      if (data === '\r') { // Enter key
        this.processCommand(this.commandBuffer)
        this.commandBuffer = ''
      } else if (data === '\u007F') { // Backspace
        if (this.commandBuffer.length > 0) {
          this.commandBuffer = this.commandBuffer.slice(0, -1)
          this.term.write('\b \b')
        }
      } else if (data.charCodeAt(0) < 32) {
        // Ignore other control characters
      } else {
        this.commandBuffer += data
        this.term.write(data)
      }
    })
  }

  private processCommand(cmd: string) {
    this.term.write('\r\n')
    
    if (cmd.trim() === 'clear') {
      this.term.clear()
    } else if (cmd.trim() === 'help') {
      this.term.writeln('Available commands:')
      this.term.writeln('- help: Show this help')
      this.term.writeln('- clear: Clear terminal')
      this.term.writeln('- echo [text]: Repeat text')
      this.term.writeln('- date: Show current date')
    } else if (cmd.startsWith('echo ')) {
      this.term.writeln(cmd.substring(5))
    } else if (cmd.trim() === 'date') {
      this.term.writeln(new Date().toString())
    } else if (cmd.trim()) {
      this.term.writeln(`Command not found: ${cmd}`)
    }
    
    this.prompt()
  }
}