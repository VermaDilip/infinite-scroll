import React, { useState, useEffect } from 'react';


const InfiniteScroll = () => {
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState(25);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);

  const fetchImages = async (count = 300) => {
    try {
      const promises = Array.from({ length: count }, (_, i) =>
        fetch(`https://picsum.photos/320/180?random=${i}`)
      );
      const responses = await Promise.all(promises);
      const data = responses.map((response, index) => ({
        id: index + 1,
        title: `Video ${index + 1}`,
        description: `Description for video ${index + 1}`,
        views: `${Math.floor(Math.random() * 1000)}K views`,
        channel: `Channel ${index + 1}`,
        time: `${Math.floor(Math.random() * 24)} hours ago`,
        image: response.url,
      }));
      return data;
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadCards = async () => {
      const data = await fetchImages();
      setCards(data);
      setLoading(false);
    };
    loadCards();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setVisibleCards((prev) => Math.min(prev + 25, cards.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [cards]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const openModal = (card) => setSelectedCard(card);
  const closeModal = () => setSelectedCard(null);

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'image.jpg';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Infinite Scroll Gallery</h1>
          <p>Explore beautiful images fetched from Picsum. Scroll down to load more.</p>
          <button className="cta-button" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </section>

      <header>
        {/* <h1>YouTube Like Cards</h1> */}
        {/* <button onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button> */}
      </header>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="card-container">
          {cards.slice(0, visibleCards).map((card) => (
            <div key={card.id} className="card" onClick={() => openModal(card)}>
              <div className="thumbnail">
                <img src={card.image} alt={`Thumbnail for ${card.title}`} loading="lazy" />
              </div>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <div className="card-details">
                <span>{card.views}</span> • <span>{card.channel}</span> • <span>{card.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {visibleCards < cards.length && !loading && <div className="loading">Loading more...</div>}

      {selectedCard && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img style={{borderRadius:'10px',width:'40rem'}} src={selectedCard.image} alt={`Thumbnail for ${selectedCard.title}`} />
            <button className="download-button" onClick={() => downloadImage(selectedCard.image)}>
              Download Image
            </button>
            <button className="close-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
