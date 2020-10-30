#!/usr/bin/python3

from bottle import get, post, request, response, route, run, redirect, BaseRequest, template, static_file
from mastodon import Mastodon
import redis
import uuid
import json
import os

r = redis.StrictRedis(host='localhost', port=6379, db=0)
BaseRequest.MEMFILE_MAX = 999999999

debug = False

@get("/")
def index():
    return template("login")

@get("/favicon.ico")
def favicon():
    return static_file("favicon.ico", "static/")

@route('/static/<filename>')
def callback(filename):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return static_file(filename, "static/")

@get("/chat")
def chat():
    return template("index")

@post("/api/v1/login")
def login():
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.content_type = "application/json"
    username = request.forms.get("username") # pylint: disable=no-member
    password = request.forms.get("password") # pylint: disable=no-member
    instance = request.forms.get("instance") # pylint: disable=no-member
    if debug:
        appname = "koyu.space Chat (debug)"
    else:
        appname = "koyu.space Chat"
    if not os.path.exists('clientcred.'+instance+'.secret'):
        Mastodon.create_app(
            appname,
            api_base_url = 'https://'+instance,
            to_file = 'clientcred.'+instance+'.secret'
        )
    mastodon = Mastodon(
        client_id = 'clientcred.'+instance+'.secret',
        api_base_url = 'https://'+instance
    )
    mastodon.log_in(
        username,
        password,
        to_file = 'authtokens/'+username+'.'+instance+'.secret',
    )
    if not os.path.exists("usercred.secret"):
        suid = str(uuid.uuid1())
        if r.get("koyuspace-chat/uuids/" + username + "$$" + instance) == None:
            r.set("koyuspace-chat/uuids/" + username + "$$" + instance, suid)
        else:
            r.set("koyuspace-chat/uuids/" + username + "$$" + instance, str(r.get("koyuspace-chat/uuids/" + username + "$$" + instance)).replace("b'", "").replace("'", "") + "," + suid)
        return json.dumps({"login": "ok", "uuid": suid})
    else:
        return "{\"login\": \"error\"}"

@get("/api/v1/login2/<username>/<uuid>/<instance>")
def login2(username, uuid, instance):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.content_type = "application/json"
    suid = str(r.get("koyuspace-chat/uuids/" + username + "$$" + instance)).replace("b'", "").replace("'", "")
    try:
        mastodon = Mastodon(
            access_token = 'authtokens/'+username+'.'+instance+'.secret',
            api_base_url = 'https://'+instance
        )
        mastodon.account_verify_credentials().source.note
    except:
        pass
    if uuid in suid:
        return json.dumps({"login": "ok", "uuid": uuid})
    else:
        return "{\"login\": \"error\"}"

run(port=8189, server="tornado")