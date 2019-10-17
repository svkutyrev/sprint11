
const keyAuthorization = '7082a1a1-2508-4734-bf4b-c9df3d594659'



class Api{
  constructor(options){
    this.options = options;
  }

  /*
    Можно лучше: лучше вынести из всех методов класса Api работу со страницей и DOM,
    оставив здесь только запросы к серверу и возвращать из методов промисы с данными:

    Например, метод getProfile: 
    getProfile() {
      return fetch(`${this.baseUrl}/users/me`,{ // <-- возвращаем промис с данными
        headers: this.headers
      })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
      })
    }

    Использование метода:
      api.getProfile()
      .then((result) => {
        document.querySelector('.user-info__name').textContent = result.name;
        document.querySelector('.user-info__job').textContent = result.about;
        document.querySelector('.user-info__photo').setAttribute('style', `background-image: url(${result.avatar})`)
      })
      .catch((err) => console.log(err));  // <-- обработка ошибок здесь, в самом конце цепочки then
    }
  */
  getInitialCards(){
    /* Можно лучше: адрес сервера передается в конструктор через options, необходимо брать его оттуда, а не 
    прописывать в каждом методе */
    fetch('http://95.216.175.5/cohort3/cards',{
      method:'GET',
      headers: {
        /* Можно лучше: лучше брать keyAuthorization из this.options, а не из глобальной переменной */
        authorization: keyAuthorization
      }
  
    })
    
    .then(card => card.json())
    .then(cards => {cards.forEach(cardData => {
      cardList.addCard(cardData.name, cardData.link)
      
    })})
    .catch((err) => {
      console.log(err); // выведем ошибку в консоль
    });
  }

  getProfile(){
    fetch('http://95.216.175.5/cohort3/users/me',{
      method:'GET',
      headers: {
        authorization: keyAuthorization}
    })
    .then(res => res.json())
    .then((result) => {
      document.querySelector('.user-info__name').textContent = result.name;
      document.querySelector('.user-info__job').textContent = result.about;
      document.querySelector('.user-info__photo').setAttribute('style', `background-image: url(${result.avatar})`)
    })
    .catch((err) => {
      console.log(err); 
    })
  }

  editProfile(name, adout){
    this.name = name;
    this.about = adout

    fetch('http://95.216.175.5/cohort3/users/me',{
      method: 'PATCH',
      headers: {
          authorization: keyAuthorization,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.name,
        about: this.about
      })
    })
    
    .then(res => res.json())
    .then(result => {
      document.querySelector('.user-info__name').textContent = result.name;
      document.querySelector('.user-info__job').textContent = result.about
    })
    .catch((err) => {
      console.log(err); 
    });

  }
  addImage(name, link){
    /* Можно лучше: присваивать параметры к this.name и this.link не требуется */
    this.name = name;
    this.link = link;
    fetch('http://95.216.175.5/cohort3/cards',{
      method:'POST',
      headers:{
        authorization:keyAuthorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.name,
        link: this.link,
        
      })
    })
    .then(res => res.json())
    .then((result) => {
      cardList.addCard(result.name, result.link)      
    })
    .catch((err) => {
      console.log(err); 
    });
  }

  deleteCard(event){
    
    console.log(event)
    fetch('http://95.216.175.5/cohort3/cards/',{
      headers:{
        authorization:keyAuthorization,
        'Content-Type': 'application/json'
      }
    })
    .then(res => 
    {
      res.json()
    })
    .catch((err) => {
      console.log(err); 
    });
   
  }
}

const api = new Api({
  baseUrl: 'http://95.216.175.5/cohort3/cards/',
  headers: {
    authorization: keyAuthorization,
    'Content-Type': 'application/json'
  }
});

/*Функция создания карточек */

