import React from 'react';

interface ScoreProps {
  scores?: {
    grammar: number;
    coherence: number;
    relevance: number;
    overallScore: number;
  };
  feedback: string;
}

const ScoreDisplay: React.FC<ScoreProps> = ({ scores, feedback }) => {
  // Check if scores is defined before rendering the component
  if (!scores) {
    return <div>There seems to be errors from your code!</div>; 
  }

  return (
    <div>
      <h3>Score:</h3>
      <p>Grammar: {scores.grammar}</p>
      <p>Coherence: {scores.coherence}</p>
      <p>Relevance: {scores.relevance}</p>
      <p>Overall: {scores.overallScore}</p>
      <h3>Feedback:</h3>
      <p>{feedback}</p>
    </div>
  );
};

export default ScoreDisplay;

