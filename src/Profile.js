import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Header from './Header.js'
import Code404 from './Code404.js'
import './css/Profile.css'
import UserButton from './parts/UserButton.js'
import Posts from './Posts.js'
import PostForm from './parts/PostForm.js'

export default function Profile() {
    let { username } = useParams();
    const [profile, setProfile] = useState(0);
    const [mounted, setMounted] = useState(0);
    useEffect(() => {
        const $ = window.$;
        $.ajax({
            url: window.vars.host + 'api/v1/user/profile/' + username,
            method: 'GET',
            async: false,
            headers: localStorage.getItem('jwt') ? {
                "Authorization": localStorage.getItem('jwt')
            } : null,
            complete: function(data){
                if (data.status === 200) setProfile(JSON.parse(data.responseText));
                setMounted(true);
            }
        });
    }, [username]);
    if(profile){
        return (
            <Fragment>
                <Header />
                <div className="container">
                    <div className="wg-block profile-heading row">
                        <div className="col-md-4">
                            <img className="user-pic" alt="User" src={'https://avatars.dicebear.com/api/human/' + profile.user.username + '.svg'} />
                        </div>
                        <div className="col-md-8 row minirow user-stat">
                            <h3 className="col-md-12 username">{profile.user.username}</h3>
                            <div className="col-md-3">
                                <h4 className="wg-p">{profile.posts}</h4>
                                <p className="wg-p">posts</p>
                            </div>
                            <div className="col-md-3">
                                <h4 className="wg-p">{profile.likes}</h4>
                                <p className="wg-p">likes</p>
                            </div>
                            <div className="col-md-3">
                                <h4 className="wg-p">{profile.subscribers}</h4>
                                <p className="wg-p">followers</p>
                            </div>
                            <div className="col-md-3">
                                <h4 className="wg-p">{profile.subscriptions}</h4>
                                <p className="wg-p">follows</p>
                            </div>
                            <span className="col-md-6">
                                <UserButton user={profile.user}/>
                            </span>
                        </div>
                    </div>
                    {
                        profile.self
                        ? <PostForm />
                        : null
                    }
                    <Posts user={profile.user.id}/>
                </div>
            </Fragment>
        );
    }
    else if(mounted){
        return (<Code404 obj="Profile" name={username}/>);
    }
    else return (<div></div>);
}
