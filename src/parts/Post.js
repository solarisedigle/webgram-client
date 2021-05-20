import React from 'react'
import PostActionButt from './PostActionButt.js'
import Author from './Author.js'
import Like from './Like.js'
import Comments from './Comments.js'

export default function Post(props) {
    return (
        <div className="wg-block post-block">
            <div className="post-block-header">
                <div className="author-block">
                    <a href={'/' + props.post.user.username}><img alt="User" src={'https://avatars.dicebear.com/api/human/' + props.post.user.username + '.svg'} /></a>
                    <Author user={props.post.user} time_ago={props.post.post.created_at}/>
                </div>
                <PostActionButt post={props.post}/>
            </div>
            <div className="post-block-content">
                <h3 className="post-block-title" dangerouslySetInnerHTML={{__html: props.post.post.title}}></h3>
                <p className="post-block-body" dangerouslySetInnerHTML={{__html: props.post.post.body}}></p>
                {
                    props.post.post.image
                    ? (<img alt="Post" src={props.post.post.image}/>)
                    : null
                }
            </div>
            <div className="tags_selected">
                {props.post.tags.map((tag, index) => {
                    return <span className="tag-item" key={index}>{tag.name}</span>
                })}
            </div>
            <div className="delimiter">
                    <hr/>
                    <span>{props.post.category}</span>
                </div>
            <div className="post-block-footer">
                <Like post={props.post} />
            </div>
            <Comments comments={props.post.comments} post={props.post} parent={0}/>
        </div>
    )
}
