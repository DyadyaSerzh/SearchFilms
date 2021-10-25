const url = 'http://www.omdbapi.com/?apikey=573c8791'
    //const url = 'http://www.omdbapi.com/?'

const form = document.forms.namedItem('queryline')
let query = ''
let extQuery1 = ''
let totalPages
let pageCounter = 1


const queryField = document.getElementById('queryField')
const paginationWrapper = document.querySelector('.pagination_wrapper')
const pageLeft = document.getElementById('page_left')
const pageRight = document.getElementById('page_right')
    // let type = document.getElementById('type').value

queryField.oninput = (e) => {
    query = e.target.value
}

form.onsubmit = (e) => {
    e.preventDefault()
    sendRequest('', true)
}


const contentWrapper = document.querySelector('.content_wrapper')
const fullScreen = function() {
    console.log('fullscreen mode')
}

function createEl(el, cl = '') {
    let element = document.createElement(el)

    // element.style = ('class = "test"')
    element.classList.add(cl)
        // console.log(element);
    return (element)
}
createEl('div', 'test')

function paginationControl(type) {
    if (type == 'fwd') {
        pageCounter += 1
    }
    if (type == 'back') {
        pageCounter -= 1
    }

    console.log(pageCounter, totalPages, pageCounter >= totalPages);

    sendRequest(pageCounter, true)
    paginationWrapper.innerHTML = `
    ${pageCounter <= 1 ? `<span class="page_number" id="page_left"></span>` : `<span onclick="paginationControl('back')" class="page_number" id="page_left">&larr;</span>`}
    <span class="page_number">${pageCounter <= 1 ? '' : pageCounter-1}</span>
    <span class="page_number active_page">${pageCounter}</span>
    ${(totalPages<=1)||(pageCounter<totalPages) ? `<span class="page_number">${pageCounter+1}</span>`: `<span class="page_number"></span>`}
    ${(totalPages<=1)||(pageCounter<totalPages) ? `<span onclick="paginationControl('fwd')" class="page_number" id="page_right">&rarr;</span>`: `<span class="page_number" id="page_right"></span>`}`

}

//

function sendRequest(pageNumber=1, initialLoad) {
    
    let type = document.getElementById('type').value
    // storing last query in Local Storage
    if(initialLoad == false) query=localStorage.getItem('lastRequest');
    localStorage.setItem('lastRequest', query)
    console.log(query);
    console.log(type);
    console.log(url+`&type=${type}&t=${query}&page=${pageNumber}&plot=full`)
    
    fetch(url+`&s=${query}&page=${pageNumber}&plot=full`).then(response1 => {
    
        return response1.json()
    }).then(response2 => {
        const contentObject = response2.Search
        console.log(response2);
        totalPages = Math.ceil(response2.totalResults/10)

        // pagination logic
        if(!initialLoad) {
            paginationControl()
        }


        contentWrapper.innerHTML = ''
        if (response2.Response!='False'){
            contentObject.forEach(elementObject => {
                // creating image preview container
                const wrapperElement = document.createElement('div')
                const spinner = document.createElement('div')
                spinner.classList.add('loader')
                // wrapperElement.innerHTML=`<span>${elementObject.Title}</span>`
                wrapperElement.classList.add('wrapper_element')
                wrapperElement.appendChild(spinner)

                var src = elementObject.Poster

                var image = new Image();
                
                image.addEventListener('load', function() {
                    wrapperElement.style.backgroundImage = 'url(' + src + ')';
                    spinner.remove()
                });
                image.src = src;

                // wrapperElement.style.backgroundImage = `url(${elementObject.webformatURL})`
                // wrapperElement.
                contentWrapper.appendChild(wrapperElement)

                wrapperElement.onclick = () => {
                    fetch(url+`&t=${elementObject.Title}&plot=full`).then(response3 => {
    
                        return response3.json()
                        }).then(response4 => {
                            console.log('resp4',response4.Type);
                        const fullscreen = document.createElement('div')
                        fullscreen.classList.add('wrapperTest')
                        // fullscreen.classList.add('fullscreen')
                        // fullscreen.innerHTML = `<img src=${elementObject.Poster}/><span>${elementObject.Title}</span>`
                        // let titleFS=document.createElement('p')
                        // titleFS.classList.add('titleFS')
                        let titleFS=createEl('div','titleFS')
                        titleFS.innerHTML=elementObject.Title
                        let gridDes = createEl('div','gridDes')
                        let poster = createEl('div','poster')
                        let description=createEl('div','description')
                        

                        fullscreen.append(titleFS)
                        fullscreen.append(gridDes)
                        gridDes.append(poster)
                        gridDes.append(description)
                        
                        for (let i in response4) {
                            // console.log(i);
                            let desArr=[]
                            let desArr2=[]
                            desArr[i]=document.createElement('span')
                            desArr2[i]=document.createElement('span')
                            desArr[i].innerHTML=i;
                            desArr2[i].innerHTML=response4[i];
                            description.append(desArr[i])
                            description.append(desArr2[i])
                        }

                        
                        // Task1: smooth appending with CSS transition
                        document.body.appendChild(fullscreen)

                        fullscreen.addEventListener('click', (e) => {
                            if(e.target == fullscreen) {
                                console.log('is fullscreen!')
                                fullscreen.remove()
                            }
                        }, {once: true})

                        window.addEventListener('keyup', e => {
                            console.log('escape pressed!')
                            if(e.code == 'Escape') fullscreen.remove()
                        }, {once: true})
                    })
                }
            });
        }
        else {
            const wrapperElement = document.createElement('div')
            wrapperElement.innerHTML=`
            <span class='error'>Не найдено ни одного фильма</span>
            `
            contentWrapper.appendChild(wrapperElement)
        }
    })
}
// createEl('div','das')
// initial load of page
window.addEventListener('load', sendRequest('', false))