// Retirado e adaptado de: https://getbootstrap.com/docs/5.3/customize/color-modes/#javascript
// Foram removidas algumas linhas relativas a um menu dropdown para troca de cor.
// Escolhemos apenas alterar o tema com base no sistema (usando media queries).

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