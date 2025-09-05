import React, { createContext, useState, useContext, useEffect } from 'react';

const MatchContext = createContext();

export const useMatch = () => useContext(MatchContext);

export const MatchProvider = ({ children }) => {
    const [activeMatch, setActiveMatch] = useState(null);

    // On initial app load, check localStorage for a pre-existing match
    useEffect(() => {
        const savedMatch = localStorage.getItem('activeMatch');
        if (savedMatch) {
            setActiveMatch(JSON.parse(savedMatch));
        }
    }, []);

    const startMatch = (matchDetails) => {
        localStorage.setItem('activeMatch', JSON.stringify(matchDetails));
        setActiveMatch(matchDetails);
    };

    const endMatch = () => {
        localStorage.removeItem('activeMatch');
        localStorage.removeItem('matchTime'); // Also clear the timer state
        setActiveMatch(null);
    };

    const value = { activeMatch, startMatch, endMatch };

    return (
        <MatchContext.Provider value={value}>
            {children}
        </MatchContext.Provider>
    );
};