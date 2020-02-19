from django.shortcuts import render
import pyrebase
from django.contrib import auth

from django.http import HttpResponse

pyrebase_config = {
    'apiKey': "AIzaSyAzpWhi5kKgkhRpsatwzhbIGLPwutbDe1Q",
    'authDomain': "project-midzo.firebaseapp.com",
    'databaseURL': "https://project-midzo.firebaseio.com",
    'projectId': "project-midzo",
    'storageBucket': "project-midzo.appspot.com",
    'messagingSenderId': "1051773897258",
    'appId': "1:1051773897258:web:12c4d4e4cb00496051d153",
    'measurementId': "G-B8NLQ2HPFF"
}

firebase = pyrebase.initialize_app(pyrebase_config)
print("Firebase ... OK")
firebase_auth = firebase.auth()
print("Firebase Authentication ... OK")
database = firebase.database()
print("Firebase Database ... OK")

def home(request):
    return HttpResponse("Hello, world.")

def login(request):
    return render(request, "midzo/login.html")

def postlogin(request):
    email = request.POST.get('email')
    password = request.POST.get("pass")
    try:
        user = firebase_auth.sign_in_with_email_and_password(email,password)
    except:
        message = "The email address or password you entered is incorrect."
        return render(request,"midzo/login.html",{"messg":message})
    session_id = user['idToken']
    request.session['uid'] = str(session_id)
    return render(request, "midzo/welcome.html",{"e":email})

def logout(request):
    auth.logout(request)
    return render(request,'midzo/login.html')

def signup(request):
    return render(request,"midzo/signup.html")

def postsignup(request):

    firstname = request.POST.get('fname')
    lastname = request.POST.get('lname')
    email = request.POST.get('email')
    password = request.POST.get('pass')
    message = None

    if(len(password) < 6):
        message = "Password must be at least 6 characters in length"

    try:
        user = firebase_auth.create_user_with_email_and_password(email,password)
        uid = user['localId']
        data = {"firstname":firstname,"lastname":lastname,"status":"1"}
        database.child("users").child(uid).set(data)
    except:
        if message is None:
            message = "Unable to create account try again"
        return render(request,"midzo/signup.html",{"messg":message})

    return render(request,"midzo/login.html")

def results(request):
    location1 = request.POST.get('loc1')
    location2 = request.POST.get('loc2')
    print(location1)
    print(location2)
    result = "hi"

    return render(request,"midzo/result.html",{"result":result})
