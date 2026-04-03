export const isValidEmail = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || trimmed.includes(" ")) return false

    const atIndex = trimmed.indexOf("@")
    if (atIndex <= 0 || atIndex !== trimmed.lastIndexOf("@") || atIndex === trimmed.length - 1) {
        return false
    }

    const local = trimmed.slice(0, atIndex)
    const domain = trimmed.slice(atIndex + 1)

    if (!local || !domain || domain.startsWith(".") || domain.endsWith(".")) return false
    if (!domain.includes(".")) return false

    const domainParts = domain.split(".")
    if (domainParts.some((part) => part.length === 0)) return false

    return true
}

export const isAllowedPhoneChar = (ch: string) => {
    return (ch >= "0" && ch <= "9") || ch === " " || ch === "+" || ch === "-" || ch === "(" || ch === ")"
}

export const isValidPhone = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return false

    let digitCount = 0
    for (const ch of trimmed) {
        if (!isAllowedPhoneChar(ch)) return false
        if (ch >= "0" && ch <= "9") digitCount += 1
    }

    return digitCount >= 10
}

export const isStrongPassword = (value: string) => {
    if (!value || value.length < 8) return false

    let hasUpper = false
    let hasLower = false
    let hasDigit = false

    for (const ch of value) {
        if (ch >= "A" && ch <= "Z") hasUpper = true
        else if (ch >= "a" && ch <= "z") hasLower = true
        else if (ch >= "0" && ch <= "9") hasDigit = true

        if (hasUpper && hasLower && hasDigit) return true
    }

    return false
}