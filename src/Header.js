import React, { Fragment, useEffect, useState } from 'react'
import './css/Header.css'

export default function Header() {
    const [user, setUser] = useState(0);
    useEffect(() => {
        const $ = window.$;
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
    return (
        <Fragment>
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <div className="container">
                    <a className="navbar-brand navbar-right" href="/">
                        <img alt="Logo" src={'img/logo.svg'} />
                    </a>
                    {
                        user && user.role === "admin"
                        ? (
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" href="/admin"><i className="fa fa-cog"></i></a>
                                </li>
                            </ul>
                        )
                        : null
                    }
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
