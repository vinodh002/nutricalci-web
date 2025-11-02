// src/components/AdBanner728.jsx (Simplified for SPA)

import React, { useEffect, useRef } from 'react';

const AdBanner728 = () => {
    // 1. Reference for the container element
    const adContainerRef = useRef(null);

    useEffect(() => {
        const adId = 'highperformancead'; // Unique ID for this ad container
        
        // 2. Define the ad options object (your original code)
        const atOptions = {
            'key': '5a1f32220b95bdb0de62e19dd4fe7b99',
            'format': 'iframe',
            'height': 90,
            'width': 728,
            'params': {}
        };
        
        // 3. Attach the options to the container element
        if (adContainerRef.current) {
            // Set the options object on the window scope, associated with a key or element ID
            window.atOptions = window.atOptions || {};
            window.atOptions[adId] = atOptions;

            // Give the container a unique ID for the ad script to target
            adContainerRef.current.id = adId;

            // Since the global script (invoke.js) is loaded in index.html, 
            // the ad network should detect the new container and load the ad.
            
            // NOTE: For some ad networks, you might need to manually trigger a refresh here:
            // if (window.adnetwork && window.adnetwork.refresh) {
            //     window.adnetwork.refresh(adId);
            // }
        }

    }, []); 

    // 4. Return the container element for placement
    return (
        <div className="d-flex justify-content-center my-3 my-md-4" 
             style={{ minHeight: '90px', overflow: 'hidden' }}
             ref={adContainerRef}>
            {/* The ad iframe will load inside this div */}
        </div>
    );
};

export default AdBanner728;