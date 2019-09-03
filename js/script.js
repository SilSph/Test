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
    var allCategoriesUrl= "Categories.json";
    var categoriesTitleHtml = "snippets/art-categories-title-snippet.html";
    var categoryHtml = "snippets/art-categories-snippet.html";
    var artItemsUrl = "PortfolioItem.json?category=";
    var artItemsTitleHtml= "snippets/art-items-title.html";
    var artItemsHtml = "snippets/art-items.html";


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

    //Restituisce il valore da inserire il {{propName}} in formato stringa
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    }

    //al caricamento della pagina, prima di immagini e CSS
    document.addEventListener("DOMContentLoaded", function(event) {
        //al primo caricamento, mostra la home
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(homeHtml, 
            function (responseText) {
                insertHtml("#main-content", responseText);
            },
            false
        );
    });

    dc.loadArtCategories = function() {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
    };

    //Questa funzione prende il parametro categoryShort da art-category-snippets
    dc.loadArtItems = function (categoryShort) {
        showLoading("#main-content");
        console.log(artItemsUrl + categoryShort);
        $ajaxUtils.sendGetRequest(artItemsUrl + categoryShort, buildAndShowArtItemsHTML);
    };

    function buildAndShowCategoriesHTML(categories) {
        $ajaxUtils.sendGetRequest(categoriesTitleHtml, function (categoriesTitleHtml) {
            $ajaxUtils.sendGetRequest(categoryHtml, function(categoryHtml) {
                var categoriesViewHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
                insertHtml("#main-content", categoriesViewHtml);
            },
            false);
        },
        false);
    }

    function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

        //loop tra le categorie
        for(var i = 0; i < categories.length; i++) {
            // Insert category values
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }

    // Costruisce la pagina HTML per ogni categoria selezionata con l'elenco dei singoli oggetti
    function buildAndShowArtItemsHTML (categoryArtItems) {
        console.log(categoryArtItems);
        $ajaxUtils.sendGetRequest(artItemsTitleHtml, function (artItemsTitleHtml){
            $ajaxUtils.sendGetRequest(artItemsHtml, function(artItemsHtml){
                var artItemsViewHtml = buildArtItemsViewHtml (categoryArtItems, artItemsTitleHtml, artItemsHtml);
                insertHtml("#main-content", artItemsViewHtml);
            },
            false);
        },
        false);
    }

    function buildArtItemsViewHtml (categoryArtItems, artItemsTitleHtml, artItemsHtml) {
        artItemsTitleHtml = insertProperty(artItemsTitleHtml, "name", categoryArtItems.category.name);
        var finalHtml = artItemsTitleHtml;
        finalHtml += "<section class='row'>"; //dispone gli oggetti in righe

        //loop sugli oggetti del portfolio
        var artItems = categoryArtItems.art_items;
        var catShortName = categoryArtItems.category.short_name;
        for (var i = 0; i < artItems.length; i++){
            var html = artItemsHtml;
            html = insertProperty(html, "short_name", artItems[i].short_name);
            html = insertProperty(html, "catShortName", catShortName);
            html = insertProperty(html, "year", artItems[i].year);
            html = insertProperty(html, "description", artItems[i].description);
            
            //Aggiunge un clearfix dopo il secondo oggetto
            if (i % 2 != 0) {
                html +=
                  "<div class='clearfix d-md-block d-lg-block'></div>";
              }
          
              finalHtml += html;
        }
        finalHtml +- "</section>";
        return finalHtml;

    }

    global.$dc = dc;

}) (window);