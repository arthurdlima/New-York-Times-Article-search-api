
//Api source with my key
var apiURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
var apiKey = "8b7bd25e12164826ba91787497ea5c6b";
fullURL = "";


//Now I need to select the DOM elements to manipulate in script

//------------------ DOM VARIABLES ----------------------
//hiding the nav, dont need it visible when page loads
var btnVisibility = document.querySelector(".button_visi");
btnVisibility.style.display = "none";
//where to display the data
var displayArea = document.querySelector("#show-result");
//Input field
var inputSearch = document.querySelector("#search");
//Next and previous page
var nBtn = document.querySelector("#next");
var pBtn = document.querySelector("#prev");
//Selecting the whole form, to use in the submit function
var searchForm = document.querySelector("form");
//Page variable
var pgNumber = 0;
//About my site 
var aboutMysite = document.querySelector(".about_mysite");
aboutMysite.style.display = "block";

// ------------------------------------------------------

//Search and button event

searchForm.addEventListener("submit", getResults);
nBtn.addEventListener("click", nextPage);
pBtn.addEventListener("click", previousPage);


function getResults(e) {

    //this prevents that sending of the form
    e.preventDefault();

    var fullURL = apiURL + "?api-key=" + apiKey + "&q=" + inputSearch.value + "&page=" + pgNumber;

    // Making the request
    var requestAPI = new XMLHttpRequest();
    requestAPI.open("GET", fullURL);
    requestAPI.send();

    requestAPI.onload = function () {
        var foundJSON = JSON.parse(requestAPI.responseText);
        showResults(foundJSON);
        //console.log(foundJSON.response.docs[0]);
    }

}
// ----------------------------------------------------
function showResults(foundJSON) {
    /*while note: clicking searching again, data wont constantly be added on page*/
    while (displayArea.firstChild) {
        displayArea.removeChild(displayArea.firstChild);
    }
    //-------------------------------------------------
    var articles = foundJSON.response.docs;

    if (articles.length === 0) {
        var noResult = document.createElement("p");
        noResult.textContent = "No results returned."
        displayArea.appendChild(noResult);
    }
    // 10 articles to be returned, fixed number by API; display btns:
    if (articles.length >= 10) {
        btnVisibility.style.display = "block";
        aboutMysite.style.display = "none";
    } else {
        btnVisibility.style.display = "none";
        aboutMysite.style.display = "block";
    }
    if (articles.length != 0) {
        for (var i = 0; i < articles.length; i++) {
            var article = document.createElement('article');
            var heading = document.createElement('h2');
            var date = document.createElement('h3');
            var link = document.createElement('a');
            var img = document.createElement('img');
            var snippet = document.createElement('p');
            var clearfix = document.createElement('div');
            var current = articles[i];

            //Elements styles 
            article.style.background = "black";
            article.style.paddingTop = "0em";
            article.style.paddingBottom = "3em";
            article.style.paddingLeft = "2em";
            article.style.paddingRight = "2em";


            link.style.color = "white";
            link.style.textDecoration = "none";
            link.style.textTransform = "uppercase";
            link.style.fontSize = "1rem";

            date.style.color = "white";
            date.style.textDecoration = "none";
            date.style.textTransform = "uppercase";
            
              




            snippet.style.color = "white";
            snippet.style.textDecoration = "none";
            snippet.style.fontSize = "1rem";


            //variables to recieve api data from current
            link.href = current.web_url;
            link.textContent = current.headline.main;

            snippet.textContent = current.snippet;
            // Used this function to get only the part of the date, not time.
            var date_string = current.pub_date;
            function fixD (date_string) {return date_string.substr(0,9)};
            if (date_string != null){
            date.textContent = fixD(date_string);
            }
            //Loading images if present
            if (current.multimedia.length > 0) {
                img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
                img.alt = current.headline.main;
            }
            //Actually displaying on the html
            //clearfix to fix image and text scale
            clearfix.setAttribute("class", "clearfix");
            article.appendChild(heading);
            heading.appendChild(link);
            article.appendChild(date);
            article.appendChild(img);
            article.appendChild(snippet);
            article.appendChild(clearfix);
            displayArea.appendChild(article);


        }
        console.log(displayArea);
    }
}

function nextPage(e) {
    pgNumber++;
    getResults(e);
}
function previousPage(e) {
    if (pgNumber > 0) {
        pgNumber--;
    } else {
        return;
    }
    getResults(e);
}


