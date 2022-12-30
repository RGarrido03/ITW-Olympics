const getPreferredTheme = function () {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const setTheme = function (theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light')
    }
}

setTheme(getPreferredTheme())

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    setTheme(getPreferredTheme())
})