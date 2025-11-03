// src/components/SidebarAd160x600.jsx (Final Simpler Fix)

import React, { useEffect, useRef } from 'react';

const SidebarAd160x600 = () => {
    const adContainerRef = useRef(null);
    const adId = 'sidebar-160x600-container'; // Unique ID for the container
    const key = '05f17c73e1ae1b882f57c546064b92fe'; // Key for 160x600 unit

    useEffect(() => {
        if (adContainerRef.current && adContainerRef.current.children.length === 0) {
            adContainerRef.current.id = adId;

            // 🛑 CRITICAL FIX: Define atOptions as a simple global variable before injecting the script
            window.atOptions = {
                'key': key,
                'format': 'iframe',
                'height': 600,
                'width': 160,
                'params': {},
                 // Include the container ID in the options, as some networks require this
                'containerId': adId 
            };
            
            // Inject the script locally (no need to use the one in index.html)
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `//www.highperformanceformat.com/${key}/invoke.js`;
            script.async = true;
            script.defer = true;
            
            adContainerRef.current.appendChild(script);
        }
        
        // Cleanup function (remains the same)
        return () => {
            if (adContainerRef.current && adContainerRef.current.lastChild) {
                adContainerRef.current.innerHTML = '';
            }
        };
    }, []); 

    return (
        <div className="d-flex justify-content-center" 
             style={{ width: '160px', minHeight: '600px', margin: '0 auto' }} 
             ref={adContainerRef}>
        </div>
    );
};

export default SidebarAd160x600;