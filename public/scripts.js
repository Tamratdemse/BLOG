

document.addEventListener("DOMContentLoaded", function() {
    const nav = document.querySelector("nav ul");
    const toggleNav = document.createElement("button");
    toggleNav.textContent = "Menu";
    toggleNav.classList.add("nav-toggle");
    document.querySelector("nav").insertBefore(toggleNav, nav);

    toggleNav.addEventListener("click", function(event) {
        nav.classList.toggle("show");
       
    });

    document.body.addEventListener('click', function(event) {
        // Check if the click is outside the navigation and the toggle button
        if (!nav.contains(event.target) && event.target !== toggleNav) {
            nav.classList.remove('show');
        }
    });
});


function searchArticles() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const articles = document.querySelectorAll('.post');
    
    articles.forEach(article => {
        const title = article.querySelector('h3').innerText.toLowerCase();
        const content = article.querySelector('p').innerText.toLowerCase();
        
        if (title.includes(input) || content.includes(input)) {
            article.style.display = '';
        } else {
            article.style.display = 'none';
        }
    });
}