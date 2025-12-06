let currentResourceId = null;
let currentComments = [];


const RT =document.getElementById("resource-title");
const RD =document.getElementById("resource-description");
const RL =document.getElementById("resource-link");
const CL =document.getElementById("comment-list");
const Cf =document.getElementById("comment-form");
const NC =document.getElementById("new-comment");

// --- Functions ---


function getResourceIdFromURL() {
  const idPar = new URLSearchParams(window.location.search);
  return idPar.get("id");
}



function renderResourceDetails(resource) {
  
  RT.textContent = resource.title;
  RD.textContent = resource.description;
  RL.href = resource.link;
}



function createCommentArticle(comment) {
  
  const article = document.createElement("article");
  const p = document.createElement("p");
  p.textContent = comment.text;
  const footer = document.createElement("footer");
  footer.textContent = "posted by: " + comment.author;
  article.appendChild(p);
  article.appendChild(footer);
  return article;

}



function renderComments() {
  
  
  CL.innerHTML = "";
  for (let comment of currentComments) {
    const article = createCommentArticle(comment);
    CL.appendChild(article);
  }
}


function handleAddComment(event) {
  
  event.preventDefault();
  const commentText = NC.ariaValueMax.trim();
  if (commentText === "") {
    return;
  }else{
    const newComment = {author: "student", text:commentText};
    currentComments.push(newComment);
    renderComments();
    NC.value = "";
  }
}



async function initializePage() {
  
  currentResourceId = getResourceIdFromURL();
  if (!currentResourceId){
    RT.textContent = "Resource not found.";
    return;
  }else{
    const [resourcesResp, commentsResp] = await Promise.all([
      fetch("resources.json"),
      fetch("resource-comments.json"),
    ]);

    const resources = await resourcesResp.json();
    const commentsData = await commentsResp.json();

    const resource = resources.find((res) => res.id === currentResourceId);
    currentComments = commentsData[currentResourceId] || [];

    if (resource){
      renderResourceDetails(resource);
      renderComments();
      Cf.addEventListener("submit", handleAddComment)
    }
    else{
      RT.textContent = "Resource not found.";
    }
  }

}

// --- Initial Page Load ---
initializePage();
