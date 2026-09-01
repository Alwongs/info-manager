import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styles from './ParagraphItem.module.css';
import { highlightText } from '../../utils/highlightText';
import MasterPasswordDialog from '../../components/MasterPasswordDialog';

export default function ParagraphItem({ paragraph, onDelete, onEdit, searchQuery = '' }) {
    const [isDecrypted, setIsDecrypted] = useState(false);
    const [decryptedContent, setDecryptedContent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [error, setError] = useState(null);

    const isEncrypted = paragraph.is_encrypted === 1;

    const highlightedTitle = highlightText(paragraph.title, searchQuery);

    const getContent = () => {
        if (isEncrypted && !isDecrypted) {
            return null;
        }
        const content = isDecrypted ? decryptedContent : paragraph.content;
        return highlightText(content, searchQuery);
    };

    // При нажатии кнопки — открываем диалог
    const handleDecrypt = () => {
        setShowPasswordDialog(true);
        setError(null);
    };

    // Расшифровка после ввода пароля
const handlePasswordSuccess = async (password) => {
    console.log('1️⃣ handlePasswordSuccess вызван, пароль:', password);
    setIsLoading(true);
    setError(null);
    
    try {
        console.log('2️⃣ Устанавливаем пароль...');
        await window.electronAPI.setMasterPassword(password);
        console.log('3️⃣ Пароль установлен');
        
        console.log('4️⃣ Расшифровываем...');
        const result = await window.electronAPI.decryptParagraph(paragraph.id);
        console.log('5️⃣ Результат расшифровки:', result);
        
        setDecryptedContent(result.content);
        setIsDecrypted(true);
        setShowPasswordDialog(false);
        console.log('6️⃣ Диалог закрыт');
    } catch (error) {
        console.log('7️⃣ Ошибка:', error.message);
        setError('❌ Неверный пароль. Попробуйте снова.');
        setShowPasswordDialog(true);
        console.log('8️⃣ Диалог должен остаться открытым');
        throw error;
    } finally {
        setIsLoading(false);
        console.log('9️⃣ finally');
    }
};

    const highlightedContent = getContent();

    return (
        <li className={styles['item']}>
            <header className={styles['item-header']}>
                <h3 className={styles['item-title']}>
                    ➡️ <span dangerouslySetInnerHTML={{ __html: highlightedTitle }} />
                    {isEncrypted && (
                        <span style={{ marginLeft: '8px', fontSize: '14px' }}>
                            {isDecrypted ? '🔓' : '🔒'}
                        </span>
                    )}
                </h3>
            </header>

            {isEncrypted && !isDecrypted ? (
                <div className={styles['item-content']} style={{ color: '#888', fontStyle: 'italic' }}>
                    🔒 Зашифровано. Нажмите кнопку "Расшифровать"
                </div>
            ) : (
                highlightedContent && (
                    <div
                        className={styles['item-content']}
                        dangerouslySetInnerHTML={{ __html: highlightedContent }}
                    />
                )
            )}

            <div className={styles['item-actions']}>
                {isEncrypted && !isDecrypted && (
                    <button
                        onClick={handleDecrypt}
                        disabled={isLoading}
                        className={`${styles['item-btn']} ${styles['item-btn-decrypt']}`}
                        title="Расшифровать параграф"
                    >
                        {isLoading ? '⏳...' : '🔓 Расшифровать'}
                    </button>
                )}
                <button
                    onClick={() => onEdit(paragraph)}
                    className={`${styles['item-btn']} ${styles['item-btn-edit']}`}
                    title="Редактировать параграф"
                >
                    Изменить
                </button>
                <button
                    onClick={() => onDelete(paragraph.id, paragraph.title)}
                    className={`${styles['item-btn']} ${styles['item-btn-del']}`}
                    title="Удалить параграф"
                >
                    Удалить
                </button>
            </div>

            <p className={styles['item-bottom']}>
                ----- end of paragraph ----------------------------------------------------------------------------
            </p>

            {showPasswordDialog && (
                <MasterPasswordDialog 
                    onSuccess={handlePasswordSuccess}
                    onCancel={() => {
                        setShowPasswordDialog(false);
                        setError(null);
                    }}
                    error={error}
                />
            )}
        </li>
    );
}