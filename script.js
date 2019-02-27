// получаем данные
let arr = [];
const url = "https://api.punkapi.com/v2/beers";
const slider = document.querySelector(".slider");

function getData(url) {
	fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log(data);
			const sortData = [...data].sort(function(a, b) {
				if (a.attenuation_level < b.attenuation_level) {
					return 1;
				}
				if (a.attenuation_level > b.attenuation_level) {
					return -1;
				}
				return 0;
			});

			const withDataAttr = [];

			[...sortData].map((item, index) => {
				item["data-index"] = index + 1;
				withDataAttr.push(item);
			});

			renderBeers(withDataAttr, slider);
            console.log(withDataAttr);
            
            $('.slider').slick({
                slidesToShow: 10,
                slidesToScroll: 1,
                autoplay: false
              });

		});
}

getData(url);

// создаем карточки для слайдера

const cardTemplate = document.querySelector(".card-template").content;

const createBeer = object => {
	const newBeer = cardTemplate.cloneNode(true);
	newBeer.querySelector(".card__image").src = object.image_url;
	newBeer.querySelector(".card__image").alt = object.name;
	newBeer.querySelector(".card__name").textContent = object.name;
	newBeer.querySelector(".card__level").textContent = object.attenuation_level;
	newBeer.querySelector(".card__place").textContent =
		"#" + object["data-index"];
	return newBeer;
};

const renderBeers = (objects, destination) => {
	const fragment = document.createDocumentFragment();
	objects.forEach(object => fragment.appendChild(createBeer(object)));
	destination.appendChild(fragment);
};


// делаем таблицу с параметрами

