// FRONTEND

import React, { useState, useEffect, useRef } from 'react';  // Added useRef
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';  // Corrected import for Bootstrap CSS
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import prompts from './prompts.json';  // define prompt as prompt.json

function App() {


  // BASIC
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);  // Added loading state
  const [responseTime, setResponseTime] = useState('');  // Added responseTime state

  // CUSTOM
  const [ollamaModels, setOllamaModels] = useState([{ name: 'llama2' }]);
  const [openaimodels, setOpenAIModels] = useState([{ name: 'chat-gpt' }]);
  const chatHistoryRef = useRef();  // Added useRef for chatHistory
  
  // STATES
  const [selectedModel, setSelectedModel] = useState('llama2:7b-chat-q4_K_M');  // Added selectedModel state
  const [selectedPrompt, setSelectedPrompt] = useState('default');  // Added selectedModel state
  const [currentModel, setCurrentModel] = useState('llama2:7b-chat-q4_K_M');  // Added currentModel state
  const [currentPrompt, setCurrentPrompt] = useState('default');  // Added currentPrompt state
 
  useEffect(() => {
    fetch('http://localhost:11434/api/tags')
      .then(response => response.json())
      .then(data => {
        setOllamaModels(data.models);
      })
      .catch(error => {
        console.error('Error fetching models:', error);
      });
  }, []);

  const renderPrompts = () => {
    return Object.keys(prompts).map((key, index) => (
      <Dropdown.Item key={index} href="#" title={prompts[key].prompt} onClick={() => { setSelectedPrompt(prompts[key].prompt); }}>{prompts[key].name}</Dropdown.Item>
    ));
  };

  const renderModels = (models, setSelectedModel, setSelectedPrompt) => {
    return models.map((model, index) => (
      <Dropdown.Item key={index} href="#" onClick={() => { setSelectedModel(model.name); setSelectedPrompt(model.prompt); }}>{model.name}</Dropdown.Item>
    ));
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleNewMessage = () => {
    chatHistoryRef.current.scrollIntoView({ behavior: "smooth" });  // Automatically scroll down chat-history
  };

  
  const handleSubmit = (event) => {
    setLoading(true);  // Set loading to true when request is being processed
    event.preventDefault();

    const selectedModelIsOllama = ollamaModels.map(model => model.name).includes(selectedModel);
    const selectedModelIsOpenAI = openaimodels.map(model => model.name).includes(selectedModel);

    if (selectedModelIsOllama || selectedModelIsOpenAI) {
      const url = selectedModelIsOllama ? 'http://localhost:3001/ollama' : 'http://localhost:3001/openai';
      const body = selectedModelIsOllama ? { message: message, model: selectedModel, prompt: selectedPrompt } : { message };

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
      })
        .then(response => response.json())
        .then(data => {
          setResponse(data.message);
          setResponseTime(data.responseTime);
          setChatHistory(prevChatHistory => [...prevChatHistory, { request: message, response: data.message, responseTime: data.responseTime }]);
          setLoading(false);  // Set loading to false after receiving response
          setCurrentModel(selectedModel);  // Set currentModel to selectedModel after receiving response
          setCurrentPrompt(selectedPrompt);  // Set currentModel to selectedModel after receiving response
        })
        .catch(error => {
          console.error('Error:', error);
          setLoading(false);  // Set loading to false in case of error
        });
    } else {
      console.error('ERROR WITH MODEL');
      setLoading(false);  // Set loading to false in case of error
      setResponse('Error with model');  // Send response error
    }
  };

  const handleSpam = (event) => {
    setLoading(true);  // Set loading to true when request is being processed
    event.preventDefault();
    for (let i = 0; i < 10; i++) {
      setLoading(true);  // Set loading to true when request is being processed
      handleSubmit(event);
      setLoading(false);  // Set loading to false in case of error
    }
  };
  return (
    <div className="App" data-bs-theme="dark">
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{width: '280px'}}>
              <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <svg className="bi pe-none me-2" width="40" height="32"><use xlinkHref="#bootstrap"></use></svg>
                <span className="fs-4">Sidebar</span>
              </a>
              <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                  <a href="#" className="nav-link active" aria-current="page">
                    <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#home"></use></svg>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link text-white">
                    <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#speedometer2"></use></svg>
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link text-white">
                    <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#table"></use></svg>
                    Orders
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link text-white">
                    <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#grid"></use></svg>
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link text-white">
                    <svg className="bi pe-none me-2" width="16" height="16"><use xlinkHref="#people-circle"></use></svg>
                    Customers
                  </a>
                </li>
              </ul>
              <hr />
              <div className="dropdown">
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
                  <li><a className="dropdown-item" href="#">New project...</a></li>
                  <li><a className="dropdown-item" href="#">Settings</a></li>
                  <li><a className="dropdown-item" href="#">Profile</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Sign out</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-10">
            <span>Model : <strong>{selectedModel}</strong> | Prompt : <strong>{selectedPrompt}</strong></span>
            <a className="navbar-brand" href="/">
              <img src={logo} className="App-logo" alt="logo" style={{width: '50%', height: '50%'}} />
              <span>marvax-gpt</span>
            </a>
          </div>
        </div>
      </div>
      <header className="App-header">
        <hr style={{borderColor: 'white'}} />
        <div id="chat-history" className="chat-history">
          {chatHistory.map((message, index) => (
            <div id="chat-box" key={index} className="alert alert-secondary" role="alert">
              {index} - {message.request}
              <div id="message.response" key={index} className="alert alert-primary" role="alert">
                {message.response}
              </div>
            </div>
          ))}
        </div>
        <div style={{color: 'white', textAlign: 'right', fontSize: '12px', marginTop: '5px'}}>response time : {responseTime}</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="message" style={{color: 'white'}}>Ask Anything...</label>
            <textarea
              className="form-control"
              id="message"
              value={message}
              onChange={handleMessageChange}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleSubmit(event);
                }
              }}
              rows="1"
              cols="30"
              placeholder="Type your message here"
              style={{backgroundColor: '#282c34', color: 'white'}}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary" style={{backgroundColor: '#282c34', color: 'white'}}>Submit</button>
          <button className="btn btn-primary" style={{backgroundColor: '#282c34', color: 'white'}} onClick={handleSpam}>Spam</button>
        </form>
      </header>
      <footer className="footer mt-auto py-3 bg-body-tertiary">
        <p>© 2024 Marvax
        <a
          href="https://m4rv4x.fun"
          target="_blank"
          rel="noopener noreferrer"
        >
         . [links]
        </a>
        </p>
      </footer>
    </div>
  );
}
export default App;
