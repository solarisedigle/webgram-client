import React, { Fragment, useState } from 'react'
import Comment from './Comment.js'

export default function Comments(props) {
    const [comments, setComments] = useState(props.comments);
    const [comments_limit, setCommentsLimit] = useState(3);
    const $ = window.$;
    function add_comment(e){
        let url = 'api/v1/post/' + props.post.post.id + '/comment';
        if (props.parent > 0) url = 'api/v1/comment/' + props.parent + '/reply';
        $.ajax({
            url: window.vars.host + url,
            method: 'POST',
            data: {
                body: $('#comment-field-' + props.post.post.id + 'p' + props.parent).val()
            },
            headers: {
                "Authorization": localStorage.getItem('jwt')
            },
            beforeSend: function(){
                $(e.target).hide();
                $(e.target).parent().find('.spinner-border').css('display', 'inline-block');
                $('button, input').prop('disabled', true);
                $('#comment-errors-' + props.post.post.id).hide();
            },
            complete: function(data){
                if (data.status === 200) {
                    comments.unshift(JSON.parse(data.responseText).comment)
                    setComments(comments.slice());
                    if (props.parentRepliesCountFunc) props.parentRepliesCountFunc(comments.length);
                }
                else if(data.status === 422){
                    let errors = JSON.parse(data.responseText).errors;
                    let errors_text = '';
                    for (let error in errors) {
                        errors_text += '<br>' + error + ': ' + errors[error];
                    }
                    $('#comment-errors-' + props.post.post.id).html(errors_text).show();
                }
                else if (data.status === 401 || data.status === 403) window.location.href="/login";
                else window.location.reload();
                $(e.target).parent().find('.spinner-border').hide();
                $('#comment-field-' + props.post.post.id + 'p' + props.parent).val('');
                $(e.target).show();
            }
        });
    }
    function moreComments(){
        setCommentsLimit(comments_limit + 5);
    }
    function removeComment(index){
        comments.splice(index, 1);
        setComments(comments.slice());
    }
    return (
        <Fragment>
            <div className="post-block-comment-field">
                <textarea className="wg-input" placeholder={'Add ' + (props.parent > 0 ? 'reply' : 'comment') + '...'} rows="1" maxLength="250" id={'comment-field-' + props.post.post.id + 'p' + props.parent}></textarea>
                <i onClick={add_comment} className="far fa-comment-alt comment-add transition"></i>
                <span className="spinner-border spinner-border-sm"></span>
            </div>
            <p className="wg-errors-p" id={'comment-errors-' + props.post.post.id}></p>
            {
                comments.length > 0
                ? (<div className="post-block-comments">
                        {comments.slice(0, comments_limit).map((comment, index) => {
                            return(<Comment 
                                        data={comment} 
                                        key={comment.id} 
                                        index={index} 
                                        removeComment={removeComment} 
                                        post={props.post}
                                        globalModalState={props.globalModalState}
                                        parentModalShow={props.parentModalShow}
                                    />)
                        })}
                        {
                            comments_limit < comments.length
                            ? (<p className="comments-show-more" onClick={moreComments}><i className="fas fa-angle-down"></i> Show more</p>)
                            : null
                        }
                    </div>)
                : null
            }
            
        </Fragment>
    )
}
