const generateMessage=(username, text, avatarUrl)=>{
    if (username==='Admin')
        avatarUrl='/img/Admin.jpg'
    return {
        username,
        avatarUrl,
        text,
        createdAt: new Date().getTime()
    }
}
const generateLocationMessage=(username,url,avatarUrl)=>{
    return {
        username,
        avatarUrl,
        url,
        createdAt: new Date().getTime()
    }
}
export {generateMessage,generateLocationMessage}