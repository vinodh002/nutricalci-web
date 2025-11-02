// src/components/SidebarAd160x600.jsx

import React, { useEffect, useRef } from 'react';

const SidebarAd160x600 = () => {
    // 1. Reference for the container element where the ad will load
    const adContainerRef = useRef(null);
    // Use the unique key from the script URL to ensure the ad loads correctly
    const adId = 'sidebar-160x600-05f17c73e1ae1b882f57c546064b92fe'; 

    useEffect(() => {
        // 2. Define the ad options object (your provided code)
        const atOptions = {
            'key': '05f17c73e1ae1b882f57c546064b92fe',
            'format': 'iframe',
            'height': 600,
            'width': 160,
            'params': {}
        };
        
        if (adContainerRef.current) {
            // 3. Attach the options to the window object, associated with a unique key
            window.atOptions = window.atOptions || {};
            window.atOptions[adId] = atOptions;

            // 4. Set the container ID for the global invoke script to target
            adContainerRef.current.id = adId;

            // 5. If the ad hasn't loaded (common in SPAs after initial render), 
            // you can try to trigger a manual refresh or append a temporary script 
            // to ensure the ad network detects the new container. 
            // For now, setting the ID and options should be enough since the global 
            // invoke script is loaded in index.html.
        }

    }, []); 

    // 6. Return the container element with reserved space (160x600)
    return (
        <div className="d-flex justify-content-center" 
             // Set the exact width/height to reserve space for the ad, preventing content shift
             style={{ width: '160px', minHeight: '600px', margin: '0 auto' }} 
             ref={adContainerRef}>
            {/* The 160x600 ad will load inside this div */}
        </div>
    );
};

export default SidebarAd160x600;