import { useState, useEffect } from 'react';
import styles from './MasterPasswordDialog.module.css';

export default function MasterPasswordDialog({ onSuccess, onCancel, error: externalError }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.electronAPI.hasMasterPassword().then(has => {
            setIsNewUser(!has);
            setLoading(false);
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            await onSuccess(password);
            onCancel();
        } catch (err) {
            setError(err.message || 'Ошибка');
        } finally {
            setIsLoading(false);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.dialog}>
                <h2 className={styles.title}>
                    {isNewUser ? '🔐 Придумайте пароль' : '🔐 Введите пароль'}
                </h2>
                
                {externalError && (
                    <p className={styles.error}>{externalError}</p>
                )}
                
                {error && (
                    <p className={styles.error}>{error}</p>
                )}
                
                <form onSubmit={handleSubmit}>
                    <input
                        // type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.input}
                        autoFocus
                        disabled={isLoading}
                    />
                    
                    {isNewUser && (
                        <input
                            // type="password"
                            placeholder="Повторите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            disabled={isLoading}
                        />
                    )}
                    
                    <button
                        type="submit"
                        className={`${styles.button} ${styles.buttonPrimary}`}
                        disabled={isLoading}
                    >
                        {isLoading ? '⏳...' : (isNewUser ? 'Создать' : 'Войти')}
                    </button>
                    
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className={`${styles.button} ${styles.buttonSecondary}`}
                            disabled={isLoading}
                        >
                            Отмена
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}