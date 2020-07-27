const buttonSearchJoke = document.querySelector('.button_search'),
    formSearch = document.querySelector('.search_form'),
    radioButt = document.getElementsByName('choice_joke'),
    joke = document.querySelector('.joke'),
    listCategory = document.querySelector('.listCategory'),
    searchInput = document.querySelector('#search_joke'),
    favJoke = document.querySelector('.favourites'),
    humMenu = document.querySelector('.menu__btn'),
    menuCheck = document.getElementsByName('menuCheck');

let dbJoke = JSON.parse(localStorage.getItem('favourites')) || [];


//Render + Save LS
const init = () =>{
    favJoke.textContent = '';

    dbJoke.forEach(element => {
        let text = cardJoke(element, 'unlike');
        favJoke.insertAdjacentHTML('beforeend',text);
    });

    const unlike = document.querySelectorAll('.unlike');

    for(let i = 0; i < unlike.length; i++){
        unlike[i].addEventListener('click', deleteCard);
    }
    localStorage.setItem('favourites', JSON.stringify(dbJoke));
}

//Рендер для сохраненого в ЛС
if(dbJoke.length !== 0) init();


// Список категорий
const getCategoriesAPI = () =>{
    fetch('https://api.chucknorris.io/jokes/categories')
        .then(response => response.json())
        .then(data => {
            listCategory.style.display = 'block';
            for(let i = 0; i < data.length; i++){
                let listElement = 
                `<div class="listCategoryElem"><input type = 'radio' name = 'listCategory' id = "${data[i]}">
                <label  for = "${data[i]}">${data[i]}</label></div>`;
                listCategory.insertAdjacentHTML('afterbegin', listElement);
            };
        });
};

//Запросы к API 
formSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    joke.style.display = 'block';
    joke.textContent = '';
    
    //Random joke 
    if(radioButt[0].checked){
        fetch('https://api.chucknorris.io/jokes/random')
            .then( response => response.json())
            .then( data => dataCard(data));
    }
    //Random Joke from categories
    if(radioButt[1].checked){
        const category = document.getElementsByName('listCategory');
       
        for(let i = 0; i<= category.length; i++){
            if(category[i].checked){
                fetch(`https://api.chucknorris.io/jokes/random?category=${category[i].id}`)
                    .then( response => response.json())
                    .then(data => dataCard(data) );
            }

        }      
    }
    //Search Joke
    if(radioButt[2].checked){
        let searchQuery = searchInput.value;
        
        if(searchQuery){
            fetch(`https://api.chucknorris.io/jokes/search?query=${searchQuery}`)
                .then(response => response.json())
                .then(data => {
                    if(data.result.length === 0){
                        alert("Nothing:( Mb something elese?");
                    }
                    else{
                        let randNum = Math.floor(Math.random() * data.total);
                        let joke = data.result[randNum];
                        dataCard(joke);    
                    }
            });
        }
        else{
            alert("Enter your request:)")
        }

    }
    if(!radioButt[0].checked && !radioButt[1].checked && !radioButt[2].checked){
        alert("Choose categorie");
    }
});


// Массив нужных данных полученых от сервера 
const dataCard = (data) => {
    let categories = data.categories.length !== 0  ? data.categories : 'without categories';
    let dateNow  = new Date();
    let dateAPI = new Date(data.updated_at);

    let timeMs = Math.abs(dateNow.getTime() - dateAPI.getTime());
    let upd =  Math.ceil(timeMs/(1000*3600));

    const dataObj = {
        link: data.url,
        id_link: data.id,
        text: data.value,
        categories: categories,
        updateTime: upd
    } 

    savedJoke(dataObj);
}


//Создание карточки с шуткой
function cardJoke(data, like){
    
    let textJoke = `
    <div class = "jokeCard">
        <div class = "img">
        <div class = "elips">
            <object type="image/svg+xml" data="Vector.svg" width="30" height="30" >
                <img src = "row.svg" width="30" height="30">
            </object>
        </div>
        </div>
        <div class = "${like}">
            <div class = "${data.id_link}" id="${like}" ></div>
        </div>
        <div class = "link_id_joke">
        ID:
            <a href = ${data.link}>
                ${data.id_link}
            </a>
        </div>
        <div class = "text_joke">
            <h3>${data.text}</h3>
        </div>
        <div class = "categories">
            <h4>${ data.categories }</h4>
        </div>
        <div class ="dataUpd">last Update: ${data.updateTime} hours ago</div>
    </div>`;

    return textJoke;
};


//Добавление шутки в избранное
const savedJoke = (data) => {

    let text = cardJoke(data, 'like');

    joke.insertAdjacentHTML('afterbegin',text);

    document.querySelector('.like').addEventListener('click', (event) => {
        let id = event.target.className;

        if((event.target.id) == 'like'){
            let containsId = dbJoke.some(el => el.id_link === id);

            if(!containsId){
                dbJoke.push(data);
                init(); 
            }
            
            joke.textContent = '';
        }

    });
}

//Удаление карты избранного 
function deleteCard(event) {
    let id = event.target.className;

    if((event.target.id) == 'unlike'){
        dbJoke = dbJoke.filter(el => el.id_link !== id);
        init();
    }
}


//Обработчики событий 
radioButt[1].addEventListener('click',  () => {
    getCategoriesAPI();
    searchInput.style.display = 'none';
    listCategory.textContent ='';
});

radioButt[0].addEventListener('click', () => {
    listCategory.style.display = 'none';
    searchInput.style.display = 'none';
 });

radioButt[2].addEventListener('click', () => {
    listCategory.style.display = 'none';
    searchInput.style.display = 'block';
});

humMenu.addEventListener('click', () => {
    console.log(window.matchMedia("(min-width: 480px)").matches && !window.matchMedia("(max-width: 768px)").matches);
    if (window.matchMedia("(max-width: 480px)").matches) {
        if(menuCheck[0].checked){
            document.querySelector('.wrapper_favourites').style.display ="none";
            document.querySelector('.main').style.display = "block";
        }
        else{
            document.querySelector('.wrapper_favourites').style.display ="block";
            document.querySelector('.main').style.display = "none";

        }
    }
    if(window.matchMedia("(min-width: 481px)").matches && !window.matchMedia("(max-width: 768px)").matches){
        if(menuCheck[0].checked){
            document.querySelector('.wrapper_favourites').style.display ="none";
            document.querySelector('.main').style.opacity= "1";
        }
        else{
            document.querySelector('.wrapper_favourites').style.display ="block";
            document.querySelector('.main').style.opacity= "0.2";
        }
    }
});

