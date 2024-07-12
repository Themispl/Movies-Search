$(function() {
    var debounceTimeout = null;
 
    $('#searchInput').on('input', function() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            getMovie(this.value.trim());
        }, 1500);
    });
 
    $('#showMore').on('click', function(e) {
        e.preventDefault();
        onShowMoreClicked();
    });
});
 
function getMovie(title) {
    if (!title) return;
 
    onBeforeSend();
    fetchMovieFromApi(title);
}
 
function fetchMovieFromApi(title) {
    let xhr = new XMLHttpRequest();
 
    xhr.open('GET', `http://www.omdbapi.com/?t=${title}&apikey=b79ca9f3`, true);
    xhr.timeout = 5000;
    xhr.ontimeout = (e) => onApiError(e);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                handleResults(JSON.parse(xhr.responseText));
            } else {
                onApiError();
            }
        }
    };
    xhr.send();
}
 
function handleResults(response) {
    if (response.Response === 'True') {
        let transformed = transform(response);
        buildMovie(transformed);
    } else if (response.Response === 'False') {
        hideComponent('#waiting');
        showNotFound();
    }
}
 
function transform(response) {
    let camelCaseKeysResponse = camelCaseKeys(response);
    clearNotAvailableInformation(camelCaseKeysResponse);
    buildImdbLink(camelCaseKeysResponse);
    return camelCaseKeysResponse;
}
 
function camelCaseKeys(response) {
    return _.mapKeys(response, (v, k) => _.camelCase(k));
}
 
function clearNotAvailableInformation(response) {
    for (const key in response) {
        if (response.hasOwnProperty(key) && response[key] === 'N/A') {
            response[key] = '';
        }
    }
}
 
function buildImdbLink(response) {
    if (response.imdbId && response.imdbId !== 'N/A') {
        response.imdbId = `https://www.imdb.com/title/${response.imdbId}`;
    }
}
 
function buildMovie(response) {
    if (response.poster) {
        $('#image').attr('src', response.poster).on('load', function() {
            buildMovieMetadata(response, $(this));
        });
    } else {
        buildMovieMetadata(response);
    }
}
 
function buildMovieMetadata(response, imageTag) {
    hideComponent('#waiting');
    handleImage(imageTag);
    handleLiterals(response);
    showComponent('.movie');
}
 
function hideComponent(selector) {
    return $(selector).addClass('hidden');
}
 
function handleImage(imageTag) {
    if (imageTag) {
        $('#image').replaceWith(imageTag);
    } else {
        $('#image').removeAttr('src');
    }
}
 
function handleLiterals(response) {
    $('.movie').find('[id]').each(function(index, item) {
        if ($(item).is('a')) {
            $(item).attr('href', response[item.id]);
        } else {
            let valueElement = $(item).children('span');
            let metadataValue = response[item.id];
 
            valueElement.length ? valueElement.text(metadataValue) : $(item).text(metadataValue);
        }
    });
}
 
function showNotFound() {
    $('.not-found').removeClass('hidden').appendTo($('.center'));
}
 
function hideNotFound() {
    $('.center').find('.not-found').remove();
}
 
function showError() {
    $('.error').removeClass('hidden').appendTo($('.center'));
}
 
function hideError() {
    $('.center').find('.error').remove();
}
 
function hideExtras() {
    $('.extended').hide();
}
 
function collapsePlot() {
    $('#plot').removeClass('expanded');
}
 
function showComponent(selector) {
    return $(selector).removeClass('hidden');
}
 
function onBeforeSend() {
    showComponent('#waiting');
    hideComponent('.movie');
    hideNotFound();
    hideError();
    collapsePlot();
    hideExtras();
}
 
function onApiError() {
    hideComponent('#waiting');
    showError();
}
 
function onShowMoreClicked() {
    $('#plot').toggleClass('expanded');
    if ($('.extended').is(':visible')) {
        $('.extended').hide(700);
    } else {
        $('.extended').show(700);
    }
}


// $(function(){
//     var debounceTimeout = null
//     $('searchInput').on('input', function(){
//         clearTimeout(debounceTimeout)
//         clearTimeout = setTimeout(() => {
//             getMovie(this.value.trim())
//         }, 1500);
//     })

