import React, { useState } from 'react';
import './App.css';
import EssayForm from './components/EssayForm'; 
import ScoreDisplay from './components/ScoreDisplay'; 

// Typescript interface for clarification and safety
interface Scores {
  grammar: number;
  coherence: number;
  relevance: number;
  overallScore: number;
}

function App() {
  // Use TypeScript interface for state type annotation for better type checking
  const [scores, setScores] = useState<Scores>({ grammar: 0, coherence: 0, relevance: 0, overallScore: 0 });
  const [feedback, setFeedback] = useState<string>('');


// Update to handle the backend response directly
const handleScoringResult = (result: { grammar: number, coherence: number, relevance: number, overallScore: number, feedback: string }) => {
  const { grammar, coherence, relevance, overallScore, feedback } = result;
  setScores({ grammar, coherence, relevance, overallScore });
  setFeedback(feedback);
};


  return (
    <div className="App">
      <h1>Automated Essay Scoring System</h1>
      <EssayForm onScore={handleScoringResult} />
      <ScoreDisplay scores={scores} feedback={feedback} />
    </div>
  );
}

export default App;


