const delay = ms => new Promise(res => setTimeout(res, ms));

const URL = "https://mathworld.wolfram.com";

const machine = document.getElementById("machine");
const result = document.getElementById("result");
const ball = document.getElementById("ball");
const explosion = document.getElementById("explosion");
const tokens = document.getElementById("tokens");

machine.ondragstart = () => false;

let pages = {};
// are you really gonna load that each time....
fetch("assets/pages.json")
    .then(response => response.json())
    .then(data => { pages = data; })

let tokensLeft = 3;

let inProgress = false;

async function updateTokens() {
    tokens.innerText = "";
    
    for (let i=0; i<tokensLeft; i++) {
        const token = document.createElement("img");
        token.src = "./assets/token.gif";
        tokens.appendChild(token);
    }
}

async function getPage() {
    page = pages[Math.floor(Math.random() * pages.length)];

    const title = document.createElement("a");
    title.innerText = page.title;
    title.href = `${URL}/${page.id}.html`;
    title.target = "_blank";
    result.appendChild(title);

    if (page.img) {
        console.log("img");
        const img = document.createElement("img");
        img.src = `${URL}/${page.img}`;
        result.appendChild(img);
    }
}

async function machineClick() {
    // TODO: check if can pull
    if (inProgress) { return }
    if (tokensLeft <= 0) { return }

    inProgress = true;

    tokensLeft -= 1;
    updateTokens();

    machine.classList = ["squish"];
    ball.classList = ["move"];
    result.textContent = "";

    await delay(200);

    machine.classList = [];

    await delay(300);

    ball.classList = [];
    explosion.classList = ["explode"];
    explosion.currentTime = 0;
    explosion.play();

    getPage();
    
    await delay(700);

    explosion.classList = [];

    inProgress = false;
}

machine.addEventListener("mousedown", machineClick);

updateTokens();
