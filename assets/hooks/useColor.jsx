import { useState, useEffect } from 'react';
import { getColors } from 'react-native-image-colors';

const useImageColors = (imageUrl) => {
  const [colors, setColors] = useState(null);

  useEffect(() => {
    if (!imageUrl) return;

    const fetchColors = async () => {
      try {
        const result = await getColors(imageUrl, {
          fallback: '#228B22',
          cache: true,
          key: imageUrl,
        });
        setColors(result);
      } catch (error) {
        console.error('Error fetching colors:', error);
      }
    };

    fetchColors();
  }, [imageUrl]);

  return colors;
};

export default useImageColors;
