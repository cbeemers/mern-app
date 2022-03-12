import React from 'react'
import Post from "../layout/post";

export function displayPosts(posts, component) {
    return posts.map((post, i) => {
        return (<Post 
                    numberLikes={post['numberLikes']} 
                    content={post['content']}
                    userName={post['userName']}
                    profilePicture={post['profilePicture']}
                    createdAt={post['createdAt']}
                    gopenPost={openPost.bind(component)}
                />);
    });
}

export function openPost(postId) {
    console.log("post")
}