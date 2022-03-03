export const uploadFile = (file) => {
    console.log(file)
    const fd = new FormData;
    fd.append('media', file)

    return fetch('http://chat.fs.a-level.com.ua/upload', {
        method: "POST",
        headers: localStorage.authToken ? {Authorization: 'Bearer ' + localStorage.authToken} : {},
        body: fd
        }).then((res) => res.json())
}