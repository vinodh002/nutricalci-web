// src/useFirebaseData.js

import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
// Changed imports to support real-time listeners
import { collection, doc, query, onSnapshot } from 'firebase/firestore';

const useFirebaseData = () => {
    const [foodData, setFoodData] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Flag to track if initial loading is complete
        let foodLoadComplete = false;
        let rulesLoadComplete = false;

        // --- 1. Real-time Listener for Food Data (Collection) ---
        const foodsCollectionRef = collection(db, 'foods');
        const foodsQuery = query(foodsCollectionRef);

        // Subscribe to foods collection updates
        const unsubscribeFoods = onSnapshot(foodsQuery, (snapshot) => {
            try {
                const fetchedFoods = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setFoodData(fetchedFoods);

                foodLoadComplete = true;
                if (foodLoadComplete && rulesLoadComplete) {
                    setIsLoading(false);
                }

            } catch (err) {
                console.error("Error fetching food data from Firebase: ", err);
                setError(err.message);
                setIsLoading(false);
            }
        }, (err) => {
            console.error("Error subscribing to foods updates:", err);
            setError(err.message);
            setIsLoading(false);
        });

        // --- 2. Real-time Listener for NIN Rules Data (Document) ---
        const configDocRef = doc(db, 'config', 'recommendations');

        // Subscribe to recommendations document updates
        const unsubscribeRules = onSnapshot(configDocRef, (docSnapshot) => {
            try {
                let fetchedRules = [];
                if (docSnapshot.exists()) {
                    fetchedRules = docSnapshot.data().rules || [];
                } else {
                    console.warn("Firestore document 'config/recommendations' not found.");
                }

                setRecommendations(fetchedRules);

                rulesLoadComplete = true;
                if (foodLoadComplete && rulesLoadComplete) {
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Error fetching rules data from Firebase: ", err);
                setError(err.message);
                setIsLoading(false);
            }
        }, (err) => {
            console.error("Error subscribing to rules updates:", err);
            setError(err.message);
            setIsLoading(false);
        });


        // Cleanup function: Unsubscribe from both listeners when the component unmounts
        return () => {
            unsubscribeFoods();
            unsubscribeRules();
        };

    }, []); // Empty dependency array ensures listeners are set up once

    return { foodData, recommendations, isLoading, error };
};

export default useFirebaseData;