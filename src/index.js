document.addEventListener('DOMContentLoaded', () => {

    fetch('http://localhost:3000/songs')
    .then(response => response.json())
    .then(songs => {
        songs.forEach((song) => renderSongs(song))
    });

    function renderSongs(song) {
        
        const songUl = document.getElementById('music-summary')
        const songLi = document.createElement('li')
        songLi.innerText = song.name
        songUl.append(songLi)

        const artistFooter = document.createElement('footer')
        artistFooter.innerText = song.artist

        const deleteButton = document.createElement('button')
        deleteButton.innerText = '🗑️'

        songLi.append(artistFooter, deleteButton)

        songLi.addEventListener('click', () => {
            
            const musicInfo= document.querySelector('.complete-info-box')
            musicInfo.innerText = ''

            const songName = document.createElement('h3')
            songName.innerText = song.name

            const songImg = document.createElement('img')
            songImg.src = song.image

            const musicArtist = document.createElement('h3')
            musicArtist.innerText = song.artist

            const musicButton = document.createElement('button')
            musicButton.innerText = song.thumbsUp === true ? '👍' : '👎'

            musicInfo.append(songName, songImg, musicArtist, musicButton)
        })
    };





})