// import React, { useState, useEffect } from 'react';
// import styles from './AddCategoryForm.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // <-- НОВЫЙ ИМПОРТ
// import { faPlus } from '@fortawesome/free-solid-svg-icons';       // <-- НОВЫЙ ИМПОРТ

// export default function AddCategoryForm({ onAdd }) {
//     const [name, setName] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!name.trim()) return; 
//         onAdd(name);
//         setName('');
//     };

//     return (
//         <form
//             className={styles['form-section']}
//             onSubmit={handleSubmit}
//         >
//             <input
//                 className={styles['input-field']} 
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Введите название"
//             />
//             <button
//                 className={styles['submit-btn']} 
//                 type="submit"
//             >
//                 <FontAwesomeIcon icon={faPlus} /> 
//             </button>
//         </form>
//     );
// };
