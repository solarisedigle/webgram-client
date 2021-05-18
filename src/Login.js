import React from 'react'
import './css/Login.css'

export default function Login() {
    const $ = window.$;
    localStorage.removeItem('jwt');
    function handlePasswordConfrirm(){
        let el = $('#password-confrirm');
        if(el.val() === $('#password').val()){
            el.addClass('success').removeClass('error');
        }
        else if(el.val() === ''){
            el.removeClass('error').removeClass('success');
        }
        else{
            el.addClass('error').removeClass('success');
        }
    }
    function handleLogin(){
        $('.wg-errors-p').hide();
        $('#activate-text').hide();
        $('.error').removeClass('error');
        $.ajax({
            url: window.vars.host + 'api/v1/login',
            method: 'POST',
            data: {username: $('#username').val(), password: $('#password').val()},
            beforeSend: function(){
                $('#signin').find('.spinner-border').css('display', 'inline-block');
                $('button, input').prop('disabled', true);
            },
            complete: function(data){
                switch(data.status){
                    case 200:
                        localStorage.setItem('jwt', JSON.parse(data.responseText).token);
                        window.location.href = '/';
                    break;
                    case 401:
                        $('#server-signin-error').text('Login failed. Please check your credentials.').show();
                        $('#username, #password').addClass('error').removeClass('success');
                    break;
                    case 403:
                        $('fieldset, #credentials').hide();
                        $('.tmp-login-text').html('Done');
                        $('#activation_token').text(JSON.parse(data.responseText).token);
                        $('#activate-text').show();
                    break;
                    default:
                        $('#server-signup-error').text('No response from server. Try again later.').show();
                    break;
                }
                $('#signin').find('.spinner-border').hide();
                $('button, input').prop('disabled', false);
            }
        });
    }
    function handleSignUp(){
        $('.wg-errors-p').hide();
        if($('#password-confrirm').val() !== $('#password').val()){
            $('#password-confrirm-error').show();
        }
        else{
            $.ajax({
                url: window.vars.host + 'api/v1/user',
                method: 'POST',
                data: {username: $('#username').val(), password: $('#password').val()},
                beforeSend: function(){
                    $('#signup').find('.spinner-border').css('display', 'inline-block');
                    $('button, input').prop('disabled', true);
                },
                complete: function(data){
                    switch(data.status){
                        case 200:
                            handleLogin();
                        break;
                        case 422:
                            let errors = JSON.parse(data.responseText).errors;
                            for (let error in errors) {
                                $('#' + error).addClass('error');
                                $('#' + error + '-erors').text(errors[error]).show();
                            }
                        break;
                        default:
                            console.log('smth')
                            $('#server-signup-error').text('No response from server. Try again later.').show();
                        break;
                    }
                    $('#signup').find('.spinner-border').hide();
                    $('button, input').prop('disabled', false);
                }
            });
        }
    }
    return (
        <div className="max-fluid">
            <div className="login-form">
                <a href="/"><img alt="Logo" src={'/img/logo_b.svg'}/></a>
                <div id="credentials">
                    <input type="text" placeholder="username" className="wg-input" id="username"/>
                    <p className="wg-errors-p" id="username-erors"></p>
                    <input onInput={handlePasswordConfrirm} type="password" placeholder="password" className="wg-input" id="password"/>
                    <p className="wg-errors-p" id="password-erors"></p>
                </div>
                <div id="activate-text">
                    <h5>Account activation</h5>
                    <p className="wg-p">1. Go to <a href="https://t.me/webgram_manager_bot" target="_blank" rel="noreferrer">@webgram_manager_bot</a></p>
                    <p className="wg-p">2. Send this token to bot (click to copy):</p>
                    <span className="copy" id="activation_token"></span>
                    <p className="wg-p">3. Click "Done"</p>
                </div>
                <button onClick={handleLogin} className="wg-button" id="signin"><span className="spinner-border spinner-border-sm"></span> <span className="tmp-login-text">Log in</span></button>
                <p className="wg-errors-p" id="server-signin-error"></p>
                <fieldset>
                    <legend>or</legend>
                    <input onInput={handlePasswordConfrirm} type="password" placeholder="confrirm password" className="wg-input" id="password-confrirm"/>
                    <p className="wg-errors-p" id="password-confrirm-error">Passwords do not match.</p>
                    <button onClick={handleSignUp} className="wg-button" id="signup"><span className="spinner-border spinner-border-sm"></span> Sign up</button>
                    <p className="wg-errors-p" id="server-signup-error"></p>
                </fieldset>
            </div>
        </div>
    )
}
