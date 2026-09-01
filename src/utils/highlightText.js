/**
 * Подсвечивает найденные фразы в тексте
 * @param {string} text - исходный текст
 * @param {string} query - поисковая фраза
 * @returns {string} - HTML с подсветкой
 */
export const highlightText = (text, query) => {
    if (!text || !query || !query.trim()) {
        return text;
    }

    // Экранируем спецсимволы в запросе
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Создаём регулярное выражение (регистронезависимое)
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    // Заменяем найденные фразы на обёрнутые в span
    return text.replace(regex, '<span class="highlight">$1</span>');
};