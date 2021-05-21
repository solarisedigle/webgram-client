import React, { Fragment, useEffect, useState } from 'react'
import './css/Header.css'

const $ = window.$;

export default function Header() {
    const [user, setUser] = useState(0);
    useEffect(() => {
        if(localStorage.getItem('jwt')){
            $.ajax({
                url: window.vars.host + 'api/v1/getMe',
                method: 'POST',
                async: false,
                headers: {
                    "Authorization": localStorage.getItem('jwt')
                },
                complete: function(data){
                    if (data.status === 200) setUser(JSON.parse(data.responseText));
                    else if (data.status === 401) {
                        localStorage.removeItem('jwt');
                        localStorage.removeItem('user');
                    }
                }
            });
        }
    }, []);
    function SearchUsers(){
        $.ajax({
            url: window.vars.host + 'api/v1/searchUsers/' + $('#search-user').val(),
            method: 'GET',
            complete: function(data){
                if (data.status === 200) {
                    let users = JSON.parse(data.responseText).users;
                    let content = '';
                    for (let i = 0; i < users.length; i++) {
                        content += '<a href="/' + users[i].username + '" class="s-user-link-a"><div class="wg-pop-item s-user-link"><img src="https://avatars.dicebear.com/api/human/' + users[i].username + '.svg" class="s-user-img" alt="User"/>' + users[i].username + '</div></a>'
                    }
                    $('#search-user').popover('dispose');
                    if(content === '') return;
                    $('#search-user').popover({
                        html: true,
                        placement: 'auto',
                        content: content,
                        title: 'Found users',
                        trigger: 'focus'
                    });
                    $('#search-user').popover('show');
                }
            }
        });
    }
    return (
        <Fragment>
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <div className="container">
                    <a className="navbar-brand navbar-right" href="/">
                        <img alt="Logo" src={'img/logo.svg'} />
                    </a>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <input type="text" onFocus={SearchUsers} onInput={SearchUsers} className="wg-input" placeholder="Search user..." id="search-user"/>
                        </li>
                    </ul>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul className="navbar-nav ml-auto">
                            {
                                user
                                    ? (
                                        <Fragment>
                                            <li className="nav-item">
                                                <img alt="User" src={'https://avatars.dicebear.com/api/human/' + user.username + '.svg'} />
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href={user ? '/' + user.username : '/login'}>
                                                    {user ? user.username : 'guest'}
                                                </a>
                                            </li>
                                        </Fragment>
                                    )
                                    : null
                            }
                            <li className="nav-item">
                                <a className="nav-link" href="/login">{user 
                                    ? (<Fragment><i className="fa fa-sign-out"></i></Fragment>)
                                    : (<Fragment>Log in <i className="fa fa-sign-in"></i></Fragment>)    
                                }</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div style={{height: '40px'}}></div>
        </Fragment>
    )
}
