import { useState } from "react";
import { RefreshCcw, Volume2 } from "lucide-react";

const questions = [
  {
    question: "What age group do you belong to?",
    options: ["3-5 years", "6-8 years", "9-12 years", "13+ years"],
  },
  {
    question: "How many people will be playing together?",
    options: ["1", "2", "3-5", "6-10", "10+"],
  },
  {
    question: "How much time do you have to play?",
    options: ["5-10 minutes", "15-30 minutes", "30+ minutes"],
  },
  {
    question: "Where will the game take place?",
    options: ["Indoors", "Outdoors", "Both indoors and outdoors"],
  },
  {
    question: "What materials do you have available?",
    options: [
      "Paper", "Pencils", "Crayons", "Balls", "Rope", "Blankets", "Water", "Marbles", "Hula Hoops", "Papier-mâché", 
      "Marshmallows", "Teddy Bears", "Building Blocks", "Drawing Paper", "Beads", "Rubber Bands", "Cardboard Boxes", "Chairs", "Cushions", "Balloons",
      "Cloths", "Boxes", "Hats", "Flashlights", "Fabric Pieces", "Legos", "Towels", "Scissors", "Tape", "String",
      "Cardboard Balls", "Plastic Bottles", "Small Figures", "Chalk", "Spoons", "Plastic Cups", "Feathers", "Yarn", "Stones", "Flowers",
      "Leaves", "Shovels", "Sand", "Lego Figures", "Clay", "Paper Bags", "Shoe Boxes", "Pipe Cleaners", "Clips", "Flag"
    ],
  },
  {
    question: "Do you prefer calm and quiet games or more active games?",
    options: ["Calm and quiet", "Active and energetic"],
  },
];

export default function LegeStepper() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(step === 4 ? [] : ""));
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];
    if (step === 4) {
      const selectedOptions = new Set(updatedAnswers[step]);
      if (selectedOptions.has(answer)) {
        selectedOptions.delete(answer);
      } else {
        selectedOptions.add(answer);
      }
      updatedAnswers[step] = Array.from(selectedOptions);
    } else {
      updatedAnswers[step] = answer;
    }
    setAnswers(updatedAnswers);
  };

  const handlePlay = async () => {
    if (answers.some((a, i) => (i === 4 ? a.length === 0 : a === ""))) return;
    setLoading(true);
    const prompt = `Opfind og igangsæt en fantasifuld leg for børn i alderen ${answers[0]}. Den skal gælde for ${answers[1]} børn. Legen vil have en varighed på cirka ${answers[2]}. Legen skal foregå ${answers[3]}. Følgende materialer er tilrådighed: ${answers[4].join(", " )}. Legen skal foregå ${answers[5]}. Baseret på materialerne og området leget foregår, skal du opfinde en fantasifuld baggrundshistorie som børnene kan leve sig ind i. Derudover skal du finde på et formål/mission med legen. Dit svar skal være på engelsk og mellem 10-15 linjer.`;

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await res.json();
      const content = data.choices[0].message.content;
      setResponse(content);
    } catch (error) {
      console.error("API call failed:", error);
      setResponse("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6 relative w-full min-h-screen bg-gray-50">
      {/* Image placeholders */}
      <div className="fixed bottom-5 left-2 w-1/4 max-w-xs m-4">
        <img src={`${import.meta.env.BASE_URL}undraw_doll-play_xrtu.svg`} alt="Left decoration" className="w-full h-auto" />
      </div>
      <div className="fixed bottom-5 right-2 w-1/4 max-w-xs m-4">
        <img src={`${import.meta.env.BASE_URL}undraw_toy-car_ugyu.svg`} alt="Right decoration" className="w-full h-auto" />
      </div>
      <div className="fixed top-0 left-0 w-1/6 max-w-xs m-4">
        <svg width="300" height="100" xmlns="http://www.w3.org/2000/svg">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                    font-family="Comic Sans MS, Comic Sans, cursive"
                    font-size="32"
                    fill="#1e3a8a"
                    stroke="#333"
                    stroke-width="1"
                    letter-spacing="2">
                LET'S PLAY
            </text>
        </svg>
      </div>

      {!response && (
        <div className="flex flex-col items-center w-full max-w-md mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full text-center border border-gray-200">
            <div>
              <h2 className="text-2xl font-bold mb-6">{questions[step].question}</h2>
              <div className={`grid gap-3 mb-6 ${step === 4 ? 'h-80 overflow-y-scroll' : ''}`}>
                {questions[step].options.map((option) => (
                  <button 
                    key={option} 
                    onClick={() => handleAnswer(option)}
                    className={`border rounded-xl px-4 py-3 transition duration-200 ${step === 4 && answers[step].includes(option) ? 'bg-blue-900 text-white border-blue-900' : step !== 4 && answers[step] === option ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-blue-900 border-blue-900 hover:bg-blue-900 hover:text-white'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button 
                  onClick={() => step > 0 && setStep(step - 1)}
                  disabled={step === 0}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
                >
                  Back
                </button>
                <button 
                  onClick={() => step < questions.length - 1 ? setStep(step + 1) : handlePlay()}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  {step < questions.length - 1 ? "Next" : loading ? "Generating..." : "Let's Play"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {response && (
        <div className="fixed inset-0 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center border border-gray-200">
            <div>
              {response === "Something went wrong. Please try again." ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">Something went wrong. Please try again.</h3>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="flex items-center justify-center gap-2 bg-blue-900 text-white px-4 py-2 rounded mt-4"
                  >
                    <RefreshCcw size={20} /> Refresh
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-4">Play Description:</h3>
                  <p>{response}</p>
                  <button 
                    onClick={() => {
                      const utterance = new SpeechSynthesisUtterance(response);
                      utterance.lang = 'en-US';
                      window.speechSynthesis.speak(utterance);
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-900 text-white px-4 py-2 rounded mt-4"
                  >
                    <Volume2 size={20} /> Read Aloud
                  </button>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="flex items-center justify-center gap-2 bg-blue-900 text-white px-4 py-2 rounded mt-4"
                  >
                    <RefreshCcw size={20} /> Start Over
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
