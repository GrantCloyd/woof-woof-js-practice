document.addEventListener("DOMContentLoaded", dogsAppend)
const filterButton = document.querySelector("#good-dog-filter")
filterButton.addEventListener("click", dogFilter)

function getData() {
   return fetch("http://localhost:3000/pups")
      .then(resp => resp.json())
      .then(data => data)
}

function dogAppend(dog) {
   const dogBar = document.querySelector("div#dog-bar")
   let span = document.createElement("span")
   let { isGoodDog, image, id } = dog
   span.id = id
   span.isGoodDog = isGoodDog
   span.image = image
   span.textContent = dog.name
   span.addEventListener("click", () => dogInspect(span))
   dogBar.append(span)
}

function dogInspect(dog) {
   const dogSummary = document.querySelector("div#dog-info")

   if (dog.isGoodDog === true) {
      dogSummary.innerHTML = `
      <img src="${dog.image}"> </img>
      <h2>${dog.textContent}</h2>
      <button>Good Dog!</button>
      `
   } else {
      dogSummary.innerHTML = `
    <img src="${dog.image}"> </img>
    <h2>${dog.textContent}</h2>
    <button>Bad Dog!</button>
     `
   }
   let toggleButton = dogSummary.querySelector("button")
   toggleButton.isGoodDog = dog.isGoodDog
   toggleButton.id = dog.id
   toggleButton.addEventListener("click", () => updateDog(toggleButton, !toggleButton.isGoodDog))

   function updateDog(button, bool) {
      let dogObj = {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            isGoodDog: bool,
         }),
      }

      fetch(`http://localhost:3000/pups/${button.id}`, dogObj)
         .then(resp => resp.json())
         .then(data => {
            if (bool === true) {
               dogSummary.querySelector("button").textContent = "Good Dog!"
               dogSummary.querySelector("button").isGoodDog = true
            }
            if (bool === false) {
               dogSummary.querySelector("button").textContent = "Bad Dog!"
               dogSummary.querySelector("button").isGoodDog = false
            }
         })
         .catch(e => console.warn(e))
   }
}

function dogsAppend() {
   getData()
      .then(data => Array.from(data))
      .then(arr => arr.map(dogAppend))
}

function dogFilter() {
   const dogBar = document.querySelector("div#dog-bar")
   dogBar.innerHTML = ""
   if (this.textContent === "Filter good dogs: OFF") {
      getData()
         .then(data => Array.from(data))
         .then(arr => arr.filter(dog => dog.isGoodDog === true).map(dogAppend))
      this.textContent = "Filter good dogs: ON"
   } else {
      dogsAppend()
      this.textContent = "Filter good dogs: OFF"
   }
}

//have a lot of this!! need to figure out how to change the button so that when I filter the dogs, it appends the new dog to the bar
// maybe some kind of if statement -- if this item is not on the div area -- append it to the div.?
// This would work when filter is not on because all of the items would be there
