const card = post => {
    return `   

    <div class="card">

        <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">${post.title}<i class="material-icons right">more_vert</i></span>
            <p style="white-space: pre-line;">${post.text}</p>
            <small>${new Date(post.date).toLocaleDateString()}</small>
        </div>
        <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">${post.title}<i class="material-icons right">close</i></span>
            <button class="btn btn-small red js-remove" data-id="${post._id}">
                <i class="material-icons">delete</i>
            </button>
            <button class="btn btn-small js-done" data-id="${post._id}">
                <i class="material-icons">done</i>
            </button>
        </div>
    </div>

    `
};

let posts = [];
const BASE_URL = '/api/post';
let modal;
let sidenav;
let dropdown;

class PostApi{
    static fetch(){
        return fetch(BASE_URL, {method: 'get'}).then(res => res.json())
    }

    static create(post) {
        return fetch(BASE_URL, {
            method: 'post',
            body: JSON.stringify(post),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
    }

    static remove(id){
        return fetch(`${BASE_URL}/${id}`, {
            method : 'delete'
        })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    PostApi.fetch().then(backendPosts => {
        posts = backendPosts.concat();
        renderPosts(posts)
    })

    modal = M.Modal.init(document.querySelector('.modal'));
    sidenav = M.Sidenav.init(document.querySelector('.sidenav'));
    dropdown = M.Dropdown.init(document.querySelector('.dropdown-trigger'));
    document.querySelector('#createPost').addEventListener('click', onCreatePost);
    document.querySelector('#posts').addEventListener('click', onDeletePost);
    document.querySelector('#posts').addEventListener('click', onPostDone);

});

function renderPosts(_posts = []) {
    const $posts = document.querySelector('#posts');

    if (_posts.length > 0) {
        $posts.innerHTML = _posts.map(post => card(post)).join(' ')
    } else {
        $posts.innerHTML = `<div class="center">Постов пока нет</div>`
    }
}

function onCreatePost() {

    const $title = document.querySelector('#title');
    const $text = document.querySelector('#text');

    if ($title.value && $text.value){

        const newPost ={
            title : $title.value,
            text  : $text.value
        }

        PostApi.create(newPost).then( post => {
            posts.push(post);
            renderPosts(posts);
        })
        modal.close();
        $title.value = '';
        $text.value = '';
        M.updateTextFields();
    }
}

function onDeletePost(event){
    if(event.target.classList.contains('js-remove') || event.target.parentNode.classList.contains('js-remove')){
        const descision = confirm('Вы уверены что хотите удалить пост?')

        if(descision){
            const id = event.target.getAttribute('data-id') || event.target.parentNode.getAttribute('data-id')
            PostApi.remove(id).then(() => {
                const postIndex = posts.findIndex(post => post._id === id)
                posts.splice(postIndex,1)
                renderPosts(posts)
            })
        }
    }
}


