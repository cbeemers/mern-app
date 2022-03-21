import React from 'react'
import Post from "../layout/post";

/**---------------------------------------------------------------------
 * AUTHENTICATION
 -----------------------------------------------------------------------*/

export async function authenticate(email, password) {
    return await fetch("http://localhost:9000/users/authenticate", {
        method: 'POST',
        body: JSON.stringify({
            email, password
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(async res => {
        return await res.json().then(data => {
            if (data['error']) {
                return {
                    message: "Username or password incorrect"
                };
            } else {
                document.cookie = 'token' + "=" + "bearer " + data['token'];
                window.location.reload();
                return null
            }
        });
    });
}

export async function createAccount(body) {
    return await fetch('http://localhost:9000/users/add', {
        method: 'POST', 
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }

    }).then(async res => {
        return await res.json();
    });
}

/**---------------------------------------------------------------------
 * POSTS, FEED
 -----------------------------------------------------------------------*/

export function displayPosts(posts, currUserId, component) {
    return posts.map((post, i) => {
        return (<Post 
                    numberLikes={post['numberLikes']} 
                    content={post['content']}
                    userName={post['userName']}
                    profilePicture={post['profilePicture']}
                    createdAt={post['createdAt']}
                    openPost={component.openPost.bind(component)}
                    currUserId={currUserId}
                    postId={post['postId']}
                    openProfile={component.openProfile.bind(component)}
                />);
    });
}

export async function getFeed(userId) {
    return await fetch("http://localhost:9000/feed/getFeed?userId="+userId, {
        method: "GET",
    }).then(async res => {
        return res.json();
    });
}

export async function getUserPosts(userId) {
    return await fetch('http://localhost:9000/feed/getUserPosts?userId='+userId, {
        method: 'GET'
    }).then(async res => {
        return await res.json();
    });
}

export async function getComments(postId) {
    return await fetch('http://localhost:9000/feed/getComments?postId='+postId, {
        method: 'GET'
    }).then(async res => {
        return res.json();
    })
}

export async function createPost(userId, newPostContent, parentId) {

    if (newPostContent != '') {
        await fetch('http://localhost:9000/feed/createPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId, content: newPostContent, parent: parentId
            })
        });
    }
}

export async function likePost(postId, userId) {
    return await fetch('http://localhost:9000/feed/likePost', {
            method: 'POST', 
            body: JSON.stringify({
                userId,
                postId
            }), 
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(async res => {
            return await res.json();
        });
}

export async function dislikePost(postId, userId) {
    return await fetch('http://localhost:9000/feed/unlikePost', {
        method: 'POST',
        body: JSON.stringify({
            postId, 
            userId
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async res => {
        return await res.json();
    });
}

export async function didUserLike(postId, userId) {
    return await fetch('http://localhost:9000/feed/getUserLike?userId='+userId+'&postId='+postId, {
            method: 'GET'
        }).then(async res => {
            return await res.json();
        });
}

/**------------------------------------------------------------------
 * PROFILE, USER INFORMATION
 --------------------------------------------------------------------*/

export async function getProfile(userId) {
    return await fetch("http://localhost:9000/profiles/getProfile?userId="+userId, {
        method: "GET",
        "Content-Type": "application/json",
    }).then(res => {
        return res.json()
    });
}

export async function editBio(bio, userId) {
    return await fetch("http://localhost:9000/profiles/updateBio", {
            method: 'POST',
            body: JSON.stringify({
                bio, 
                userId
            }), 
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => {
            if (res.status == 200) {
                return res.json();
            } else {
                return null;
            }
        });
}

export async function updateProfilePicture(fileData, userId) {
    return await fetch('http://localhost:9000/profiles/updateProfilePicture?userId=' + userId, {
        method: "POST",
        body: fileData
    }).then(async (res) => {
        return await  res.json();
    })
}

/**--------------------------------------------------------------------
 * FRIENDSHIPS
 -----------------------------------------------------------------------*/

export async function getAllFriendships(userId) {
    return await fetch("http://localhost:9000/friendships/getAll?id="+userId).then(async res => {
        return await res.json();
    });
}

export async function friendshipExists(userId, senderId) {
    return await fetch("http://localhost:9000/friendships/exists?senderId="+senderId+"&userId="+userId, {
        method: "GET", 
        headers: {
            'Content-Type': 'application/json'
        },

    }).then(async res => {
        return await res.json();
    });
}

export async function findProfile(userId, fullName) {
    return await fetch("http://localhost:9000/profiles/findProfile?userId="+userId+ "&fullName="+fullName, {
            method: "GET", 
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (res) => {
            return await res.json();
        });
}

export async function addFriend(senderId, receiverId) {
    return await fetch("http://localhost:9000/friend-requests/sendRequest", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                receiverId,
                senderId
            })
        }).then(async (res) =>{
            return await res.json();
        });
}

export async function removeFriend(userId, removedId) {
    return await fetch("http://localhost:9000/friendships/remove?senderId="+userId+"&removedId="+removedId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(async res => {
        return await res.json();
    });
}

/**---------------------------------------------------------------------
 * REQUESTS
 -----------------------------------------------------------------------*/

 export async function getAllRequests(userId) {
    return await fetch("http://localhost:9000/friend-requests/getRequests?receiverId="+userId, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(async (res) => {
        return await res.json();
    });
}

export async function acceptRequest(body) {
    await fetch("http://localhost:9000/friendships/add", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: body
    });
}

export async function deleteRequest(requestId) {
    return await fetch("http://localhost:9000/friend-requests/deleteRequest", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: requestId})
        }).then(async res => {
            return await res.json();
        });
}

/**---------------------------------------------------------------------------
 * STOCKS/WEATHER
 -----------------------------------------------------------------------------*/

export async function addFavoriteStock(userId, ticker) {
    return await fetch("http://localhost:9000/profiles/addStock", {
        method: "POST", 
        body: JSON.stringify({
            ticker,
            userId, 
        }),
        headers: {
            'Content-Type': 'application/json',
        }

    }).then(async res => {
        return await res.json();
    });
}

export async function searchForStock(ticker) {
    return await fetch('http://localhost:9000/stock?symbol='+ticker, {
        method: 'GET'
    }).then(async res => {
        return await res.json();
    })
}