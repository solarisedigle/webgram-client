import React, { Fragment, useEffect, useState } from 'react'
import Post from './parts/Post.js'
import './css/Post.css'

export default function Posts(props) {
    const [posts, setPosts] = useState([]);
    const [limit, setLimit] = useState([]);
    useEffect(() => {
        const $ = window.$;
        $.ajax({
            url: window.vars.host + 'api/v1/posts',
            method: 'GET',
            data: {
                user: props.user,
                category: props.category,
                text: props.text,
                tags: props.tags,
                order: props.order,
                limit: limit,
            },
            complete: function(data){
                if (data.status === 200) setPosts(JSON.parse(data.responseText).posts);
            }
        });
    }, [props, limit, setPosts]);
    return (
        <Fragment>
            {posts.map((post, index) => {
                return (<Post post={post} key={index}/>)
            })}
        </Fragment>
    )
}
