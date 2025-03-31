let carouselItemTemplate = document.createElement("div");
carouselItemTemplate.setAttribute("class", "carousel-item");
let carouselImageTemplate = document.createElement("img");
carouselImageTemplate.setAttribute("height", "500px");
carouselItemTemplate.appendChild(carouselImageTemplate);

window.onload = () => {
  setCarouselItems();
  handleCarouselInteraction();
  handleLikeButtonClicked();
};

const setCarouselItems = async () => {
  try {
    let response = await fetch("/images");
    const images = await response.json();
    images.forEach((image, index) => {
      let newCarouselItem = carouselItemTemplate.cloneNode(true);
      if (index == 0) {
        newCarouselItem.classList.add("active");
        document.getElementById("button-like").querySelector("span").innerHTML =
          image.likes;
        setLikeButtonState(image.id);
      }
      newCarouselItem
        .querySelector("img")
        .setAttribute("src", "/images/" + image.filename);
      newCarouselItem
        .querySelector("img")
        .setAttribute("alt", image.filename.split(".")[0]);
      newCarouselItem.querySelector("img").setAttribute("data-id", image.id);
      newCarouselItem
        .querySelector("img")
        .setAttribute("data-likes", image.likes);
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

const likeImage = () => {
  // user should only be able to like each image once. use localstorage to store history of likes
  // in real implementation this would likely be done in a database

  const image = document
    .getElementById("image-carousel")
    .getElementsByClassName("carousel-item active")[0]
    .querySelector("img");
  if (image) {
    console.log(image);
    let imgid = image.dataset.id;

    let previouslyLiked = localStorage.getItem("liked_image_" + imgid);
    if (previouslyLiked === "true") return;

    fetch("/images/like/" + imgid, {
      method: "POST",
      body: "",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.status == "success") {
          image.dataset.likes = json.data.likes;
          document
            .getElementById("button-like")
            .querySelector("span").innerHTML = json.data.likes;
          localStorage.setItem("liked_image_" + imgid, "true");
          setLikeButtonState(imgid);
        }
      });
  }
};

const handleCarouselInteraction = () => {
  const carousel = document.getElementById("image-carousel");
  carousel.addEventListener("slid.bs.carousel", (event) => {
    let item = event.relatedTarget;
    let img = item.querySelector("img");
    document.getElementById("span-like-count").innerHTML = img.dataset.likes;
    setLikeButtonState(img.dataset.id);
  });
};

const handleLikeButtonClicked = () => {
  document.getElementById("button-like").addEventListener("click", (e) => {
    likeImage();
  });
};

const setLikeButtonState = (imgid) => {
  let button = document.getElementById("button-like");
  if (localStorage.getItem("liked_image_" + imgid) === "true") {
    // change heart icon to filled and bold number
    button.querySelector("i").classList.remove("bi-heart");
    button.querySelector("i").classList.add("bi-heart-fill");
    button.querySelector("span").classList.remove("fw-normal");
  } else {
    button.querySelector("i").classList.remove("bi-heart-fill");
    button.querySelector("i").classList.add("bi-heart");
    button.querySelector("span").classList.add("fw-normal");
  }
};
