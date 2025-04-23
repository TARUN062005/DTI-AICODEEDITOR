import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const getLanguageFromFileName = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "html":
      return { name: "HTML", template: "<!-- Write your HTML here -->\n<div>\n  <h1>Hello World!</h1>\n</div>" }
    case "css":
      return { name: "CSS", template: "/* Write your CSS here */\nbody {\n  color: blue;\n}" }
    case "js":
      return { name: "JavaScript", template: '// Write your JavaScript here\nconsole.log("Hello World!");' }
    default:
      return null
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
