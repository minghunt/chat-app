const users = []
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }
    let avatarUrl = 'https://api.dicebear.com/6.x/avataaars/svg?seed='+username
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    if (existingUser)
        return {
            error: 'User name is in use!'
        }

    const user = { id, username, room,avatarUrl }

    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1)
        return users.splice(index, 1)[0]
}

const getUser = (id) => {
    const user = users.find((user) => user.id === id)
    if (!user)
        return undefined
    return user
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room.toLowerCase())
}
 
export { addUser, removeUser, getUser, getUsersInRoom } 