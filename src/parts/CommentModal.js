import React, { useEffect, useState } from 'react'
import Author from './Author.js'
import Comments from './Comments.js'
import './css/CommentModal.css'

export default function CommentModal(props) {
    const [replies, setReplies] = useState([]);
    const $ = window.$;
    useEffect(() => {
        $('.modal').modal('hide');
        $('.modal-backdrop').remove();
        $('#' + props.id).modal("show");
        $.ajax({
            url: window.vars.host + 'api/v1/comment/' + props.comment.id,
            method: 'GET',
            complete: function(data){
                if (data.status === 200) {
                    setReplies(JSON.parse(data.responseText).replies);
                }
            }
        });
    }, [props, $, setReplies]);
    function close_me(){
        $('.modal').modal('hide');
        $('.modal-backdrop').remove();
        if(props.parentModalShow) props.parentModalShow();
        props.modalState(null);
    }
    function show_me(){
        $('#' + props.id).modal("show");
    }
    function close_all(){
        $('.modal').modal('hide');
        $('.modal-backdrop').remove();
        props.globalModalState(null);
    }
    return (
        <div className="modal" id={props.id} data-backdrop="static" data-keyboard="false">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="modal-comment-author">
                            <a href={'/' + props.comment.user.username}><img alt="User" src={'https://avatars.dicebear.com/api/human/' + props.comment.user.username + '.svg'} /></a>
                            <div>
                                <div className="comment-author-name">
                                    <Author user={props.comment.user} time_ago={props.comment.created_at}/>
                                </div>
                                <p>{props.comment.body}</p>
                            </div>
                        </div>
                        <div className="modal_action">
                            {
                                props.parentModalShow
                                ? (<i className="fas fa-level-up-alt" onClick={close_me}></i>)
                                : null
                            }
                            <i className="fas fa-times" onClick={close_all}></i>
                        </div>
                        
                    </div>
                    <div className="modal-body">
                        <Comments 
                            comments={replies} 
                            key={replies} 
                            post={props.comment.post} 
                            parent={props.comment.id} 
                            parentRepliesCountFunc={props.parentRepliesCountFunc}
                            parentModalShow={show_me}
                            globalModalState={props.globalModalState}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
