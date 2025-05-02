import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const BtnHome = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/home');
    };

    return (
        <button onClick={handleClick} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faHouse} size="2x" />
        </button>
    );
};

export default BtnHome;