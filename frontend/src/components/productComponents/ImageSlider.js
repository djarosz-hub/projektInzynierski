import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

function ImageSlider(props) {

    const { images, name } = props;
    const [imagesReady, setImagesReady] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const leftArrowUTFSign = '\u2770';
    const rightArrowUTFSign = '\u2771';

    useEffect(() => {
        if (images && images.length > 0) {
            setImagesReady(true);
        }
    }, [images])

    const previousImageHandler = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }

    const nextImageHandler = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    const goToSlide = (index) => {
        setCurrentIndex(index);
    }

    return (
        <>
            {imagesReady && (
                <div className="single-image" style={{ position: 'relative' }}>
                    <div className="basic-arrow left-arrow" onClick={previousImageHandler}>{leftArrowUTFSign}</div>
                    <div className="basic-arrow right-arrow" onClick={nextImageHandler}>{rightArrowUTFSign}</div>
                    <img src={`${images[currentIndex]}`} alt={name} />
                    <div className="dots-container">
                        {images.map((image, index) => (
                            <div key={index} className={`dots-style ${index === currentIndex ? 'selected-index-dot' : ''}`} onClick={() => goToSlide(index)}>•</div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default ImageSlider