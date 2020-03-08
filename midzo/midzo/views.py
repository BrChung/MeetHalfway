import sys

#Django
from django.shortcuts import render, redirect
from django.contrib import auth
from django.http import HttpResponse

#Django Forms
from .forms import LoginForm, SignUpForm

#Pyrebase https://github.com/thisbejim/Pyrebase
import pyrebase

#Google Maps https://github.com/googlemaps/google-maps-services-python
#https://developers.google.com/maps/documentation/geocoding/start
import googlemaps
from datetime import datetime

#JSON
import json

#Geohash 2 https://github.com/dbarthe/geohash/
# https://www.movable-type.co.uk/scripts/geohash.html
import geohash2

try:
    with open ('pyrebase_config.json') as json_file:
        pyrebase_config = json.load(json_file)

    with open('googlemaps_config.json') as json_file:
        googlemaps_config = json.load(json_file)
except:
    sys.exit("Error! Configuration files not found!")

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
    # return render(request, "midzo/index.html")
    return render(request, "midzo/home.html")

def login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            try:
                user = firebase_auth.sign_in_with_email_and_password(email, password)
            except:
                message = "The email address or password you entered is incorrect."
                return render(request,"midzo/login.html",{"messg":message, 'form': form})
            session_id = user['idToken']
            request.session['idToken'] = str(session_id)
            return render(request, "midzo/home.html",{"e":email})
    else:
        form = LoginForm()

    return render(request, "midzo/login.html", {'form': form})

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            firstName = request.POST.get('firstName')
            lastName = request.POST.get('lastName')
            email = request.POST.get('email')
            password = request.POST.get('password')
            verifiedPassword = request.POST.get('verifiedPassword')
            message = None

            if(len(password) < 6):
                message = "Password must be at least 6 characters in length"
            elif(password != verifiedPassword):
                message = "Passwords do not match!"
            
            if message is None:
                try:
                    user = firebase_auth.create_user_with_email_and_password(email,password)
                    uid = user['localId']
                    data = {"firstName":firstName,"lastName":lastName,"status":"1"}
                    database.child("users").child(uid).set(data)
                except:
                    message = "Unable to create account try again"
                    return render(request,"midzo/signup.html",{"messg":message, 'form': form})
            else:
                return render(request,"midzo/signup.html",{"messg":message, 'form': form})

            return redirect('/login/')
    else:
        form = SignUpForm()
    return render(request,"midzo/signup.html", {'form': form})

def logout(request):
    try:
        del request.session['idToken']
    except:
        pass
    form = LoginForm()
    return render(request,'midzo/login.html', {'form': form})

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

    print(result)

    return render(request,"midzo/result.html",{"result":result,"API_KEY":googlemaps_API_key})


def inputDestination(request):
    try:
        idToken = request.session['idToken']
        tempUser = firebase_auth.get_account_info(idToken)
        localId = tempUser['users'][0]['localId']
        
        print(localId)
    except:
        return redirect('/login/')
