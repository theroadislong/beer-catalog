const url = "https://api.punkapi.com/v2/beers";
const slider = document.querySelector(".slider");
const table = document.querySelector(".table");
const tableWrapper = document.querySelector(".table__wrapper");

// получаем данные
function getData(url) {
	fetch(url)
		.then(response => response.json())
		.then(data => {
			console.log("first data", data);

			// сортируем данные для топ 10 по ключу attenuation_level
			const sortData = [...data].sort(function(a, b) {
				if (a.attenuation_level < b.attenuation_level) {
					return 1;
				}
				if (a.attenuation_level > b.attenuation_level) {
					return -1;
				}
				return 0;
			});

			// добавляем data аттрибут для каждого элемента
			const withDataAttr = [];
			[...sortData].map((item, index) => {
				item["data-index"] = index + 1;
				withDataAttr.push(item);
			});
			console.log("sorted data", withDataAttr);

			// рендерим слайдер и таблицу
			renderBeers(withDataAttr, slider);
			renderRows(withDataAttr, table);

			// инициализируем слайдер
			$(".slider").slick({
				slidesToShow: 10,
				slidesToScroll: 1,
				autoplay: false
			});

			// при наведение на название показываем его
			const cards = document.querySelectorAll(".card__name");
			cards.forEach(item => {
				const title = item.textContent;
				item.setAttribute("title", title);
			});

			// добавляем каждой строке уникальный id
			const tableRows = document.querySelectorAll(".table__row");
			[...tableRows].forEach(item => {
				const id = item.querySelector(".row__id").textContent;
				item.setAttribute("data-id", id);
			});

			// делаем фильтрацию
			const searchInput = document.querySelector(".search__input");

			// обработчик на инпут
			const searchHandler = event => {
				const searchValue = searchInput.value.toLowerCase();
				const sortValue = "name";
				const filterFunction = object =>
					searchValue === ""
						? object
						: object[sortValue].toLowerCase().indexOf(searchValue) !== -1;

				// перед новым рендером удаляем текущие строки
				const deleteRows = () => {
					const rows = document.querySelectorAll(".table__row");
					rows.forEach(row => row.remove());
				};
				deleteRows();

				renderRows(
					[...withDataAttr].filter(item => filterFunction(item)),
					table
				);
			};

			// обработчик для появления карточки
			document.addEventListener("mouseover", evt => {
				if (
					evt.target.parentNode.tagName === "TR" &&
					evt.target.tagName !== "TH"
				) {
					const currentRowId = Number(
						evt.target.parentNode.getAttribute("data-id")
					);

					withDataAttr.forEach(item => {
						if (item.id === currentRowId) {
							const div = document.createElement("div");
							div.className = "row__modal";
							div.innerText = "Food pairing: " + item.food_pairing;

							const currentRowIndex = item["data-index"];
							// 56 - высота строки, 100 - насколько справа отодвинуть карточку
							div.style.top = currentRowIndex * 56 + "px";
							div.style.left = evt.clientX + 100 + "px";
							tableWrapper.appendChild(div);
						}
					});
				}
			});

			document.addEventListener("mouseout", evt => {
				const currentModals = document.querySelectorAll(".row__modal");
				for (let i = 0; i < currentModals.length; i++) {
					currentModals[i].remove();
				}
			});

			searchInput.addEventListener("input", searchHandler);
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
	newBeer.querySelector(".card__id").textContent = object.id;
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
	newRow.querySelector(".row__id").textContent = object.id;
	return newRow;
};

const renderRows = (objects, destination) => {
	const fragment = document.createDocumentFragment();
	objects.forEach(object => fragment.appendChild(createRow(object)));
	destination.appendChild(fragment);
};
