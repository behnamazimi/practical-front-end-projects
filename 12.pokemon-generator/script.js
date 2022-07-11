const typeColor = {
  bug: "#26de81",
  dragon: "#ffeaa7",
  electric: "#fed330",
  fairy: "#FF0069",
  fighting: "#30336b",
  fire: "#f0932b",
  flying: "#81ecec",
  grass: "#00b894",
  ground: "#EFB549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afc0",
  poison: "#6c5ce7", 
  psychic: "#a29bfe",
  rock: "#2d3436",
  water: "#0190FF",
};
const url = "https://pokeapi.co/api/v2/pokemon/";
const card = document.getElementById("card");
const btn = document.getElementById("btn");

let getPokemonData = () => {
  //Generate a random number between 1 and 150
  let id = Math.floor(Math.random() * 150) + 1;
  //Combine the pokeapi url with pokemon id
  const finalUrl = url + id;
  //Fetch generated URL
  fetch(finalUrl)
    .then((response) => response.json())
    .then((data) => {
      generateCard(data);
    });
};

//Gnerate Card

let generateCard = (data) => {
  //Get necessary data and assign to variables
  console.log(data);
  const hp = data.stats[0].base_stat;
  const imgSrc = data.sprites.other.dream_world.front_default;
  const PokemonName = data.name[0].toUpperCase() + data.name.slice(1);
  const statAttack = data.stats[1].base_stat;
  const statDefense = data.stats[2].base_stat;
  const statSpeed = data.stats[5].base_stat;

  // Set themeColor based on pokemon type
  const themeColor = typeColor[data.types[0].type.name];
  console.log(themeColor);

  card.innerHTML = `
    
    <p class="hp" style="font-weight: 500;">
    <span>HP</span>
    ${hp}
</p>
<img src="${imgSrc}" />
<h2 class="pokemon-name">${PokemonName}</h2>
<div class="pokemon-types">
</div>
<div class="pokemon-stats">
    <div>
        <h3>Attack</h3>
        <p>${statAttack}</p>
    </div>
    <div >
        <h3>Defense</h3>
        <p>${statDefense}</p>
    </div>
    <div >
        <h3>Speed</h3>
        <p>${statSpeed}</p>
    </div>
</div> 
    `;
  appendTypes(data.types);
  stylecard(themeColor);
};
let appendTypes = (types) => {
  types.forEach((item) => {
    let span = document.createElement("SPAN");
    span.textContent = item.type.name;
    document.querySelector(".pokemon-types").appendChild(span);
  });
};
let stylecard = (color) => {
  card.style.background = `radial-gradient(
        circle at 50% 0%, ${color} 36%, #ffffff 36%
    )`;
  card.querySelectorAll(".pokemon-types span").forEach((typeColor) => {
    typeColor.style.backgroundColor = color;
  });
};

btn.addEventListener("click", getPokemonData);
window.addEventListener("load", getPokemonData);
