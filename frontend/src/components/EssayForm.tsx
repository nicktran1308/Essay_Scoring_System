import React, { useState } from 'react';
import axios from 'axios';

interface EssayFormProps {
  onScore: (result: any) => void; // This prop function to handle the score result in your parent component
}

const EssayForm: React.FC<EssayFormProps> = ({ onScore }) => {
  const [essayText, setEssayText] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Make the API call within the handleSubmit function
      const response = await axios.post('http://localhost:3001/score', { essay: essayText });
      onScore(response.data); // Pass the response data to the onScore prop function
    } catch (error) {
      console.error("Error submitting essay:", error);
      // Optionally, handle the error (e.g., displaying an error message to the user)
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          rows={10}
          placeholder="Paste your essay here..."
        ></textarea>
        <button type="submit">Score My Essay</button>
      </form>
    </div>
  );
};

export default EssayForm;
