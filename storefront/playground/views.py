from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
# it is a request handler that returns a simple HttpResponse
# this will allow us to send emails call data from the database and transform it into HTML
def say_hello(request):
    return HttpResponse("hello, world")
