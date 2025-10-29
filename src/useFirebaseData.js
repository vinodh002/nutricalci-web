// src/useFirebaseData.js

import { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Import your initialized db
import { collection, getDocs, query } from 'firebase/firestore';

// Replace the hardcoded foodData with data from a 'foods' Firestore collection
const useFirebaseData = () => {
    const [foodData, setFoodData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log(foodData)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Query the 'foods' collection
                const foodsCollectionRef = collection(db, 'foods');
                const q = query(foodsCollectionRef);
                const querySnapshot = await getDocs(q);

                const fetchedFoods = [];
                querySnapshot.forEach((doc) => {
                    // Add the Firestore document ID to the data object
                    fetchedFoods.push({
                        id: doc.id, // Use Firestore document ID as the food ID
                        ...doc.data(),
                    });
                });

                setFoodData(fetchedFoods);
            } catch (err) {
                console.error("Error fetching food data from Firebase: ", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Run only once on mount

    // In a real application, you'd also fetch the NIN data here.
    // For now, we return only the food data.

    return { foodData, isLoading, error };
};

export default useFirebaseData;