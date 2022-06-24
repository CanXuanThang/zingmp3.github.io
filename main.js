// play/ pause/ seek
// cd rotate
// next/prev
// random
// next / repeat when ended

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'Xuan-Thang_player'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const  player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const apps = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    // config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY) || {}),
    songs: [
        {
            name: 'Sau lưng anh có ai kìa',
            singer: 'Thiều Bảo Châm',
            path: './mp3/Sau-Lung-Anh-Co-Ai-Kia-Thieu-Bao-Tram.mp3',
            image: './img/saulunganhcoaikia.jpg'
        },
    
        {
            name: 'Chạy về nơi phía anh',
            singer: 'Khắc Việt',
            path: './mp3/ChayVeNoiPhiaAnh-KhacViet-7129688.mp3',
            image: './img/chayvenoiphiaanh.jpg'
        },
    
        {
            name: 'Ngày đầu tiên',
            singer: 'Đức Phúc',
            path: './mp3/NgayDauTien-DucPhuc-7129810.mp3',
            image: './img/ngaydautien.jpg'
        },
    
        {
            name: 'Đau nhất là lặng im',
            singer: 'Erik',
            path: './mp3/DauNhatLaLangIm-ERIK-7130326.mp3',
            image: './img/daunhatlalangim.jpg'
        },
    
        {
            name: 'Yêu đương khó quá thì chạy về đây với anh',
            singer: 'Erik',
            path: './mp3/YeuDuongKhoQuaThiChayVeKhocVoiAnh-ERIK-7128950.mp3',
            image: './img/chayvekhocvoianh.jpg'
        },
    
        {
            name: 'Và ngày nào đó',
            singer: 'Quang Trung',
            path: './mp3/VaNgayNaoDo-StudioPartyQuangTrungVuThaoMy-7146301.mp3',
            image: './img/vangaynaodo.jpg'
        },
    ],
    // setConjig: function(key, value) {
    //     this.config[key] = value,
    //     localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    // },
    render: function() {
        const htmls =this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index    }">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý cd quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, //10s
            interation: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop 
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth 
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }

        // Khi song đc play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi đc pause 
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua song
        progress.onchange = function(e) {
            const seekTime = (e.target.value * audio.duration / 100)
            audio.currentTime = seekTime
        }

        // Khi next bài hát 
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
        }

        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        // Khi random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý phát lại 1 bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(active)')

            if (songNode || e.target.closest('option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }

                // Xử lý khi click vào option song
                if (e.target.closest('.option')) {
                     
                }
            }
        }
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length - 1) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        // Lắng nghe / xử lý các sự kiện (DOM event)
        this.handleEvents()

        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        this.loadCurrentSong()

        this.render()
    },
}


apps.start()