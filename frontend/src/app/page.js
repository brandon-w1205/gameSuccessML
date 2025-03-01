'use client'
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [step, setStep] = useState(1);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    console: '',
    genre: '',
    critic_score: '',
  });
  const [consoles, setConsoles] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    // fetch('http://localhost:5000/consoles')
    fetch('https://gamesuccessml.onrender.com/consoles')
      .then((response) => response.json())
      .then((data) => setConsoles(data))
      .catch((error) => console.error('Error fetching consoles:', error));
    // fetch('http://localhost:5000/genres')
    fetch('https://gamesuccessml.onrender.com/genres')
      .then((response) => response.json())
      .then((data) => setGenres(data))
      .catch((error) => console.error('Error fetching genres:', error));
  }, []);

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

    // const response = await fetch('http://localhost:5000/submit', {
    const response = await fetch('https://gamesuccessml.onrender.com/submit', {
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

  const handleGenreClick = (genre) => {
    setFormData({ ...formData, genre });
    handleNext();
  }
  
  const handleConsoleClick = (console) => {

    setFormData({ ...formData, console });
    handleNext();
  }

  const handleBegin = () => {
    setStep(1);
    setFormData({
      title: '',
      console: '',
      genre: '',
      critic_score: '',
    });
    setPrediction(null);
  }

  return (
    <div className="grid items-center justify-items-center min-h-screen">
      <head>
        <title>Game Success Predictor</title>
      </head> 
      <h1>Game Success Predictor</h1>
      <div className="flex flex-col gap-4 text-center">
        <div>
          <h1>Data Visualizations</h1>
        </div>
        <div className="">
          <Image src="/decision_tree.png" alt="Decision Tree Distribution" width={1920} height={400} />
          <h2>Distribution of Game Genres</h2>
        </div>
        <div className="flex flex-row gap-4">
          <div className="">
            <Image src="/genre_distribution.png" alt="Genre Distribution" width={800} height={400} />
            <h2>Distribution of Game Genres</h2>
          </div>
          <div>
            <Image src="/critic_vs_sales.png" alt="Critic Score vs Total Sales" width={800} height={400} />
            <h2>Critic Score vs Total Sales</h2>
          </div>
          <div>
            <Image src="/console_distribution.png" alt="Console Distribution" width={800} height={400} />
            <h2>Distribution of Games Across Consoles</h2>
          </div>
        </div>
      </div>
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
                    className="border rounded-lg"
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
                  Select a Genre:
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
                  Select a Console:
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
                  Critic Score {"(From 0.0 - 10.0)"}:{" "} 
                  <input 
                    className="border rounded-lg"
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
                <div>
                  <button type="button" onClick={handleBegin} className={`px-4 py-2 rounded transition-all hover:bg-blue-400 hover:text-white active:scale-95`}>
                    Back to Beginning
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>


      </main>
    </div>
  );
}
