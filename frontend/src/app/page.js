'use client'
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    console: '',
    genre: '',
    critic_score: '',
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'critic_score') {
      const score = parseFloat(value);
      if (score > 10.0) {
        alert('Critic score cannot be greater than 10.0');
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setPrediction(data.prediction);

  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step < 4) {
        handleNext();
      } else {
        handleSubmit(e);
      }
    }
  }

  const genres = ['Action', 'Action-Adventure', 'Adventure', 'Shooter', 'Misc', 'Music', 'Platform', 'Puzzle', 'Racing', 'Strategy', 'Fighting', 'Party', 'Role-Playing', 'Simulation', 'Sports', 'Visual Novel'];

  const handleGenreClick = (genre) => {
    setFormData({ ...formData, genre });
    handleNext();
  }

  const consoles = ['PlayStation 2', 'PlayStation 3', 'PlayStation 4', 'PlayStation 5', 'Xbox 360', 'Xbox One', 'Wii', 'PC', 'GameBoy Advance', 'DS'];
  
  const handleConsoleClick = (console) => {
    if (console === 'Xbox 360') {
      console = 'X360';
    }
    if (console === 'Xbox One') {
      console = 'XOne';
    }
    if (console === 'PlayStation 2') {
      console = 'PS2';
    }
    if (console === 'PlayStation 3') {
      console = 'PS3';
    }
    if (console === 'PlayStation 4') {
      console = 'PS4';
    }
    if (console === 'PlayStation 5') {
      console = 'PS5';
    }
    if (console === 'GameBoy Advance') {
      console = 'GBA';
    }
    setFormData({ ...formData, console });
    handleNext();
  }

  return (
    <div className="grid items-center justify-items-center min-h-screen">
      <h1>Game Success Predictor</h1>
      <main className="flex flex-col gap-8 row-start-2 items-center pb-50">
        <div className='pb-50'>
            {prediction !== null && (
              <div>
                <h2>Prediction:</h2>
                <p>{formData.title} will be a {prediction}!</p>
              </div>
            )}
        </div>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {step === 1 && (
              <div onKeyDown={handleKeyDown}>
                <label>
                  Title:{" "}
                  <input 
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </label>
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <label>
                  Genre:
                </label>
                <div>
                  {genres.map((genre) => (
                    <button 
                      key={genre} 
                      type="button" 
                      onClick={() => handleGenreClick(genre)}
                      className={`px-4 py-2 rounded transition-all hover:bg-blue-400 hover:text-white active:scale-95`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <label>
                  Console:
                </label>
                <div>
                  {consoles.map((console) => (
                    <button 
                      key={console} 
                      type="button" 
                      onClick={() => handleConsoleClick(console)}
                      className={`px-4 py-2 rounded transition-all hover:bg-blue-400 hover:text-white active:scale-95`}
                    >
                      {console}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <label>
                  Critic Score:{" "} 
                  <input 
                    type="number"
                    name="critic_score"
                    value={formData.critic_score}
                    onChange={handleChange}
                    required
                  />
                </label>
                <button type="submit" className={`px-4 py-2 rounded transition-all hover:bg-blue-400 hover:text-white active:scale-95`}>
                  Submit
                </button>
              </div>
            )}
          </form>
        </div>


      </main>
    </div>
  );
}
