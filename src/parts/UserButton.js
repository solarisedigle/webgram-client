import React, { Fragment, useEffect, useState } from 'react'

export default function UserButton(props) {
    const [relation, setRelation] = useState(0);
    useEffect(() => {
        const $ = window.$;
        if(localStorage.getItem('jwt')){
            $.ajax({
                url: window.vars.host + 'api/v1/user/' + props.user.id + '/getRelation',
                method: 'GET',
                async: false,
                headers: {
                    "Authorization": localStorage.getItem('jwt')
                },
                complete: function(data){
                    if (data.status === 200) setRelation(JSON.parse(data.responseText).relation);
                }
            });
        }
    }, [props]);
    function followHandler(){
        const $ = window.$;
        $.ajax({
            url: window.vars.host + 'api/v1/user/' + props.user.id + '/subscribe',
            method: 'POST',
            headers: {
                "Authorization": localStorage.getItem('jwt')
            },
            beforeSend: function(){
                $('#follow .spinner-border').css('display', 'inline-block');
                $('button, input').prop('disabled', true);
            },
            complete: function(data){
                if (data.status === 200) setRelation(JSON.parse(data.responseText).relation);
                else if (data.status === 401 || data.status === 403) window.location.href="/login";
                else document.location.reload();
                $('.spinner-border').hide();
                $('button, input').prop('disabled', false);
            }
        });
    }
    function unFollowHandler(){
        const $ = window.$;
        $.ajax({
            url: window.vars.host + 'api/v1/user/' + props.user.id + '/subscribe',
            method: 'DELETE',
            headers: {
                "Authorization": localStorage.getItem('jwt')
            },
            beforeSend: function(){
                $('#unfollow .spinner-border').css('display', 'inline-block');
                $('button, input').prop('disabled', true);
            },
            complete: function(data){
                if (data.status === 200) setRelation(JSON.parse(data.responseText).relation);
                else if (data.status === 401 || data.status === 403) window.location.href="/login";
                else document.location.reload();
                $('.spinner-border').hide();
                $('button, input').prop('disabled', false);
            }
        });
    }
    function deleteAccount(){
        if(prompt('Please enter ' + props.user.username + ' to confrirm') !== props.user.username) return;
        const $ = window.$;
        $.ajax({
            url: window.vars.host + 'api/v1/user/' + props.user.id,
            method: 'DELETE',
            headers: {
                "Authorization": localStorage.getItem('jwt')
            },
            beforeSend: function(){
                $('#delete .spinner-border').css('display', 'inline-block');
                $('button, input').prop('disabled', true);
            },
            complete: function(data){
                if (data.status === 401 || data.status === 403 || data.status === 200) window.location.href="/";
                else document.location.reload();
                $('.spinner-border').hide();
                $('button, input').prop('disabled', false);
            }
        });
    }
    function DeleteButton(){
        if(relation === 'owner' || (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).role === 'admin')){
            return <button className="wg-button danger sm" onClick={deleteAccount} id="delete"><span className="spinner-border spinner-border-sm"></span> delete account <i className="fa fa-user-times"></i></button>
        }
        else return null;
    }
    function ActionButton(){
        if(relation === 'subscriber'){
            return <button className="wg-button reverse sm mt-2" onClick={unFollowHandler} id="unfollow"><span className="spinner-border spinner-border-sm"></span> unfollow <i className="fa fa-user-times"></i></button>
        }
        else if (relation !== 'owner'){
            return <button className="wg-button sm mt-2" onClick={followHandler} id="follow"><span className="spinner-border spinner-border-sm"></span> follow <i className="fa fa-user-plus"></i></button>
        }
        else{
            return null;
        }
    }
    return <Fragment>
        <DeleteButton />
        <ActionButton />
    </Fragment>
    
}
