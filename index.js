// BACKEND

// const { OpenAI } = require('openai');
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');  // Import fetch module
const cors = require('cors');  // Import cors module
const app = express();
const port = 3001;

app.use(cors());

app.use((req, res, next) => {
//    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.use(bodyParser.json());

app.get('/', async (req, res) => {
  console.log(`[*] ASKING STATE ONLINE !! ${req.body.url}`)
  try {
      const ollamaUrl = req.url;
      const response = await fetch(`http://${ollamaUrl}:11434`);
      const data = await response.text();
      res.send(data);  // Sending back content of fetch
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({message: "Internal Server Error"});
  }
});

// app.post('/openai', async (req, res) => {
//     console.log(`/openai`)
//     console.log(`[*] GPT REQUEST MESSAGE : ${req.body.message}`)
//     console.log(`[*] MODEL : ${req.body.model}`)
//     console.log(`[*] PROMPT : ${req.body.prompt}`)
//     try {
//         const start = new Date();  // Start time of the request
//         const chatCompletion = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [{"role": "user", "content": req.body.message}]
//         });
//         console.log(chatCompletion.choices[0].message.content)// it prints undefined
//         if(chatCompletion.data){
//             const end = new Date();  // End time of the request
//             const responseTime = end - start;  // Calculate response time
//             res.json({
//                 message: chatCompletion.choices[0].message.content,
//                 responseTime: `${responseTime}ms`  // Adding response time for the request
//             });
//         } else {
//             const end = new Date();  // End time of the request
//             const responseTime = end - start;  // Calculate response time
//             res.json({message: chatCompletion.choices[0].message.content, responseTime: `${responseTime}ms`});
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({message: "Internal Server Error"});
//     }
// });

app.post('/ollama', async (req, res) => {
    console.log(`[BACKEND] API @ /ollama`)
    console.log(`[*] OLLAMA REQUEST MESSAGE : ${req.body.message}`)
    console.log(`[*] SERVER : ${req.body.url}`)
    console.log(`[*] MODEL : ${req.body.model}`)
    console.log(`[*] PROMPT : ${req.body.prompt}`)

    try{
        const start = new Date();  // Start time of the request
        const model = req.body.model; // parse model from frontend
        const prompt = req.body.prompt; // parse model from frontend
        const request = req.body.message;
        const ollamaUrl = req.body.url;
        const options = {
          method: 'POST',
          url: `http://${ollamaUrl}:11434/api/generate`,
          headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/8.4.5'},
          body: {
            model: model,
            system_prompt: prompt,
            prompt: request,
            stream: false,
            temperature: 0.8,
            context_length: 1700,
            request_mode: "synchronous",
            beam_size: 1,
            max_length: 256,
            repetition_penalty: 1.2,
            temp: 0.98,
            top_k: 20,
            top_p: 0.9,
            num_keep: 5,
            seed: 42,
            num_predict: 100,
            tfs_z: 0.5,
            typical_p: 0.7,
            repeat_last_n: 33,
            repeat_penalty: 1.2,
            presence_penalty: 1.5,
            frequency_penalty: 1.0,
            mirostat: 1,
            mirostat_tau: 0.8,
            mirostat_eta: 0.6,
            penalize_newline: true,
            stop: ["\n", "user:"],
            numa: false,
            num_ctx: 1024,
            num_batch: 2,
            num_gqa: 1,
            num_gpu: 1,
            main_gpu: 0,
            low_vram: false,
            f16_kv: true,
            vocab_only: false,
            use_mmap: true,
            use_mlock: false,
            embedding_only: false,
            rope_frequency_base: 1.1,
            rope_frequency_scale: 0.8,
            num_thread: 4
          },
          json: true
        };
        const response = await fetch(options.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'insomnia/8.4.5'
          },
          body: JSON.stringify(options.body)
        });
        const data = await response.json();
        const end = new Date();  // End time of the request
        const responseTime = end - start;  // Calculate response time
        res.json({message: data.response, model: model, prompt: prompt, systemPrompt: data.system_prompt,url: ollamaUrl, responseTime: `${responseTime}ms`});  // Adding response time for the request

      } catch (err) {
        console.error("Error in ollama API");
        console.error(err); // Add more details for debugging
        const responseTime = "error";
        res.json({message: err, responseTime: `${responseTime}`});  // Adding response time for the request
      }
});

app.post('/ollama/chat', async (req, res) => {
  console.log(`[BACKEND] API @ /ollama/chat`)
  console.log(`[*] GPT REQUEST MESSAGE : ${req.body.messages[0].content}`)
  console.log(`[*] MODEL : ${req.body.model}`)
  try {
      const start = new Date();  // Start time of the request
      const chatCompletion = await openai.chat.completions.create({
          model: req.body.model,
          messages: req.body.messages
      });
      console.log(chatCompletion.choices[0].message.content)// it prints undefined
      if(chatCompletion.data){
          const end = new Date();  // End time of the request
          const responseTime = end - start;  // Calculate response time
          res.json({
              model: req.body.model,
              created_at: new Date(),
              message: {
                  role: "assistant",
                  content: chatCompletion.choices[0].message.content,
                  images: null
              },
              done: true,
              total_duration: responseTime,
              load_duration: 0,
              prompt_eval_count: 0,
              prompt_eval_duration: 0,
              eval_count: 0,
              eval_duration: 0
          });
      } else {
          const end = new Date();  // End time of the request
          const responseTime = end - start;  // Calculate response time
          res.json({
              model: req.body.model,
              created_at: new Date(),
              done: true,
              total_duration: responseTime,
              load_duration: 0,
              prompt_eval_count: 0,
              prompt_eval_duration: 0,
              eval_count: 0,
              eval_duration: 0
          });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({message: "Internal Server Error"});
  }
});

app.post('/ollama/models', async (req, res) => {
    console.log(`[BACKEND] API @ /ollama/models`)
    try {
        const ollamaUrl = req.body.url;
        const response = await fetch(`http://${ollamaUrl}:11434/api/tags`);
        if (response.ok) {
            const data = await response.json();
            console.log(`[!] Got ${data.models.length} Models from ${ollamaUrl}`);
            data.models.forEach(model => {
                console.log(model.name);
            });
            const start = new Date();  // Start time of the request
            const end = new Date();  // End time of the request
            const responseTime = end - start;  // Calculate response time in milliseconds
            console.log(`Response time : ${responseTime}`);
            res.json({state: "online", models: data.models, responseTime: `${responseTime} ms`});
        } else {
            console.log('Request timed out');
            res.json({state: "time_out", models: "error", responseTime: "error"});
        }
    } catch (error) {
        console.log('Error fetching models from BACKEND');
        res.json({state: "error", models: "error", responseTime: "error"});
        //console.error('Error fetching models:', error);
    }
});

app.listen(port, () => {
    console.log(`[*] BACK-END listening on port ${port}!`);
});







