// FRONTEND

import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import promptList from './prompts.json';
import serverList from './servers.json';
import ReactMarkdown from 'react-markdown';

function App() {

  const [backEndState, setBackEndState] = useState('...');
  const [backEndServer, setBackEndServer] = useState('localhost');
  const [backEndPing, setBackEndPing] = useState('... ms');

  const [ollamaServer, setOllamaServer] = useState('localhost');
  const [ollamaState, setOllamaState] = useState('...');
  const [ollamaPing, setOllamaPing] = useState('...');

  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('...');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState('... ms');

  const [ollamaModels, setOllamaModels] = useState([{ name: '...' }]);
  // const [openaimodels, setOpenAIModels] = useState([{ name: '3.5 turbo' }]);
  const chatHistoryRef = useRef();
  
  //const [selectedModel, setSelectedModel] = useState('mistral:7b-instruct-q4_K_M');
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState({ name: 'Default', prompt: 'You are a helpful Assistant.' });
  
  const fetchModels = async () => {
    setBackEndState("Fetching...");
    setOllamaState("Fetching...");

    try {
      const response = await fetch(`http://localhost:3001/ollama/models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: ollamaServer})
      });
      if (response.status === 200) {
        setBackEndState("online")
        const data = await response.json();
        setBackEndPing(data.responseTime);
        setOllamaModels(data.models);
        setOllamaState(data.state)
      } else {
        setBackEndState(response.status);
        throw new Error('Failed to fetch models');
      }
    } catch (error) {
      console.log('Error fetching models:', error);
      setOllamaModels([{ name: '...' }]);
      setBackEndState("Offline !");
      setResponseTime("error");
      console.error('Error fetching models:', error);
    }
  };
  
  useEffect(() => {
    
    fetchModels();

  }, [ollamaServer]); // Added 'ollamaServer' to the dependency array of useEffect


  const renderServers = () => {
    return Object.keys(serverList).map((key, index) => (
      <Dropdown.Item 
        key={index} 
        href="#" 
        title={serverList[key]} 
        onClick={(event) => { 
          setOllamaServer(serverList[key]); 
          handleServer(event);
        }}
      >
        {serverList[key]}
      </Dropdown.Item>
    ));
  };

  
  const renderModels = () => {
    console.log(ollamaModels);
    return Object.keys(ollamaModels).map((key, index) => {
      if (ollamaModels[key]) {
        return (
          <Dropdown.Item 
            key={index} 
            href="#" 
            onClick={() => { 
              setSelectedModel(ollamaModels[key].name); 
            }}
            title={`modified_at: ${ollamaModels[key].modified_at}`} // add modified_at as hover bubble text
          >
            {ollamaModels[key].name}
          </Dropdown.Item>
        );
      }
      return null;
    });
  };


  const renderPrompts = () => {
    return Object.keys(promptList).map((key, index) => (
      <Dropdown.Item 
        key={index} 
        href="#" 
        title={promptList[key].prompt} 
        onClick={() => { 
          setSelectedPrompt(promptList[key]);
        }}
      >
        {promptList[key].name}
      </Dropdown.Item>
    ));
  };
  const handleServer = async (event) => {
    
    fetchModels();
  };
  
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
  
  const handleNewMessage = () => {
    if (chatHistoryRef) {
      console.log(chatHistoryRef)
    }
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();

      const url = `http://localhost:3001/ollama`;
      const body = { message: message, model: selectedModel, prompt: selectedPrompt.prompt, url: ollamaServer };

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
          setChatHistory(prevChatHistory => [...prevChatHistory, { request: message, response: <ReactMarkdown>{data.message}</ReactMarkdown>, responseTime: data.responseTime, model: data.model, prompt: data.prompt, server: data.ollamaServer}]);
          setLoading(false);
          handleNewMessage();
        })
        .catch(error => {
          console.error('Error:', error);
          setLoading(false);
          handleNewMessage();

        });

  };
  
  const handleSpam = (event) => {
    event.preventDefault();
    for (let i = 0; i < 10; i++) {
      setLoading(true);
      handleSubmit(event);
      setLoading(false);
    }
  };
  
  return (
    <div className="App" data-bs-theme="dark">
      <div className="container-fluid dark-mode">
        <div className="row">
          <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse">
            <div className="position-sticky">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a className="navbar-brand" href="/">
                    <h1>mxGPT</h1>
                    <h4>{backEndState}</h4>
                    <h4>@{backEndServer}:3001</h4>
                    <h4>{backEndPing}</h4>
                  </a>
                </li>
                <hr/>

                <div className="info" style={{fontSize: '18px'}}>
                  <h3>API</h3>
                  <DropdownButton id="dropdown-basic-button" title={ollamaState !== 'online' ? "Server" : "Server"} variant={ollamaState !== 'online' ? "warning" : "primary"}>
                    {renderServers()}
                  </DropdownButton>
                  <div className="data">
                  <a>{ollamaServer}</a>
                  <br/>
                  <a>{ollamaState}</a>
                  <br/>
                  <a>{responseTime}</a>
                  <br/>
                  <a>{new Date().toLocaleTimeString()}</a>
                  </div>
                </div>
                <hr/>
                <div id="info" className="info" style={{fontSize: '18px'}}>
                  <div>Model: </div>
                  <DropdownButton id="dropdown-basic-button" title="Model" variant={selectedModel ? "primary" : (ollamaState !== 'online' ? "disabled" : "warning")}>
                    {renderModels()}
                  </DropdownButton>
                  <span><strong>{selectedModel}</strong></span>
                </div>
                <hr/>
                <div id="info" className="info" style={{fontSize: '12px'}}>
                  <div>Prompt:</div>
                  <DropdownButton id="dropdown-basic-button" title={selectedPrompt.name}>
                    {renderPrompts()}
                  </DropdownButton>
                  <div>{selectedPrompt.prompt}</div>
                </div>
                <hr/>
              </ul>
            </div>
          </nav>
          <main id="App-header" className="App-header col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-dark">
            <div id="chat-history" className="chat-history bg-dark">
              {ollamaState !== 'online' ? (
                <div id="chat-box" className="chat-box">
                  <div id="message-request" className="alert alert-danger" key={0} role="alert">
                    Server Offline
                    <pre>Please run Ollama Server API</pre>
                  </div>
                </div>
              ) : (
                chatHistory.map((message, index) => (
                  <div id="chat-box" className="chat-box" key={index}>
                    <div style={{color: 'white', textAlign: 'center'}}>{index === chatHistory.length - 1 ? `Last message #${index}` : ''}</div>
                    <div id="message-request" className="message-request alert alert-dark" role="alert">
                      {message.request}
                    </div>
                    <div id="message-response" className="message-response alert alert-primary" role="alert">
                      {message.response}
                    </div>
                    <div id="log" className="log">
                      <div>Server: {message.server} | Debug :SysPrompt: {message.systemPrompt} |Prompt: {message.prompt} | messageResponseTime: {message.responseTime} | Model : {message.model}</div>
                    </div>
                  </div>
                ))
              )}
              {loading ? (
                <div id="chat-history" className="chat-history bg-dark">
                  <div id="chat-box" className="chat-box">
                    <div id="message-request" className="alert alert-warning" role="alert">
                      Init Model : <strong>{selectedModel}</strong> ! Please wait...
                    </div>
                    <div id="response-time" className="response-time">
                      {message.messageResponseTime}
                    </div>
                  </div><div id="log" className="log">{message.messageResponseTime}</div>
                </div>
              ) : (
                <div id="log" className="log">{message.messageResponseTime}</div>
              )}
            </div>
            <form id="input" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  className="form-control"
                  id="message"
                  value={message}
                  onChange={handleMessageChange}
                  onKeyPress={(event) => {
                    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                      // Select through history
                    } else if (event.key === 'Enter') {
                      handleSubmit(event);
                    }
                  }}
                  type="text"
                  placeholder={selectedModel ? `Talk to ${selectedModel} @ ${ollamaServer}` : "Select a model first !"}
                  disabled={!selectedModel || backEndState !== 'online'}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={!selectedModel || backEndState !== 'online'}>
                Submit
              </button>
              <button className="btn btn-warning" onClick={handleSpam} disabled={backEndState === 'offline' || !message}>
                Spam
              </button>
              <button className="btn btn-success" onClick={() => { 
                setSelectedPrompt({name: "Fun", prompt: 'You act as a linux terminal prompt receiving commands. Use full markdown format beggining by ```'});
                setMessage(["ls"]);
                setLoading(false);
              }}>
                Fun
              </button>

            </form>
            <button className="btn btn-dark" onClick={() => { 
                setMessage('');
                setResponse('');
                setLoading(false);
              }}>
                Reset
            </button>
            <button className="btn btn-dark" onClick={() => { 
                setMessage('...');
                setLoading(false);
              }}>
                Test
            </button>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;




