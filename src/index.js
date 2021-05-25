import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)

window.vars = {
  host: "https://webgram-api.herokuapp.com/",
  //host: "http://127.0.0.1:3001/",
}
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
const $ = window.$;
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  $(document).on('click', '.copy', function(){
    let el = $(this)
    navigator.clipboard.writeText(el.text());
    el.addClass('bg-success');
    setTimeout(function(){
      el.removeClass('bg-success');
    }, 600);
  });
  $(document).on('click', '.tag-autocomplete-item', function(){
    var ev = new Event('input', { bubbles: true});
    ev.simulated = true;
    $('#post-tag').get(0).value = $(this).find('.data').text() + ' ';
    if($('#post-tag').get(0).hasAttribute('focus-return')){
      $('#post-tag').get(0).dispatchEvent(ev);
      $('#post-tag').focus();
    }
  });
});

reportWebVitals();
