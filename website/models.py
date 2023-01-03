from . import db

class DBModel(db.Model):
 id = db.Column(db.Integer,primary_key=True)
 name = db.Column(db.String(75),unique=True)
 

 
