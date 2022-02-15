const movieDB = {
  movies: [
    "Логан",
    "Лига справедливости",
    "Ла-ла лэнд",
    "Одержимость",
    "Скотт Пилигрим против...",
  ],
};

const marketing = document.querySelectorAll(".promo__adv img"),
  posterBg = document.querySelector(".promo__bg"),
  genre = posterBg.querySelector(".promo__genre"),
  list = document.querySelector(".promo__interactive-list"),
  addForm = document.querySelector(".add"),
  input = addForm.querySelector(".adding__input"),
  checkbox = addForm.querySelector('[type = "checkbox"]');

function deleteMarket(block) {
  block.forEach((item) => item.remove());
}

const createMovieList = (films, parent) => {
  parent.innerHTML = "";
  sortFilms(films);
  films.forEach((item, index) => {
    parent.innerHTML += `
        <li class="promo__interactive-item">${index + 1}. ${item}
            <div class="delete"></div>
</li>
    `;

    document.querySelectorAll(".delete").forEach((busket, index) => {
      busket.addEventListener("click", () => {
        busket.parentElement.remove();
        movieDB.movies.splice(index, 1);

        createMovieList(movieDB.movies, list);
      });
    });
  });
};

const makeChanges = () => {
  genre.textContent = "Драма";

  posterBg.style.backgroundImage = 'url("img/bg.jpg")';
};

const sortFilms = (arr) => arr.sort();

addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let newFilm = input.value;
  const favorite = checkbox.checked;
  if (newFilm) {
    if (newFilm.length > 21) {
      newFilm = `${newFilm.substring(0, 22)}...`;
    }

    if (favorite) {
      console.log("Добавляем любимый фильм!");
    }
    movieDB.movies.push(newFilm);

    createMovieList(movieDB.movies, list);
  }
  event.target.reset();
});

deleteMarket(marketing);
makeChanges();
createMovieList(movieDB.movies, list);
