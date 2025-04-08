import React from 'react';
import { Button } from '../components/ui/button';

const DifficultyFilters = ({ selectedDifficulty, setSelectedDifficulty }) => {
  return (
    <div className="difficulty-filters">
      <Button
        variant={selectedDifficulty === 'all' ? "default" : "outline"}
        onClick={() => setSelectedDifficulty('all')}
        className="filter-button cursor-pointer"
      >
        All
      </Button>
      <Button
        variant={selectedDifficulty === 'easy' ? "default" : "outline"}
        onClick={() => setSelectedDifficulty('easy')}
        className="filter-button cursor-pointer"
      >
        Easy
      </Button>
      <Button
        variant={selectedDifficulty === 'intermediate' ? "default" : "outline"}
        onClick={() => setSelectedDifficulty('intermediate')}
        className="filter-button cursor-pointer"
      >
        Intermediate
      </Button>
      <Button
        variant={selectedDifficulty === 'hard' ? "default" : "outline"}
        onClick={() => setSelectedDifficulty('hard')}
        className="filter-button cursor-pointer"
      >
        Hard
      </Button>
      <Button
        variant={selectedDifficulty === 'super hard' ? "default" : "outline"}
        onClick={() => setSelectedDifficulty('super hard')}
        className="filter-button cursor-pointer"
      >
        Super Hard
      </Button>
    </div>
  );
};

export default DifficultyFilters;
