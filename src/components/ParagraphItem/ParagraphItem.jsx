import { useState, useEffect } from 'react';
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

    useEffect(() => {
        setIsDecrypted(false);
        setDecryptedContent(null);
        setError(null);
    }, [paragraph]);

    const isEncrypted = paragraph.is_encrypted === 1;

    const highlightedTitle = highlightText(paragraph.title, searchQuery);

    const getContent = () => {
        if (isEncrypted && !isDecrypted) {
            return null;
        }
        const content = isDecrypted ? decryptedContent : paragraph.content;
        return highlightText(content, searchQuery);
    };

    const handleDecrypt = () => {
        setShowPasswordDialog(true);
        setError(null);
    };

    const handlePasswordSuccess = async (password) => {
        setIsLoading(true);
        setError(null);
        
        try {
            await window.electronAPI.setMasterPassword(password);
            const result = await window.electronAPI.decryptParagraph(paragraph.id);

            setDecryptedContent(result.content);
            setIsDecrypted(true);
            setShowPasswordDialog(false);
        } catch (error) {
            setError('❌ Неверный пароль. Попробуйте снова.');
            setShowPasswordDialog(true);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = async () => {
        // Если параграф зашифрован и не расшифрован — просим пароль
        if (paragraph.is_encrypted && !isDecrypted) {
            setShowPasswordDialog(true);
            return;
        }

        let decryptedContentToEdit = paragraph.content;
        if (paragraph.is_encrypted && isDecrypted) {
            decryptedContentToEdit = decryptedContent;
        }        
        
        onEdit({
            ...paragraph,
            content: decryptedContentToEdit
        });
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
                    onClick={handleEditClick}
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