var socket = io()

//Elements
const $messForm = document.querySelector('#message-form')
const $messFormInput = document.querySelector('input')
const $messFormButton = document.querySelector('#submit')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Tempaltes
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroll = () => {
    $messages.scrollTop = $messages.scrollHeight
}

socket.on('message', (mess) => {
    console.log(mess)
    const html = Mustache.render(messageTemplate, {
        username: mess.username,
        mess: mess.text,
        createdAt: moment(mess.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoScroll()
})

socket.on('locationMessage', (locationMess) => {
    console.log(locationMess)
    const html = Mustache.render(locationTemplate, {
        username: locationMess.username,
        url: locationMess.url,
        createdAt: moment(locationMess.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoScroll()
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    $messFormButton.setAttribute('disabled', 'disabled')

    const messValue = e.target.elements.mess.value

    socket.emit('messSend', messValue, (error) => {
        $messFormButton.removeAttribute('disabled')
        $messFormInput.value = ''
        $messFormInput.focus()
        if (error)
            return console.log(error)
    })
})

$sendLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)

        let location = {
            latitude: position.coords.latitude,
            longtitude: position.coords.longitude
        }
        socket.emit('sendLocation', location, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })

})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
    })
    document.querySelector('#sidebar').innerHTML = html
})