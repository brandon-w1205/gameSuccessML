'use client'
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [prediction, setPrediction] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    console: '',
    genre: '',
    critics: '',
  });

  const handleNext = () => {
    setStep(step + 1);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>Game Success Predictor</h1>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {step === 1 && (
              <div>
                <label>
                  Title:
                  <input 
                    type="text"
                    name="title"
                    value={formData.title}
                    // defaultValue="The Last of Us"
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
                  <input 
                    type="text"
                    name="genre"
                    value={formData.genre}
                    // defaultValue="Action-Adventure"
                    onChange={handleChange}
                    required
                  />
                </label>
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                <label>
                  Console:
                  <input 
                    type="text"
                    name="console"
                    value={formData.console}
                    // defaultValue="PS4"
                    onChange={handleChange}
                    required
                  />
                </label>
                <button type="button" onClick={handleNext}>
                  Next
                </button>
              </div>
            )}

            {step === 4 && (
              <div>
                <label>
                  Critic Score:
                  <input 
                    type="number"
                    name="critics"
                    value={formData.critics}
                    // defaultValue="90"
                    onChange={handleChange}
                    required
                  />
                </label>
                <button type="submit">
                  Submit
                </button>
              </div>
            )}
          </form>
        </div>

        <div>
            {prediction !== null && (
              <div>
                <h2>Prediction:</h2>
                <p>{prediction}</p>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
