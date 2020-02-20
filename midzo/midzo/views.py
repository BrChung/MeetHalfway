#Django
from django.shortcuts import render
from django.contrib import auth
from django.http import HttpResponse

#Pyrebase
import pyrebase

#Google Maps
import googlemaps
from datetime import datetime

#JSON
import json

with open ('pyrebase_config.json') as json_file:
    pyrebase_config = json.load(json_file)

with open('googlemaps_config.json') as json_file:
    googlemaps_config = json.load(json_file)

googlemaps_API_key = googlemaps_config['apiKey']

firebase = pyrebase.initialize_app(pyrebase_config)
print("Firebase ... OK")
firebase_auth = firebase.auth()
print("Firebase Authentication ... OK")
database = firebase.database()
print("Firebase Database ... OK")
gmaps = googlemaps.Client(key=googlemaps_API_key)
print("Google Maps Integration ... OK")

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
    geocode_result1 = gmaps.geocode(location1)
    geocode_result2 = gmaps.geocode(location2)
    lat1 = geocode_result1[0]["geometry"]["location"]["lat"]
    lng1 = geocode_result1[0]["geometry"]["location"]["lng"]
    lat2 = geocode_result2[0]["geometry"]["location"]["lat"]
    lng2 = geocode_result2[0]["geometry"]["location"]["lng"]
    adrs1 = geocode_result1[0]["formatted_address"]
    adrs2 = geocode_result2[0]["formatted_address"]

    res_lat = (lat1 + lat2) / 2
    res_lng = (lng1 + lng2) / 2

    print("Address 1: " + adrs1 + "\nAddress 2: " + adrs2)

    result = str(res_lat) + ", " + str(res_lng)

    return render(request,"midzo/result.html",{"result":result})
