document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-btn');
  const currentPath = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if(linkPath === currentPath){
      link.classList.add('active-btn'); 
    } else {
      link.classList.remove('active-btn'); 
      link.classList.add('inactive-btn'); 
    }
  });
});