class Card{
  constructor(name, link){
    this.name = name
    this.link = link
    this.cardElement = this.create();
    
    
    
    this.cardElement
      .querySelector('.place-card__like-icon')
      .addEventListener('click', this.like);
    this.cardElement
      .querySelector('.place-card__delete-icon')
      .addEventListener('click', api.deleteCard)      
    }
    
    
      

  
  create(){

    const placeCard = document.createElement('div');
    const placeCardImage = document.createElement('div');
    const placeCardDescription = document.createElement('div');
    const placeCardDeleteIcon = document.createElement('button');
    const placeCardName = document.createElement('h3');
    const placeCardLikeIcon = document.createElement('button');
    const placeCardlikeCount = document.createElement('p')

    placeCard.classList.add('place-card');
    placeCardImage.classList.add('place-card__image');
    placeCardImage.setAttribute('style', `background-image: url(${this.link})`)
    placeCardDescription.classList.add('place-card__description');
    placeCardDeleteIcon.classList.add('place-card__delete-icon');
    placeCardName.classList.add('place-card__name');
    placeCardLikeIcon.classList.add('place-card__like-icon');
    placeCardlikeCount.classList.add('place-card__like-count')
    placeCardName.textContent = this.name

    placeCard.appendChild(placeCardImage);
    placeCard.appendChild(placeCardDescription);
    placeCardImage.appendChild(placeCardDeleteIcon);
    placeCardDescription.appendChild(placeCardName);
    placeCardDescription.appendChild(placeCardLikeIcon);
    placeCardDescription.appendChild(placeCardlikeCount)   

    placeCardImage.addEventListener('click', function(){
      popup.open(event.target.className, event.target.style.backgroundImage.split(/"/i)[1])

    });
    

    return placeCard;
 }

  remove(event){
    event.stopPropagation();
    event.currentTarget.closest('.place-card').remove();
    removeEventListener('click', this.like);
    removeEventListener('click', this.remove);
    removeEventListener('click', function(){
      popup.open(event.target.className, event.target.style.backgroundImage.split(/"/i)[1])

    });

  };


  like(event){
    
    if(event.target.classList.contains('place-card__like-icon_liked')){
      let count = 0;
      count +=1;
      document.querySelector('.place-card__like-count').textContent = count;
    }
    else{
      document.querySelector('.place-card__like-count').textContent = 0;
    }
    event.target.classList.toggle('place-card__like-icon_liked')
    
    
    /*   
    fetch('http://95.216.175.5/cohort3/cards',{
      method:'PATCH',
      headers:{
        authorization:keyAuthorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
 
        likes: 1 
      })
    })
    .then(res => res.json())
    .then((result) => {
      console.log(result.likes)
    })
    */
  }
}



class CardList{
  constructor(containerDom, arrayCards){
    this.containerDom = containerDom;
    this.arrayCards = arrayCards;
    this.render();

  }

  addCard(name, link){
    const { cardElement } = new Card(name, link)
     this.containerDom.appendChild(cardElement);
  }

  render(){
    api.getInitialCards();
  }

}

class Popup{
  constructor(title, inputName, inputJob, inputUrl){
    this.title = title;
    this.inputName = inputName;
    this.inputJob = inputJob;
    this.inputUrl = inputUrl;

  }



  open(className, url){
    this.className = className;
    this.url = url;

    if(this.className == 'button user-info__button')
    {
      menagmentButtonNew();
      document.querySelector('.popup').classList.toggle('popup_is-opened');
      deleteValid();
      form.reset()
          
    }
    if (this.className == 'button user-info__edit'){
      editForm.elements.name.value = document.querySelector('.user-info__name').textContent;
      editForm.elements.job.value = document.querySelector('.user-info__job').textContent;
      
      menagmentButtonEdit();
      document.querySelector('.popup_edit').classList.toggle('popup_is-opened-edit');
      deleteValid();


    }
    if (this.className == 'place-card__image'){
      document.querySelector('.popup_image').classList.toggle('popup_is-opened-image')
      const imgForPopup = document.querySelector('.popup_image__content');
      const imgPopup = document.createElement('img')
      imgForPopup.appendChild(imgPopup).classList.add('popup_image__content-img');

      const popupCardImage = document.querySelector('.popup_image__content-img');
      popupCardImage.setAttribute('src', `${this.url}`)  
    }

  }

  close(className){
    this.className = className;

    if(this.className == 'popup__close')
    {
      document.querySelector('.popup').classList.remove('popup_is-opened');
          
    }
    if (this.className == 'popup_edit__close'){
      document.querySelector('.popup_edit').classList.toggle('popup_is-opened-edit');


    }
    if (this.className == 'popup_image__close'){
      document.querySelector('.popup_image').classList.remove('popup_is-opened-image');
      document.querySelector('.popup_image__content-img').remove();
    }
  }
}



const cardList = new CardList(document.querySelector('.places-list'));
const popup = new Popup();

const inputNameNew = document.querySelector('.popup__input_type_name-card');
const inputLinkNew = document.querySelector('.popup__input_type_link-url');
const noValidNameNew = document.querySelector('.valide_name-new');
const noValidLink = document.querySelector('.valide_link-new');
const noValidNameNewCount = document.querySelector('.valide_name__count-new');
const noValidLinkCount = document.querySelector('.valide_link__count-new');


// прослушка пропапов
//прослушка клика по кнопке добавления карточки
document.querySelector('.user-info__button').addEventListener('click', function(){
  popup.open(event.target.className);
}) 
document.querySelector('.user-info__edit').addEventListener('click', function(){
  popup.open(event.target.className);
});

document.querySelector('.popup_edit__close').addEventListener('click', function(){
  popup.close(event.target.className)
});

document.querySelector('.popup__close').addEventListener('click', function(){
  popup.close(event.target.className)
}) 

document.querySelector('.popup_image__close').addEventListener('click', function(){
  popup.close(event.target.className)
}) 


const editButton = document.querySelector('.popup_edit__button');
const editForm = document.forms.edit;
const form = document.forms.new;

//прослушка формы, определение полей формы
editForm.addEventListener('submit', function(event){
  
//Сабмит формы EDIT
  const editName = editForm.elements.name.value;
  const editJob = editForm.elements.job.value;

  if (noValidName.classList.contains('novalid')||noValidNameCount.classList.contains('novalid')|| editName.length==0 
    ||noValidJob.classList.contains('novalid')||noValidJobCount.classList.contains('novalid')|| editJob.length==0)  {
      event.preventDefault();
      
  }
  else{
    event.preventDefault();
    api.editProfile(editName, editJob);
    document.querySelector('.popup_edit').classList.toggle('popup_is-opened-edit');
  }
  
})

//Сабмит формы NEW
form.addEventListener('submit', function(event){
  const newLink = form.elements.link.value;
  const newName = form.elements.name.value;

  
  if (noValidLinkCount.classList.contains('novalid')|| noValidLink.classList.contains('novalid')||newLink.length==0||
    noValidNameNew.classList.contains('novalid')|| noValidNameNewCount.classList.contains('novalid')||newName.length==0) {

      event.preventDefault();
  }
  else{
    
    event.preventDefault();
    api.addImage(newName, newLink)

    document.querySelector('.popup').classList.toggle('popup_is-opened');
    form.reset();
  }

})
/* функиця заполнения полей в профиле */
  api.getProfile();

/* Функции добавления классов на кнопку при валидности */

/*Валидность формы Edit*/
//валидность поля Name
const validNameEdit = document.querySelector('.popup__input_type_name');
const noValidName = document.querySelector('.valide_name');
const noValidJob = document.querySelector('.valide_job');
const noValidNameCount = document.querySelector('.valide_name__count');
const noValidJobCount = document.querySelector('.valide_job__count');

validNameEdit.addEventListener('input', function(){

  validateTextInput(validNameEdit.value, noValidName,  noValidNameCount)
  
})
//валидность поля Job
const validJobEdit = document.querySelector('.popup__input_type_job');
validJobEdit.addEventListener('input', function(){

  validateTextInput(validJobEdit.value, noValidJob, noValidJobCount)
})

function menagmentButtonEdit(){ 
  if(noValidName.classList.contains('novalid')||noValidNameCount.classList.contains('novalid')||
  noValidJob.classList.contains('novalid')||noValidJobCount.classList.contains('novalid')) {
    
    document.querySelector('.popup_edit__button').classList.remove('popup__button-activ');
    
  }
  else{
    document.querySelector('.popup_edit__button').classList.add('popup__button-activ');
  }
}


/*Валидность формы NEW*/

//валидность поля Name
inputNameNew.addEventListener('input', function(){
  validateTextInput(inputNameNew.value, noValidNameNew, noValidNameNewCount)

})
//валидность поля Link

inputLinkNew.addEventListener('input', function(){
  menagmentButtonNew()
  if (event.target.value.length !== 0){
    
    
    if(form.elements.link.value.search(/^(http:\/\/|https:\/\/|ftp:\/\/|ftps:\/\/|www\.)([0-9]|[a-z]|[A-Z]|[.*]|[\-]|[\_])+(\.)+([a-z]|.*)/i) !== 0){
      noValidLinkCount.classList.add('novalid');
      noValidLink.classList.remove('novalid');
    }
    else{
      noValidLinkCount.classList.remove('novalid');
    }
  }
  else if (event.target.value.length == 0){
    noValidLink.classList.add('novalid');
    noValidLinkCount.classList.remove('novalid');
  }
  menagmentButtonNew()
})

function menagmentButtonEdit(){
 
  if(noValidName.classList.contains('novalid')||noValidNameCount.classList.contains('novalid')||editForm.elements.job.value.length==0||
  noValidJob.classList.contains('novalid')||noValidJobCount.classList.contains('novalid')||editForm.elements.name.value.length==0){
    
    document.querySelector('.popup_edit__button').classList.remove('popup__button-activ');
    
  }
  else{
    document.querySelector('.popup_edit__button').classList.add('popup__button-activ');
  }
}

function menagmentButtonNew(){
 
  if(noValidNameNew.classList.contains('novalid')||noValidNameNewCount.classList.contains('novalid')||form.elements.link.value.length == 0||
  noValidLink.classList.contains('novalid')||noValidLinkCount.classList.contains('novalid')||form.elements.name.value.length ==0){
    
    document.querySelector('.popup__button').classList.remove('popup__button-activ');
    
  }
  else{
    document.querySelector('.popup__button').classList.add('popup__button-activ');
  }
}

function updateCards(){

} 

updateCards();

function deleteValid(){
  noValidJob.classList.remove('novalid');
  noValidJobCount.classList.remove('novalid');
  noValidName.classList.remove('novalid');
  noValidNameCount.classList.remove('novalid');
  noValidNameNew.classList.remove('novalid');
  noValidNameNewCount.classList.remove('novalid');
  noValidLink.classList.remove('novalid');
  noValidLinkCount.classList.remove('novalid');
}

function validateTextInput(inputElement, errorElement1, errorElement2){

  if (inputElement.length !== 0){
      
    if(inputElement.length < 2 || inputElement.length > 30){
      errorElement2.classList.add('novalid');
      errorElement1.classList.remove('novalid');
    }
    else{
      errorElement2.classList.remove('novalid');
    }
  }
  else if (event.target.value.length == 0){
    errorElement1.classList.add('novalid');
    errorElement2.classList.remove('novalid');
  }
  menagmentButtonEdit()
}


/*
  Отлично, обязательные правки сделаны.

  Рекомендую всеже доделать и места где можно сделать лучше, а так же не обязательную 
  часть задания. Это поможет закрепить полученные знания на практике.

  Если у Вас будет свободное время попробуйте переписать работу с сервером
  применив async/await для работы с асинхронными запросами.
  https://learn.javascript.ru/async-await
  https://habr.com/ru/company/ruvds/blog/414373/
  Async/await часто используется на реальных проектах

*/















/*
  Большая часть обязательного задания выполнена, но нужно исправить:
  - добавить обработку ошибок при обмене с сервером         //готово
  - делать запрос карточек с сервера только один раз        //готово

  Места где можно сделать лучше:
  - в методах класса Api адрес сервера брать из настроек передаваемых в конструктор 
  - вынести из класса Api всю работу со страницей и DOM оставив только запросы на сервер
  - убрать ошибку при добавлении карточки                   //готово
*/