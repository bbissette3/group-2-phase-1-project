let showFirst = true;
let addSong = false;

document.addEventListener('DOMContentLoaded', () => {

    const addButton = document.querySelector('.toggle-form-button')
    const formContainer = document.querySelector('#new-song-form')

    addButton.addEventListener('click', () => {
        addSong = !addSong;
        if (addSong) {
            formContainer.style.display = 'block'
        } else {
            formContainer.style.display = 'none'
        }
    });

    fetch('http://localhost:3000/songs')
    .then(response => response.json())
    .then(songs => {
        songs.forEach((song) => renderSongs(song))
    });

    const songUl = document.getElementById('music-summary')

    function renderSongs(song) {
          
        const songLi = document.createElement('li')
        songLi.dataset.id = song.id
        songLi.innerText = song.name
        songUl.append(songLi)

        const deleteButton = document.createElement('button')
        deleteButton.setAttribute('class', 'delete-button')
        deleteButton.innerText = '🗑️'

        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            fetch(`http://localhost:3000/songs/${song.id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(() => songLi.remove())
        });

        songLi.append(deleteButton)

        songLi.addEventListener('click', (e) => {
            showSong(song)
        });

        if(showFirst) {
            showSong(song) 
            showFirst = false
        };
        
    };

    function showSong(song) {
        const songInfo= document.querySelector('.song-info')
            songInfo.innerText = ''

            const songName = document.createElement('h3')
            songName.innerText = "Song Name: " + song.name

            const songImg = document.createElement('img')
            songImg.src = song.image

            const musicArtist = document.createElement('h3')
            musicArtist.innerText = "Artist: " + song.artist

            const musicButton = document.createElement('button')
            musicButton.setAttribute('class', 'music-button')
            musicButton.innerText = song.thumbsUp === true ? '👍' : '👎'



            musicButton.addEventListener('click', (e) => {
                handlePatch(musicButton, song.id)
            });

            songInfo.append(songName, songImg, musicArtist, musicButton)
    }

    const form = document.getElementById('new-song-form')
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newSong = document.getElementById('new-song').value
            const newArtist = document.getElementById('new-artist').value
            const newAlbumImg = document.getElementById('new-album-image').value

            const newSongObj = {
                name: newSong,
                image: newAlbumImg,
                artist: newArtist,
                thumbsUp: true,
            }

            const configObj = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSongObj)
            }

            fetch('http://localhost:3000/songs', configObj)

            renderSongs(newSongObj)
            form.reset();
    });

    function handlePatch(musicButton, id) {
        let toPatch;
        if(musicButton.innerText === '👍'){
            toPatch = false
        }else toPatch = true

        fetch(`http://localhost:3000/songs/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({thumbsUp: toPatch})
        }) 
        .then(() => {
                if(musicButton.innerText === '👍') {
                    musicButton.innerText = '👎'
                } else {
                    musicButton.innerText = '👍'
            }
         })

    }  
    
    const selectSortBy = document.getElementById('sort-by')
    selectSortBy.addEventListener('change', () => {
        
        const sortBy = selectSortBy.value
        
        fetch('http://localhost:3000/songs')
        .then(response => response.json())
        .then(songs => { 
            let sortedSongs;
            if(sortBy === 'thumbs-up') {
                songUl.innerText = ''
                sortedSongs = songs.filter(songs => songs.thumbsUp === true);
            } else if (sortBy === 'thumbs-down') {
                songUl.innerText = ''
                sortedSongs = songs.filter(songs => songs.thumbsUp === false);
            } else {
                songUl.innerText = ''
                sortedSongs = songs;
            }
            
            sortedSongs.forEach(song => renderSongs(song))
        });  
    });

});
