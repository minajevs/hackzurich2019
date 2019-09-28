import { useState, useEffect, useContext } from 'react'

export function useShortcutsListUpdated() {
    const [shortcuts, setShortcuts] = useState([]);

    function handleShortcutsUpdated(event: any, shortcuts: any) {
        setShortcuts(shortcuts);
    }

    useEffect(() => {
        (window as any).ipcRenderer.on('shortcuts-list', handleShortcutsUpdated);
        return () => {
            (window as any).ipcRenderer.removeListener('shortcuts-list', handleShortcutsUpdated);
        };
    }, []);

    return shortcuts;
}