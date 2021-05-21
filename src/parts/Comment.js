import React, {Fragment, useState} from 'react'
import Author from './Author.js'
import CommentModal from './CommentModal'
import Modal from './functional/Modal.js'

export default function Comment(props) {
    const [replies_count, setRepliesCount] = useState(props.data.replies);
    const [modal, setModal] = useState(null);
    function openReplies(){
        let comment = Object.assign({}, props.data);
        comment.post = props.post;
        setModal(comment);
    }
    function deleteComment(){
        if(prompt('Please enter ' + props.data.user.username + ' to confrirm') !== props.data.user.username) return;
        const $ = window.$;
        $.ajax({
            url: window.vars.host + 'api/v1/comment/' + props.data.id,
            method: 'DELETE',
            headers: {
                "Authorization": localStorage.getItem('jwt')
            },
            complete: function(data){
                if (data.status === 200) props.removeComment(props.index);
                if (data.status === 401 || data.status === 403) window.location.href="/login";
            }
        });
    }
    let user_viewer = JSON.parse(localStorage.getItem('user'));
    return (
        <Fragment>
            <div className="comment-block">
                <a href={'/' + props.data.user.username}><img alt="User" src={'https://avatars.dicebear.com/api/human/' + props.data.user.username + '.svg'} /></a>
                <div className="comment-content-block">
                    <Author user={props.data.user} time_ago={props.data.created_at} class={'comment-author-block'} />
                    <p className="comment_text" dangerouslySetInnerHTML={{__html: props.data.body}}></p>
                    <span className="reply-butt" onClick={openReplies}><i className="fas fa-comments"></i> discussion {replies_count > 0 ? '(' + replies_count + ')' : null}</span>
                    {
                        (user_viewer && (props.data.user.id === user_viewer.id || user_viewer.role === 'admin'))
                        ? <Fragment>
                            <span> • </span>
                            <span className="delete-butt" onClick={deleteComment}>delete</span>
                        </Fragment>
                        : null
                    }
                </div>
            </div>
            {
                modal
                ? 
                <Modal>
                    <CommentModal 
                        comment={modal} 
                        key={modal} 
                        id={'wg-m-' + Date.now()} 
                        globalModalState={props.globalModalState ? props.globalModalState : setModal} 
                        modalState={setModal} 
                        parentRepliesCountFunc={setRepliesCount}
                        parentModalShow={props.parentModalShow}
                    />
                </Modal>
                : null
            }
        </Fragment>
    )
}
