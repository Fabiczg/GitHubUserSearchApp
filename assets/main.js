const checkbox = document.getElementById('checkbox');

checkbox.addEventListener('change', () => {
  // change the theme of the website
  document.body.classList.toggle('dark');
});

const btnSearch =  document.querySelector(".container-search button");
const inputUser =  document.querySelector(".container-search input");
const mainContainer =  document.querySelector(".wrapper");
const containerSection =  document.querySelector(".info-result");

const url = "https://api.github.com/users/";

btnSearch.addEventListener("click", buscarUser);

function buscarUser(e){
    e.preventDefault();

    //console.log(inputUser.value);
    if (inputUser.value === "") {
        mostrarError("Escriba un user de GitHub...");
        return;
    }
    callApiUser(inputUser.value);
}

async function callApiUser(user){
    const userUrl = url + user;
    const repoUrl = `${url}${user}/repos`;
    try {
        const data = await Promise.all([fetch(userUrl), fetch(repoUrl)]);
        if (data[0].status === 404) {
            mostrarError("No existe el usuario...");
            return;
        }
        const dataUser = await data[0].json();
        const dataRepo = await data[1].json();
        //console.log(dataUser);
        //console.log(dataRepo);
        mostrarData(dataUser);
        mostrarRepos(dataRepo);
    } catch (error) {
        console.log(error);
    }

}

function mostrarData(dataUser){
    clearHTML();
    const {avatar_url, bio, followers, following, name, public_repos, login, created_at, location, twitter_username, company, blog} = dataUser;
    const container = document.createElement("div");
    container.innerHTML = `
    <div class="result">
          <div class="profile">
              <img src="${avatar_url}" alt="user image">
              <div class="profile-info">
                  <h3>${name}</h3>
                  <a href="https://github.com/${login}" target="_blank">@${login}</a>
                  <p>Joined ${created_at.split("T").shift().split("-")}</p>
                  <p class="bio">${bio}</p>
          <div class="stats">
              <div class="repos">
                  <h5>Repos</h5>
                  <span>${public_repos}</span>
              </div>
              <div class="repos">
                  <h5>Followers</h5>
                  <span>${followers}</span>
              </div>
              <div class="repos">
                  <h5>Following</h5>
                  <span>${following}</span>
              </div>
          </div>
          <div class="more-info">
              <div class="more-info-icon">
                  <i class="fas fa-map-marker-alt"></i>
                  <p>${location}</p>
              </div>
              <div class="more-info-icon">
                  <i class="fab fa-twitter"></i>
                  <p>${twitter_username}</p>
              </div>
          </div>
          <div class="more-info">
              <div class="more-info-icon">
                  <i class="fas fa-link"></i>
                  <p>${blog}</p>
              </div>
              <div class="more-info-icon">
                  <i class="fas fa-building"></i>
                  <p>${company}</p>
              </div>
          </div>
              </div>
          </div>
          
        </div>
    `;
    containerSection.appendChild(container);
}

function mostrarRepos(repos){
    const reposContainer = document.querySelector(".link-repos");
    repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
        .forEach(element => {
            const link = document.createElement("a");
            link.innerText = element.name;
            link.href = element.html_url;
            link.target = "_blank";
            reposContainer.appendChild(link);
        });
    //console.log(ten);
}

function mostrarError(mensaje){
    const mensajeNuevo = "Warning: " + mensaje;
    const error = document.createElement("h5");
    error.innerText = mensajeNuevo;
    error.style.color = "red";
    mainContainer.appendChild(error);
    setTimeout(() => error.remove(), 3000);
}

function clearHTML(){
    containerSection.innerHTML = "";
}