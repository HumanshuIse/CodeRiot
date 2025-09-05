import React from 'react';
import { useMatch } from '../context/MatchContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swords } from 'lucide-react';

const ReturnToMatchButton = () => {
    const { activeMatch } = useMatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Don't show the button if there's no active match or if we are already in the editor
    if (!activeMatch || location.pathname.includes('/editor')) {
        return null;
    }

    return (
        <button
            onClick={() => navigate('/editor')}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-tech font-bold rounded-lg shadow-lg animate-pulse transform hover:scale-105 transition-transform"
        >
            <Swords size={24} />
            Return to Battle!
        </button>
    );
};

export default ReturnToMatchButton;