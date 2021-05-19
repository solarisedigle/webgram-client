import React from 'react'
import './css/PostActionButt.css'
export default function PostActionButt(props) {
    function deletePost(){
        if(prompt('Please enter ' + props.post.user.username + ' to confrirm') !== props.post.user.username) return;
        const $ = window.$;
        $.ajax({
            url: window.vars.host + 'api/v1/post/' + props.post.post.id,
            method: 'DELETE',
            headers: {
                "Authorization": localStorage.getItem('jwt')
            },
            beforeSend: function(){
                $('#delete-post').addClass('fa-hourglass-half');
                $('#delete-post').removeClass('fa-times');
                $('#delete-post').prop('disabled', true);
                $('button, input').prop('disabled', true);
            },
            complete: function(data){
                if (data.status === 200) window.location.reload();
                if (data.status === 401 || data.status === 403) window.location.href="/login";
                else document.location.reload();
                $('button, input').prop('disabled', false);
            }
        });
    }
    if(localStorage.getItem('user') && (props.post.user.id === JSON.parse(localStorage.getItem('user')).id || props.post.user.role === 'admin')){
        return (<i onClick={deletePost} className="fa fa-times" id="delete-post"></i>);
    }
    else return /*(<i className="fas fa-exclamation-triangle" id="notify-admin"></i>)*/null;
}
