

window.onscroll = function() {scrollFunction()};
var pink = document.getElementById("contact");
var blue = document.getElementById("covid");
var orange = document.getElementById("signup");

  function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      document.getElementById("navbar").style.height = "9%";
      document.getElementById("navbar").style.borderRadius = "0px";
      document.getElementById("navlinks").style.fontSize = "15px";
  }
  else 
  { 
      document.getElementById("navbar").style.height = "12%";
      document.getElementById("navbar").style.borderRadius = "0px 0px 20px 20px";
      document.getElementById("navlinks").style.fontSize = "18px";
      
  }
  
    if (window.scrollY > pink.offsetTop - 1) {
        document.getElementById("navbar").style.filter = "hue-rotate(-28deg)";
    }
    else if (window.scrollY > orange.offsetTop - 1) {
        document.getElementById("navbar").style.filter = "hue-rotate(0)";
    }
    else if (window.scrollY > blue.offsetTop - 1) {
        document.getElementById("navbar").style.filter = "hue-rotate(200deg)";
    }
    else
    {
        document.getElementById("navbar").style.filter = "hue-rotate(0)";
    }
   }


