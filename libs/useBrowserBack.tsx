import { useEffect } from 'react';

// USAGE
// useBackButton(() => {
//     alert("BROWSER BACK BUTTON CLICKED")
//})

const useBackButton = (callback: any) => {

    useEffect(() => {
        const handleBackButton = () => {
            // Perform custom logic when the user clicks the browser back button
            if (typeof callback === 'function') {
                callback();
            }
        };

        // Add event listener for the browser's popstate event
        window.addEventListener('popstate', handleBackButton);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };
    }, [callback]);
};

export default useBackButton;
