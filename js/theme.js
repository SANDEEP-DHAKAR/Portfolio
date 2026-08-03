/**
 * Theme switcher for Sandeep Dhakar Portfolio
 * Handles toggling between light and dark modes with local storage persistence
 */

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-switcher');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Default to dark theme as requested (luxury dark feel)
    const initialTheme = savedTheme || 'dark';
    
    setTheme(initialTheme);
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        
        // Update toggle icon
        if (themeIcon) {
            if (theme === 'light') {
                themeIcon.className = 'fas fa-moon';
                themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
            } else {
                themeIcon.className = 'fas fa-sun';
                themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
            }
        }
        
        // Custom event for other scripts to adapt (e.g. particles or stats charts)
        const event = new CustomEvent('themeChanged', { detail: { theme } });
        document.dispatchEvent(event);
    }
});
