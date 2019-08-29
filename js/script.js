//come document.addEventListener("DOMContentLoaded"). 
//Il simbolo del dollaro e la funzione tra parentesi fa sì che la funzione
//venga eseguita nell'html prima che le immagini siano caricate

$(function () { 

    //seleziono un elemento con l'id navbarToggle, come ducument.querySelector("#navbarToggle")

    $(document).click(function(event) {
        var screenWidth = window.innerWidth;
        if (screenWidth < 992) {
            $("#collapsable-nav").collapse("hide");
        }
    });
});

(function (global) {
    var dc = {}; //dev choose

    var homeHtml = "snippets/home-snippet.html";

    //funzione per inserire innerHtml nel select
    var insertHtml = function(selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    //mostra l'icona di caricamento all'interno dell'elemento selector
    var showLoading = function(selector) {
        var html = "<div class ='text-center'>";
        html += "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector, html);
    };

    //al caricamento della pagina, prima di immagini e CSS
    document.addEventListener("DOMContentLoaded", function(event) {
        //al primo caricamento, mostra la home
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function (responseText) {
                insertHtml("#main-content", responseText);
            },
        false);
    });

    global.$dc = dc;

}) (window);