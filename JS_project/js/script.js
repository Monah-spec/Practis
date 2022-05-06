window.addEventListener("DOMContentLoaded", () => {
  // Tabs

  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

  const hideTabContent = () => {
    tabsContent.forEach((tab) => {
      tab.classList.add("hide");
      tab.classList.remove("show");
    });

    tabs.forEach((tab) => tab.classList.remove("tabheader__item_active"));
  };

  const showTabContent = (index = 0) => {
    tabsContent[index].classList.add("show", "fade");
    tabsContent[index].classList.remove("hide");
    tabs[index].classList.add("tabheader__item_active");
  };

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((tab, index) => {
        if (target === tab) {
          hideTabContent();
          showTabContent(index);
        }
      });
    }
  });

  // Timer

  const deadLine = "2022-04-24";

  const getTimeRemaining = (endtime) => {
    const time = Date.parse(endtime) - Date.parse(new Date()),
      daysMs = Math.floor(time / (1000 * 60 * 60 * 24)),
      hoursMs = Math.floor((time / (1000 * 60 * 60)) % 24),
      minutesMs = Math.floor((time / 1000 / 60) % 60),
      secondsMs = Math.floor((time / 1000) % 60);
    return {
      total: time,
      days: daysMs,
      hours: hoursMs,
      minutes: minutesMs,
      seconds: secondsMs,
    };
  };

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  const setClock = (selector, endtime) => {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const time = getTimeRemaining(endtime);

      days.innerHTML = getZero(time.days);
      hours.innerHTML = getZero(time.hours);
      minutes.innerHTML = getZero(time.minutes);
      seconds.innerHTML = getZero(time.seconds);

      if (time.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  };

  setClock(".timer", deadLine);

  // Modal

  const modalTrigger = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal");

  function openModal () {
      modal.classList.add("show");
      modal.classList.remove("hide");
      document.body.style.overflow = "hidden";
      clearInterval(modalTimerId);
  }

  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  modalTrigger.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });


  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 5000);

  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }
  window.addEventListener('scroll', showModalByScroll);

  // Добавляем классы в разработку
  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.classes = classes;
      this.parentSelector = document.querySelector(parentSelector);
      this.trasfer = 96;
      this.changeToRUB();
    }

    changeToRUB() {
      this.price = this.price * this.trasfer;
    }

    render() {
      const element = document.createElement('div');
      if (this.classes.length === 0) {
        this.element = 'menu__item';
        element.classList.add(this.element);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }
      
      element.innerHTML = `
          <img src=${this.src} alt=${this.alt}>
          <h3 class="menu__item-subtitle">${this.title}</h3>
          <div class="menu__item-descr">${this.descr}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
              <div class="menu__item-cost">Цена:</div>
              <div class="menu__item-total"><span>${this.price}</span> RUB/день</div>
          </div>
      `;
      this.parentSelector.append(element);
    }
  }

  const getResurs = async (url) => {
    const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }
    return await res.json();
  };

  // getResurs('http://localhost:3000/menu')
  //         .then(data => {
  //           data.forEach(({img, altimg, title, descr, price}) => {
  //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
  //           });
  //         });

  getResurs('http://localhost:3000/menu')
          .then(data => createCard(data));

  function createCard(data) {
    data.forEach(({img, altimg, title, descr, price}) => {
        const element = document.createElement('div');
        element.classList.add('menu__item');
        element.innerHTML = `
        <img src=${img} alt=${altimg}>
        <h3 class="menu__item-subtitle">${title}</h3>
        <div class="menu__item-descr">${descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${price}</span> RUB/день</div>
        </div>
        `;

        document.querySelector('.menu .container').append(element);
    });
  }

  // Forms post server

  const forms = document.querySelectorAll('form'),
        message = {
          loading: 'img/form/spinner.svg',
          success: 'Спасибо! Скоро мы с вами свяжемся.',
          failure: 'Что - то пошло не так...'
        };

  forms.forEach(form => bindPostData(form));

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
            'Content-type': 'application/json'
          }, 
      body: data
    });

    return await res.json();
  };
  
  function bindPostData(form) {
    form.addEventListener('submit', event => {
      event.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
          display: block;
          margin: 0 auto;
      `;
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
      .then(data => {
          console.log(data);
          showThanksModal(message.success);
          form.reset();
          statusMessage.remove();
      })
      .catch(() => {
          showThanksModal(message.failure);
      })
      .finally(() =>{
          form.reset();
      });
    });
  }

  const showThanksModal = message => {
    const prevModalDialog = document.querySelector('.modal__dialog');
    prevModalDialog.classList.add('hide');

    openModal();
     const thanksModal = document.createElement('div');
     thanksModal.classList.add('modal__dialog');
     thanksModal.innerHTML = `
          <div class = "modal__content">
              <div class = "modal__close" data-close>&times;</div>
              <div class = "modal__title">${message}</div>
          </div>
     `;

     document.querySelector('.modal').append(thanksModal);
     setTimeout(() => {
       thanksModal.remove();
       prevModalDialog.classList.add('show');
       prevModalDialog.classList.remove('hide');
       closeModal();
     }, 4000);
  };

  // Sliders

  const slides = document.querySelectorAll('.offer__slide'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector("#current"),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

  function addZero()  {
    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
  }

  let slideIndex = 1,
      offset = 0;

      if (slides.length < 10) {
          total.textContent = `0${slides.length}`;
          current.textContent = `0${slideIndex}`;
        } else {
          total.textContent = slides.length;
          current.textContent = slideIndex;
        }

  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';

  slidesWrapper.style.overflow = 'hidden';

  slides.forEach(slide => slide.style.width = width);

  next.addEventListener('click', () => {
    if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    addZero();
  });

  prev.addEventListener('click', () => {
    if (offset == 0) {
      offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    addZero();
  });
  // showSlides(slideIndex);

  // if (slides.length < 10) {
  //   total.textContent = `0${slides.length}`;
  // } else {
  //   total.textContent = slides.length;
  // }

  // function showSlides(i) {
  //   if (i > slides.length) {
  //     slideIndex = 1;
  //   } else if (i < 1) {
  //     slideIndex = slides.length;
  //   }

  //   slides.forEach(slide => slide.style.display = 'none');
    
  //   slides[slideIndex - 1].style.display = 'block';

  //   if (slides.length < 10) {
  //     current.textContent = `0${slideIndex}`;
  //   } else {
  //     current.textContent = slideIndex;
  //   }
  //   }

  //   function plusSlides(i) {
  //     showSlides(slideIndex += i);
  //   }

  //   prev.addEventListener('click',() => {
  //     plusSlides(-1);
  //   });

  //   next.addEventListener('click',() => {
  //     plusSlides(1);
  //   });
});
