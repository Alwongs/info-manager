const { contextBridge, ipcRenderer } = require('electron')

// Безопасный API для renderer процесса
contextBridge.exposeInMainWorld('electronAPI', {
    
    addCategory: (name) => ipcRenderer.invoke('category:add', name),
    updateCategory: (id, name) => ipcRenderer.invoke('category:update', id, name),
    getCategories: () => ipcRenderer.invoke('category:getAll'),  
    deleteCategory: (id) => ipcRenderer.invoke('category:delete', id),


    addNote: (title, categoryId) => ipcRenderer.invoke('note:add', title, categoryId),    
    updateNote: (id, title, categoryId) => ipcRenderer.invoke('note:update', id, title, categoryId),
    getNotes: () => ipcRenderer.invoke('note:getAll'),  
    getNotesByCategory: (categoryId) => ipcRenderer.invoke('note:getByCategory', categoryId),  
    deleteNote: (id) => ipcRenderer.invoke('note:delete', id),  
    
    addParagraph: (noteId, title, content) => ipcRenderer.invoke('paragraph:add', noteId, title, content),
    updateParagraph: (id, title, content) => ipcRenderer.invoke('paragraph:update', id, title, content),
    getParagraphsByNote: (noteId) => ipcRenderer.invoke('paragraph:getByNote', noteId), 
    deleteParagraph: (id) => ipcRenderer.invoke('paragraph:delete', id),  

    getNotesByPhrase: (phrase) => ipcRenderer.invoke('note:getByPhrase', phrase),  
    getParagraphsByPhrase: (phrase) => ipcRenderer.invoke('paragraph:getByPhrase', phrase),  
});