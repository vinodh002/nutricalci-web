// src/components/SidebarAd160x600.jsx (FINAL ROBUST VERSION)

import React, { useEffect, useRef } from 'react';

const SidebarAd160x600 = () => {
    const adContainerRef = useRef(null);
    const adId = 'sidebar-160x600-container'; 
    const key = '05f17c73e1ae1b882f57c546064b92fe'; 

    const loadAdScript = () => {
        if (!adContainerRef.current) return;
        
        // 1. Define atOptions globally 
        window.atOptions = window.atOptions || {};
        window.atOptions = {
            'key': key,
            'format': 'iframe',
            'height': 600,
            'width': 160,
            'params': {},
            'containerId': adId // Include container ID
        };

        // 2. Inject the specific script manually
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `//www.highperformanceformat.com/${key}/invoke.js`; 
        script.async = true;
        script.defer = true;
        
        // 3. Inject only if the container is empty
        if (adContainerRef.current.children.length === 0) {
             adContainerRef.current.appendChild(script);
        }
    };

    useEffect(() => {
        // Set the ID when the component mounts
        if (adContainerRef.current) {
             adContainerRef.current.id = adId;
        }

        // Run the load function immediately and again after a short delay for reliability
        loadAdScript();
        const timer = setTimeout(loadAdScript, 1000); // Re-trigger load after 1s for SPA routers

        return () => {
            clearTimeout(timer);
            // On cleanup, ensure the container is reset to allow clean re-render
            if (adContainerRef.current) {
                adContainerRef.current.innerHTML = '';
            }
        };
    }, []); 

    // 4. Return the container element with reserved space (160x600)
    return (
        <div className="d-flex justify-content-center" 
             // IMPORTANT: Set explicit dimensions to reserve space
             style={{ width: '160px', minHeight: '600px', margin: '0 auto' }} 
             ref={adContainerRef}>
        </div>
    );
};

export default SidebarAd160x600;