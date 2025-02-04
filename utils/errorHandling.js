export function setErrorMessage(msg) {
    const errorDiv = document.getElementById('error-message');
    if (msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
    } else {
        errorDiv.style.display = 'none';
    }
}

export function clearErrorMessage() {
    setErrorMessage('');
}