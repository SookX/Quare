from django.urls import path
from .views import question, send_pdf

urlpatterns = [
    path('question/', question , name = "question"),
    path('download/', send_pdf, name='send-pdf'),
]