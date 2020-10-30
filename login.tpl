% rebase('base.tpl', title='Login')
<div id="content">
    <h1 class="logofont"><img src="/static/logo.svg" class="logo"> koyu.space Chat</h1>
    <small><i class="fa fa-lightbulb-o" aria-hidden="true"></i> Use your koyu.space credentials to login.</small>
    <div id="login">
        <p><input type="email" id="username" placeholder="E-mail"></p>
        <p><input type="password" id="password" placeholder="Password"></p>
        <p><input type="hidden" value="koyu.space" id="instance" placeholder="Server"></p>
        <button class="btn btn-primary btn-lg" id="kslogin">Login</button>
    </div>
</div>