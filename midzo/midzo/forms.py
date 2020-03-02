from django import forms

class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(max_length=128, min_length=6, widget=forms.PasswordInput)

class SignUpForm(forms.Form):
    firstName = forms.CharField(max_length=46)
    lastName = forms.CharField(max_length=46)
    email = forms.EmailField()
    password = forms.CharField(max_length=128, min_length=6, widget=forms.PasswordInput)
    verifiedPassword = forms.CharField(max_length=128, min_length=6, widget=forms.PasswordInput)