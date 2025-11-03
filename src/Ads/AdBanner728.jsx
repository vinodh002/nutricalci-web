// src/components/AdBanner728.jsx (Final Simpler Fix)

import React, { useEffect, useRef } from 'react';

const AdBanner728 = () => {
    const adContainerRef = useRef(null);
    const adId = 'ad-container-728'; // Unique ID for the container
    const key = '5a1f32220b95bdb0de62e19dd4fe7b99'; // Key for 728x90 unit

    useEffect(() => {
        if (adContainerRef.current && adContainerRef.current.children.length === 0) {
            adContainerRef.current.id = adId;

            // 🛑 CRITICAL FIX: Define atOptions as a simple global variable before injecting the script
            window.atOptions = {
                'key': key,
                'format': 'iframe',
                'height': 90,
                'width': 728,
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
        <div className="d-flex justify-content-center my-3 my-md-4" 
             style={{ minHeight: '90px', overflow: 'hidden' }}
             ref={adContainerRef}>
        </div>
    );
};

export default AdBanner728;