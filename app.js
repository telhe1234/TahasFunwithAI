const form = document.querySelector("#promptForm");
const container = document.querySelector("#container");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  fetchPromptResponse();
});
const addPromptResultToResponses = (prompt) => {
  // create a new div element
  const newDiv = document.createElement("div");

  // and give it some content
  const $promptResult = createPromptElement(prompt);

  // add the text node to the newly created div
  // newDiv.appendChild(newContent);

  // add the newly created element and its content into the DOM
  // document.getElementById("container").prepend(newDiv);
  $("#container").prepend($promptResult);
  // document.body.insertBefore(newDiv, container);
};
// const escape = function (str) {
//   let div = document.createElement("div");
//   div.appendChild(document.createTextNode(str));
//   return div.innerHTML;
// };

const createPromptElement = (promptResult) => {
  const $promptRes = $(`
    <article class="promptResult">
      <header>
        <div class="prompt">${form.elements.prompt.value}</div>
      </header>
      <body>
        <div class="prompt-show-result">${promptResult}</div>
      </body>
    </article>
  `);
  return $promptRes;
};

const fetchPromptResponse = async () => {
  const prompt = form.elements.prompt.value;
  console.log(prompt);
  // const config = { params: { q: prompt } };
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
      console.log(data.choices[0].text);
      addPromptResultToResponses(data.choices[0].text);
      form.elements.prompt.value = "";
    })
    .catch((err) => JSON.stingify(err));
};
