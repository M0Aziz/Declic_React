import React, { useState } from 'react';
import axios from 'axios';

const TestImage = () => {

     /*  const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
  
    const handleGenerateImage = async () => {
      try {
        const response = await axios.post('https://api.deepai.org/api/text2img', {
          text: text,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': '6ea4501a-87b2-434c-b4a3-cc593367f8af', // Remplacez YOUR_API_KEY par votre clé API DeepAI
          }
        });
  
        setImageUrl(response.data.output_url);
      } catch (error) {
        console.error('Error generating image:', error);
      }
    };
  
    return (
      <div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={handleGenerateImage}>Generate Image</button>
        {imageUrl && <img src={imageUrl} alt="Generated Image" />}
      </div>
    );
  };*/
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/activitys/generate-image', { prompt });
      const imageUrl = response.data.data[0].url;
      setImageUrl(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Entrez une description"
        />
        <button type="submit">Générer l'image</button>
      </form>
      {imageUrl && <img src={imageUrl} alt="Generated" />}
    </div>
  );
};

export default TestImage;
