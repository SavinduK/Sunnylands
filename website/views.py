from flask import Blueprint,render_template,request,flash,redirect,url_for,jsonify
from . import db
from .models import DBModel
views = Blueprint("views",__name__)

@views.route("/play",methods=['GET','POST'])
def game():
    if request.method == "POST":
       pass   
    return render_template("index.html")

@views.route("/",methods=['GET','POST'])
def login():
    if request.method == "POST":
       pass   
    return render_template("home.html")

@views.route("/help",methods=['GET','POST'])
def help():
    if request.method == "POST":
       pass   
    return render_template("help.html")

@views.route("/shop",methods=['GET','POST'])
def shop():
    if request.method == "POST":
       pass   
    return render_template("shop.html")

@views.route("/speedrun",methods=['GET','POST'])
def speedrun():
    if request.method == "POST":
       pass   
    return render_template("speedrun.html")