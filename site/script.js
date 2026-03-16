const URL = "https://mathworld.wolfram.com";

const machine = document.getElementById("machine");
const result = document.getElementById("result");
let pages = {};

machine.ondragstart = () => false;

// are you really gonna load that each time....
fetch("assets/pages.json")
    .then(response => response.json())
    .then(data => { pages = data; })

/*
machine.addEventListener("mouseup", () => {
    page = pages[Math.floor(Math.random() * pages.length)];
    result.innerHTML = `<a href="${URL}/${page.id}.html" target="_blank">${page.title}</a>`;
});
*/

function getPage() {
    page = pages[Math.floor(Math.random() * pages.length)];
    result.textContent = "";

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

machine.addEventListener("click", () => {
    machine.classList = ["clicked"];
    setTimeout(() => {
        machine.classList = [];
        getPage();
    }, 200);
});
