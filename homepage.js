// class to handle bubbles that display dining location information. 
//Note: no fields are needed before the constructor!
class Bubble {
  constructor(name, open_hour, close_hour) {
    this.name = name;
    this.open_hour = open_hour;
    this.close_hour = close_hour;
  }
}

// function to return the CURRENT time in a HH:MM format
function getCurrentTime() {
  let currentTime = new Date();
  return currentTime.getHours()+":"+currentTime.getMinutes();
}

// function to display a background image of Stevens campus
function show_image(src, width, height, alt) {
  let img = document.createElement("img");
  img.src = src;
  img.width = width;
  img.height = height;
  img.alt = alt;

  // append image element to body of document
  document.body.appendChild(img);
}