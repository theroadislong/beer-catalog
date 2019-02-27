const url = "https://api.punkapi.com/v2/beers";
const slider = document.querySelector(".slider");
const table = document.querySelector(".table");

// получаем данные
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
            renderRows(withDataAttr, table)
            console.log(withDataAttr);
            

			$(".slider").slick({
				slidesToShow: 10,
				slidesToScroll: 1,
				autoplay: false
            });
            
            const rows = document.querySelectorAll('.table__row')
            rows.forEach(row => row.addEventListener('mouseover', (evt)=> {
                console.log(evt.currentTarget)
            }))
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

// создаем таблицу

const rowTemplate = document.querySelector(".row-template").content;

const createRow = object => {
    const newRow = rowTemplate.cloneNode(true);
	newRow.querySelector(".row__name").textContent = object.name;
	newRow.querySelector(".row__est").textContent = object.first_brewed;
	newRow.querySelector(".row__abv").textContent = object.abv;
    newRow.querySelector(".row__ibu").textContent = object.ibu;
	newRow.querySelector(".row__ph").textContent = object.ph;
	newRow.querySelector(".row__srm").textContent = object.srm;
    newRow.querySelector(".row__tagline").textContent = object.tagline;
	return newRow;
};

const renderRows = (objects, destination) => {
	const fragment = document.createDocumentFragment();
	objects.forEach(object => fragment.appendChild(createRow(object)));
	destination.appendChild(fragment);
};

