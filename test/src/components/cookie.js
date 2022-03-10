

export function getCookie(cookie) {
    var name = cookie + "=";

    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (let i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        } 
    }
    return "";
}

export async function checkToken(token) {
    let id;
    await fetch("http://localhost:9000/checkToken?token="+token, {
        method: 'GET',
    }).then(async (res) => {
        if (res.status == 200) {
            await res.json().then(data => {
                id = data['id']
            })
        }
    });
    return id;
}