//     $('showMore').on('click', function(){
//         onShowMoreCliecked()
//     })

// });

// function getMovie(title){
//     if(!title) return

//     onBeforeSend()
//     fetchMovieFromApi(title)
// }


// function fetchMovieFromApi(title){
//     let xhr = new XMLHttpRequest()

//     xhr.open('GET', `http://www.omdbapi.com/?i=${title}&apikey=b79ca9f3`, true);
//     xhr.timeout= 5000
//     xhr.ontimeout = (e) => onAPIError(e)
//     xhr.onreadystatechange = function(){
//         if (xhr.readyState === 4) {
//             if (xhr.status === 200) {
//                 handleResults(JSON.parse(xhr.responseText));
//             } else {
//                 onAPIError();
//             }
//         }
//     };
//  xhr.send();
// }


// function handleResults(response){
//     console.log('API Response:', response); // Added for debugging
//     if(response.Responce === 'True'){
//         let transform = transform(response)
//         buildMovie(transform)
//     }else if (response.Responce === 'False'){
//         hideComponent('#waiting')
//         showNotFound()
//     }
// }


// function transform(){
//     let camelCaseKeysResponse = camelCaseKeys(response)
//     clearNotAvailInformation(camelCaseKeysResponse)
//     buildImdbLink(camelCaseKeysResponse)
//     return camelCaseKeysResponse
// }

// function camelCaseKeys(response){
//     return _.mapKeys(response, (v, k) => _.camelCase(k))
// }
// function clearNotAvailInformation(response){
//     for(const key in response){
//         if(response.hasOwnProperty(key) && response[key] === 'N/A' ){
//             response[key] = ''
//         }
//     }
// }
// function buildImdbLink(response){
//     if(response.imdbId && response.imdb !== 'N/A' ){
//         response.imdbId = `https://www.imdb.com/title/${response.imdbId}`
//     }
// }

// function buildMovie(response){
//     if(response.poster ){
//         $('#image').attr('src', 'response.poster').on('load', function(){
//             buildMovieMetadata(response, $(this))
//         })
//     }else {
//         buildMovieMetadata(response)
//     }

// }
// function buildMovieMetadata(response, imageTag){
//     hideComponent('#waiting')
//     handleImg(imageTag)
//     handleLiterals(response)
//     showComponent('#movie')
// }

// function hideComponent(selector){
//     return $(selector).addClass('hidden')
// }

// function handleImg(imageTag){
//     imageTag ? $('#image').replaceWith(imageTag) : $('#image').removeAttr('src')
// }

// function handleLiterals(response){
//     $('#movie').find('[id]').each((index,item) => function(){
//         if($(item).is('a')){
//             $(item).attr('href', response[item.id])
//         } else {
//             let valueElement = $(item).children('span')
//             let matadataValue = response[item.id]

//             valueElement.length ? valueElement.text(matadataValue) : $(item).text(matadataValue)
//         }
//     })
// }

// function showNotFound(){
//     $('.not-found').colne().removeClass('hidden').appendTo($('.center'))
// }

// function showComponent(selector){
//     return $(selector).clone().removeClass('hidden').appendTo($('.center'))
// }

// function onBeforeSend(){
//     showComponent('#waiting')
//     hideComponent('#movie')
//     hideNotFound()
//     hideError()
//     collapsePlot()
//     hideExtras()
// }

// function collapsePlot(){
//     $('#plot').removeClass('expanded')
// }

// function showError(){
//     $('.error').clone().removeClass('hidden').appendTo($('.center'))
// }

// function hideError(){
//     $('.center').find('.error').remove()
// }

// function hideExtras(){
//     $('.extended').hide()
// }

// function hideNotFound(){
//     $('.center').find('.not-found').remove()
// }

// function onShowMoreCliecked(){
//     $('#plot').toggleClass('expanded')
//     if($('.extended').is(':visibl')){
//         $('.extended').hide(700)
//     }else {
//         $('.extended').show(700)
//     }
// }

// function onAPIError() {
//     hideComponent('#waiting')
//     console.log('Error in API');
//     showError();
// }


