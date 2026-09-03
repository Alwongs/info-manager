import { useState } from 'react';
import styles from './ChangePasswordDialog.module.css';

export default function ChangePasswordDialog({ onSuccess, onCancel }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (newPassword.length < 4) {
            setError('Минимум 4 символа');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setIsLoading(true);
        
        try {
            await onSuccess(oldPassword, newPassword);
            onCancel();
        } catch (err) {
            setError(err.message || 'Ошибка');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <h2 className={styles.title}>🔑 Сменить пароль</h2>
                
                <form onSubmit={handleSubmit}>
                    <input
                        // type="password"
                        placeholder="Текущий пароль"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className={styles.input}
                        required
                        disabled={isLoading}
                    />
                    <input
                        // type="password"
                        placeholder="Новый пароль (мин. 4 символа)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={styles.input}
                        required
                        disabled={isLoading}
                    />
                    <input
                        // type="password"
                        placeholder="Повторите новый пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.input}
                        required
                        disabled={isLoading}
                    />
                    
                    {error && <p className={styles.error}>{error}</p>}
                    
                    <button
                        type="submit"
                        className={`${styles.button} ${styles.buttonPrimary}`}
                        disabled={isLoading}
                    >
                        {isLoading ? '⏳...' : 'Сменить пароль'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`${styles.button} ${styles.buttonSecondary}`}
                        disabled={isLoading}
                    >
                        Отмена
                    </button>
                </form>
            </div>
        </div>
    );
}