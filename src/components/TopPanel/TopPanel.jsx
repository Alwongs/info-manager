import React, { useState, useEffect } from 'react';
import styles from "./TopPanel.module.css";

export default function TopPanel({ onSearch, onChangePassword  }) {
    const [phrase, setPhrase] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!phrase.trim()) return; 
        onSearch(phrase);
    };

    const handleCheckPassword = async () => {
        try {
            const result = await window.electronAPI.getMasterPassword();
            if (result.success) {
                alert(`✅ Пароль: ${result.password}`);
            } else {
                alert('❌ Пароль не найден');
            }
        } catch (error) {
            alert('❌ Ошибка: ' + error.message);
        }
    };   

    return (
        <div className={styles['top-panel']}>
            <ul className={styles['menu']}>
                <li className={styles['menu-item']} onClick={handleCheckPassword}>
                    🔍 Проверить пароль
                </li>                
                <li className={styles['menu-item']} onClick={onChangePassword}>
                    🔑 Сменить пароль
                </li>                
            </ul>

            <form
                className={styles['search-form']}
                onSubmit={handleSubmit}
            >
                <input
                    className={styles['search-field']} 
                    type="text"
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                    placeholder="Поиск по заметкам..."
                />
                <p onClick={handleSubmit} className={styles['search-icon']}>🔍</p>
            </form>
        </div>        
    );
}