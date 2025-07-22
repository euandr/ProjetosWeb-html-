const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelection');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById("askButton");
const IaResponse = document.getElementById("IaResponse");
const form = document.getElementById("form");

// chv_API = AIzaSyAlT130m78o0MYkq_QVEm5VeKYo2d0Wqr0

const perguntarIA = async (question, game, apiKey) =>{
    const model = "gemini-2.0-flash";
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const pergunta = `
        ## Especialidade
        Você é um assistente especializado em estratégias e meta do jogo **${game}**.

        ## Tarefas
        Responda às perguntas do usuário com base no seu conhecimento sobre mecânicas, estratégias, builds, dicas e otimizações dentro do jogo.

        ## Regras
        - Se não souber a resposta com base no patch atual, diga: **"Não sei"**.
        - Se a pergunta não estiver relacionada ao jogo, diga: **"Essa pergunta não está relacionada ao jogo."**
        - Use como base a data de hoje: **${new Date().toLocaleDateString()}**
        - Considere o patch mais recente disponível até essa data.
        - Não invente informações; apenas use dados confirmados e relevantes.

        ## Respostas
        - Seja direto e objetivo, com no máximo **500 caracteres**.
        - Formate a resposta usando **markdown bem estruturado e visualmente agradável**.
        - Não inclua saudações ou despedidas. Responda apenas o que foi pedido.
        - Pode ir além do exemplo abaixo para entregar o melhor design possível.

        ## Exemplo de Resposta
        **Pergunta do usuário:** Melhor build para personagem X  
        **Resposta:**  
        **Itens principais:**  
        - Item 1  
        - Item 2  

        **Runas/Habilidades:**  
        - Runa 1  
        - Runa 2  

        ---

        **Aqui está a pergunta do usuário:** ${question}
        `

    const contents = [{
        role: "user",
        parts:[{
            text:pergunta
        }]
    }]


// pode colocar mais ferramentas. Nesse caso ela usara somente as ferramentas do google.
    const tools = [{
        google_search: {}
    }]


    // chamada API
    const response = await fetch(geminiUrl,{
        method: "POST", //enviar
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents
        })
    })

    const data = await response.json();
    // console.log("Resposta da IA: ", data);
    return data.candidates[0].content.parts[0].text;
}



const enviarFormulario = async (event) => {
    event.preventDefault();
    // pegar informacoes dos campos
    const apiKey = apiKeyInput.value;
    const game = gameSelect.value;
    const question = questionInput.value;

    if (apiKey == "" || game == "" || question == "") {
        alert("Por favor, preencha todos os campos!!!");
        return;
    }
    
    askButton.disabled = true;
    askButton.textContent = "Enviando...";
    askButton.classList.add("loading");

    try{
        // Perguntar para a IA
        const text = await perguntarIA(question,game,apiKey);
        const converter = new showdown.Converter();

        // Converte Markdown para HTML
        const htmlConvertido = converter.makeHtml(text);
        IaResponse.querySelector('.response-content').innerHTML = htmlConvertido;
        IaResponse.classList.remove('hidden');


    } catch(error){
        console.log("Error: ", error);
    } finally {
        askButton.disabled = false; 
        askButton.textContent = "Perguntar";
        askButton.classList.remove("loading");
    }

}
form.addEventListener("submit", enviarFormulario);
  