const resultImage = document.querySelector("#result-image");
const loadingDiv = document.querySelector("#image-loading");
const namingButton = document.querySelector("#naming-button");
const namingButtonText = document.querySelector("#naming-button h1");
const namingInputContainer = document.querySelector("#naming-input-container");
const namingInput = document.querySelector("#naming-input");
const namingSubmitButton = document.querySelector("#submit-name-button");
const namingNvmButton = document.querySelector("#nvm-button");
const generateButton = document.querySelector("#generate-button");
const type1DropdownButton = document.querySelector("#type1-dropdown");
const type2DropdownButton = document.querySelector("#type2-dropdown");
const type1DropdownText = document.querySelector("#type1-dropdown h1");
const type2DropdownText = document.querySelector("#type2-dropdown h1");
const type1Dropdown = document.querySelector("#type1-dropdown-container");
const type2Dropdown = document.querySelector("#type2-dropdown-container");
const type1DropdownItems = document.querySelectorAll("#type1-dropdown-container .dropdown-item");
const type2DropdownItems = document.querySelectorAll("#type2-dropdown-container .dropdown-item");

const pkmnTypes = [
  "bug",
  "electric",
  "flying",
  "ground",
  "poison",
  "steel",
  "dark",
  "fighting",
  "ghost",
  "ice",
  "psychic",
  "water",
  "dragon",
  "fire",
  "grass",
  "normal",
  "rock",
];

let isLoading = false;

type1DropdownText.innerHTML = pkmnTypes[getRandomInt(0, pkmnTypes.length - 1)];
type2DropdownText.innerHTML = pkmnTypes[getRandomInt(0, pkmnTypes.length - 1)];

namingButton.onclick = () => {
  namingButton.classList.add("hide");
  namingInputContainer.classList.remove("hide");
};

namingButton.ontransitionend = () => {
  if (!namingInputContainer.classList.contains("hide")) {
    namingInputContainer.classList.add("editable");
    namingInput.focus();
  }
};

namingSubmitButton.onclick = () => {
  const fileName = namingInput.value + ".png";
  // download image
  fetch(resultImage.src)
    .then(res => res.blob())
    .then(blob => saveAs(blob, fileName));

  submitName(namingInput.value, resultImage.src);

  resetAnimation();

  namingButton.classList.add("success");
  namingButtonText.innerHTML = "It's yours";
};

namingInput.onkeyup = () => {
  if (event.key === "Enter") {
    namingSubmitButton.onclick();
  }
};

namingNvmButton.onclick = () => {
  resetAnimation();
};

type1DropdownButton.onclick = () => {
  type1Dropdown.classList.toggle("open");
};

type2DropdownButton.onclick = () => {
  type2Dropdown.classList.toggle("open");
};

type1DropdownItems.forEach(dropdownItem => {
  dropdownItem.onclick = () => {
    type1DropdownText.innerHTML = dropdownItem.dataset.value;
    type1Dropdown.classList.toggle("open");
  };
});

type2DropdownItems.forEach(dropdownItem => {
  dropdownItem.onclick = () => {
    type2DropdownText.innerHTML = dropdownItem.dataset.value;
    type2Dropdown.classList.toggle("open");
  };
});

generateButton.onclick = () => {
  if (!isLoading) {
    resetAll();

    isLoading = true;
    loadingDiv.classList.add("loading");

    let type1, type2;
    if (type1DropdownText.innerHTML !== "none") type1 = type1DropdownText.innerHTML;
    if (type2DropdownText.innerHTML !== "none") type2 = type2DropdownText.innerHTML;

    getImage(type1, type2)
      .then(res => res.text())
      .then(base64 => {
        isLoading = false;
        loadingDiv.classList.remove("loading");
        resultImage.src = "data:image/png;base64," + base64;
      });
  }
};

generateButton.onclick();

function resetAnimation() {
  namingButton.classList.remove("hide");
  namingInputContainer.classList.add("hide");
  namingInput.blur();
  namingInput.value = "";

  namingInputContainer.classList.remove("editable");
}

function resetAll() {
  resetAnimation();

  namingButton.classList.remove("success");
  namingButtonText.innerHTML = "claim it";

  type1Dropdown.classList.remove("open");
  type2Dropdown.classList.remove("open");

  loadingDiv.classList.remove("loading");

  resultImage.removeAttribute("src");
}

function getImage(type1, type2) {
  return postData("/api/get-image", { type1, type2 });
}

function submitName(name, image) {
  return postData("/api/set-name", { name, image });
}

function postData(endPoint, data) {
  return fetch(endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
