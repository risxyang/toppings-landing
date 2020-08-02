

window.onscroll = function() {scrollFunction()};
var elementTarget = document.getElementById("contact");

  function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      document.getElementById("navbar").style.height = "9%";
      document.getElementById("navbar").style.borderRadius = "0px";
      document.getElementById("navlinks").style.fontSize = "15px";
  } else {
      document.getElementById("navbar").style.height = "12%";
      document.getElementById("navbar").style.borderRadius = "0px 0px 20px 20px";
      document.getElementById("navlinks").style.fontSize = "18px";
      
  }
  
  if (window.scrollY > elementTarget.offsetTop - 1) {
      document.getElementById("logo").style.filter = "hue-rotate(-28deg)";
      document.getElementById("navlinks").style.filter = "hue-rotate(-28deg)";
  }
  else
  {
      document.getElementById("logo").style.filter = "hue-rotate(0)";
      document.getElementById("navlinks").style.filter = "hue-rotate(0)";
  }
   }


