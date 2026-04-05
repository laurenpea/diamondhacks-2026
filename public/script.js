let currentFactId = null;
let selectedSentence = null;

// 1. Fetch from your Node.js server
document.getElementById('btn-generate').addEventListener('click', async () => {
  const response = await fetch('http://localhost:3000/api/generate');
  const data = await response.json();
  
  currentFactId = data.factId;
  displayParagraph(data.paragraph);
});

// 2. Turn text into clickable spans
function displayParagraph(text) {
  const container = document.getElementById('text-display');
  container.innerHTML = ''; // Clear old text
  
  // Regex to split by sentences (period, bang, or question mark followed by space)
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g);

  sentences.forEach(s => {
    const span = document.createElement('span');
    span.innerText = s + " ";
    span.classList.add('sentence');
    
    span.onclick = () => {
      // UI: Remove 'active' from others, add to this one
      document.querySelectorAll('.sentence').forEach(el => el.classList.remove('selected'));
      span.classList.add('selected');
      
      selectedSentence = s;
      document.getElementById('analysis-zone').classList.remove('hidden');
    };
    
    container.appendChild(span);
  });
  
  document.getElementById('case-container').classList.remove('hidden');
}