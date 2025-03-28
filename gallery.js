let carouselItemTemplate = document.createElement("div");
carouselItemTemplate.setAttribute("class", "carousel-item");
let carouselImageTemplate = document.createElement("img");
carouselImageTemplate.setAttribute("height", "500px");
carouselItemTemplate.appendChild(carouselImageTemplate);

window.onload = () => {
  setCarouselItems();
  console.log("test");
};

const setCarouselItems = async () => {
  try {
    let response = await fetch("/images");
    const images = await response.json();
    images.forEach((image, index) => {
      let newCarouselItem = carouselItemTemplate.cloneNode(true);
      if (index == 0) newCarouselItem.classList.add("active");
      newCarouselItem
        .querySelector("img")
        .setAttribute("src", "/images/" + image.filename);
      newCarouselItem
        .querySelector("img")
        .setAttribute("alt", image.filename.split(".")[0]);
      document
        .getElementById("image-carousel")
        .querySelector("div")
        .appendChild(newCarouselItem);
    });
    let carousel = new bootstrap.Carousel("#image-carousel", {
      interval: 2000,
      touch: false,
    });
  } catch (error) {
    console.log(error);
  }
};
