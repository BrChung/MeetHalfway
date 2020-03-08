const themeMap = {
    dark: 'light',
    light: 'solar',
    solar: 'dark'
  };
  
  const theme = localStorage.getItem('theme');
  const bodyClass = document.body.classList;
  theme && bodyClass.add(theme);
  
  function toggleTheme() {
    const current = localStorage.getItem('theme');
    const next = themeMap[current];
  
    bodyClass.replace(current, next);
    localStorage.setItem('theme', next);
  }
  
  document.getElementById('themeButton').onclick = toggleTheme;

  /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function shortenMenu() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
  changeMenuButton();
} 

function changeMenuButton() {
  var x = document.getElementById("mButton");
  x.classList.toggle("change");
} 