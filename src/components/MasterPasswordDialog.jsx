import { useState, useEffect } from 'react';

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
        console.log('🔵 Форма отправлена, пароль:', password);
        setIsLoading(true);
        setError('');
        
        try {
            console.log('🔵 Вызываем onSuccess...');
            await onSuccess(password);
            console.log('🔵 onSuccess выполнен успешно');
            onCancel();
            console.log('🔵 Диалог закрыт');
        } catch (err) {
            console.log('🔵 Ошибка в onSuccess:', err.message);
            setError(err.message || 'Ошибка');
            console.log('🔵 Диалог должен остаться открытым');
        } finally {
            setIsLoading(false);
            console.log('🔵 finally');
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: 50 }}>Загрузка...</div>;
    }

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style={{
                background: 'white', padding: 30, borderRadius: 10, width: 340
            }}>
                <h2 style={{ textAlign: 'center' }}>
                    {isNewUser ? '🔐 Придумайте пароль' : '🔐 Введите пароль'}
                </h2>
                
                {externalError && (
                    <p style={{ color: 'red', fontSize: 14, textAlign: 'center', marginBottom: 10 }}>
                        {externalError}
                    </p>
                )}
                
                {error && (
                    <p style={{ color: 'red', fontSize: 14, textAlign: 'center', marginBottom: 10 }}>
                        {error}
                    </p>
                )}
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: 10, margin: '10px 0', border: '1px solid #ccc', borderRadius: 5 }}
                        autoFocus
                        disabled={isLoading}
                    />
                    
                    {isNewUser && (
                        <input
                            type="password"
                            placeholder="Повторите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', padding: 10, margin: '10px 0', border: '1px solid #ccc', borderRadius: 5 }}
                            disabled={isLoading}
                        />
                    )}
                    
                    <button type="submit" style={{
                        width: '100%', padding: 10,
                        background: '#007bff', color: 'white',
                        border: 'none', borderRadius: 5, cursor: 'pointer'
                    }} disabled={isLoading}>
                        {isLoading ? '⏳...' : (isNewUser ? 'Создать' : 'Войти')}
                    </button>
                    
                    {onCancel && (
                        <button type="button" onClick={onCancel} style={{
                            width: '100%', padding: 10, marginTop: 10,
                            background: '#6c757d', color: 'white',
                            border: 'none', borderRadius: 5, cursor: 'pointer'
                        }} disabled={isLoading}>
                            Отмена
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}