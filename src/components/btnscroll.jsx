// ScrollToTopButton.js

import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar el botón cuando el usuario haya bajado 400px desde la parte superior
  const toggleVisibility = () => {
    if (window.pageYOffset > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Agregar un listener de scroll cuando se monta el componente
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Función para hacer scroll hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Subir al inicio
        </button>
      )}
    </>
  );
};

export default BtnScroll;