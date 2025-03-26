// Load sample text into the input textarea
document.getElementById("sample-btn").addEventListener("click", function() {
  const sample = "Artificial Intelligence (AI) is rapidly transforming various industries, from healthcare and finance to robotics and entertainment. As AI models become more sophisticated, they enable machines to perform tasks that once required human intelligence. Machine learning, a subset of AI, allows systems to learn from data and improve their performance without explicit programming.";
  document.getElementById("input-text").value = sample;
});

// Paste text from clipboard into the input textarea
document.getElementById("paste-btn").addEventListener("click", async function() {
  try {
    const text = await navigator.clipboard.readText();
    document.getElementById("input-text").value = text;
  } catch (err) {
    alert("Failed to paste text: " + err);
  }
});

// Summarize function that sends the text to the backend
document.getElementById("summarize-btn").addEventListener("click", async function() {
  const inputText = document.getElementById("input-text").value.trim();
  const outputElement = document.getElementById("output-text");
  outputElement.textContent = "";

  if (!inputText) {
    outputElement.textContent = "Please provide some text.";
    return;
  }

  const payload = {
    text: inputText,
    num_sentences: 3  // Change this value if needed
  };

  try {
    const response = await fetch("/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    outputElement.textContent = data.summary || "Summary not available.";
  } catch (error) {
    outputElement.textContent = "Error summarizing text: " + error.message;
  }
});