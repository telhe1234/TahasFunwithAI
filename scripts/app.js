const form = document.querySelector("#prompt-form");
const container = document.querySelector("#container");
const promptResultsList = [];
let promptResultObj = {};
const promptsHistoryList = [];
let num = 0;
let promptKey = "";
let prompt = form.elements.prompt.value || promptKey;
let promptValue = "";

// render prompts results on load of page(when page is refreshed)
const renderPrompts = (list) => {
  // loop over prompts list
  for (const prompt of list) {
    // retrieve and store prompt entered by user in promptKey variable
    promptKey = Object.keys(prompt)[0];
    // retrieve and store prompt result in promptValue
    promptValue = Object.values(prompt)[0];
    // render prompt result in the Responses container
    addPromptResultToResponses(promptKey, promptValue);
    num++;
  }
};

$(form).on("submit", function (e) {
  e.preventDefault();
  fetchPromptResponse();
});
const addPromptResultToResponses = (prompt, promptResult) => {
  // calls createPromptElement for each prompt entered
  const $promptResult = createPromptElement(prompt, promptResult);

  // takes return value and prepends it to the prompts container
  $("#container").prepend($promptResult);
};
// function to escape JavaScript/HTML injection attacks
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createPromptElement = (prompt, promptResult) => {
  const $promptRes = $(`
    <article class="prompt-result-container rounded p-3 col-8 mx-auto">
      <header>
        <div class="prompt"><span class="prompt-label">Prompt: </span><span class="prompt-span">${escape(
          prompt
        )}</span></div>
      </header>
      <body>
        <div class="prompt-show-result mt-2"><span class="prompt-result-label">Response: </span><span class="prompt-result-span">${promptResult}</span></div>
      </body>
    </article>
  `);
  return $promptRes;
};

const fetchPromptResponse = async () => {
  const prompt = form.elements.prompt.value;
  const data = {
    prompt: `${prompt}`,
    temperature: 0.5,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };
  fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.process.env.OPENAI_SECRET}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      // render current prompt result in the responses container
      addPromptResultToResponses(prompt, data.choices[0].text);
      // reset prompt textarea to ""
      form.elements.prompt.value = "";
      // save prompt and prompt's response in promptResultObj to be pushed into the promptResultList
      promptResultObj[`${prompt}`] = data.choices[0].text;
      // promptResultsList is an array of objects that saves the prompt results for the current user
      promptResultsList.push(promptResultObj);
      // save promptResultsList array of prompts(and responses) in localStorage to be used when the current user refreshes the page
      // localStorage setItem method gives a string so to store the array of objects we need to Json.stringify the array
      localStorage.setItem(
        "promptResultsList",
        JSON.stringify(promptResultsList)
      );
      // reset promptResultObj to store a new prompt object
      promptResultObj = {};
    })
    .catch((err) => JSON.stringify(err));
};

// Save responses if the user leaves or reloads the page/on load of page
$(window).on("load", function () {
  let promptResults = JSON.parse(localStorage.getItem("promptResultsList"));
  console.log(promptResults);
  renderPrompts(promptResults);
});
