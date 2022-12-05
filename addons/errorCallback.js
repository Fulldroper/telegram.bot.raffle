const axios = require("axios").default
module.exports = ({webhook_url, username, avatar_url}) => {
    return function (content) {
        axios({
            method: 'post',
            url: webhook_url,
            headers:{
                "Content-Type": "multipart/form-data"
            },
            data: {
                content:`\`\`\`js\n${content?.stack || content}\`\`\``,
                username,
                avatar_url,
                // thread_name: `new error in ${username}`
            }
        })
    }
}