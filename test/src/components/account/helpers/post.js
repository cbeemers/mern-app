import React from 'react'
import Post from "../layout/post";

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

// export function openPost(post) {
//     console.log("post")
// }