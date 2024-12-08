from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
import io
from reportlab.pdfgen import canvas


def create_pdf():
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)
    p.drawString(100, 750, "This PDF!")
    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer


@api_view(['POST'])
def question(request):
    
    """
    Handles POST requests to process a list of questions and their respective answers.

    This endpoint expects a JSON payload with a "body" key containing a list of question-answer pairs.
    It processes these pairs, performs required operations, and returns a response indicating 
    successful processing along with any additional data (if applicable).
    """
    
    if request.method == 'POST':
        try:
            question_list = request.data.get("question_list")
            if not question_list:
                return Response({"error": "No questions provided"}, status=status.HTTP_400_BAD_REQUEST)

            #word = vasi_model_func(question_list)

            sc_response = ['asdadasdadsad']
            #sc_response = func2(word)

            return Response({"message": "Questions processed successfully!", "data": sc_response})   
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['GET'])
def send_pdf(request):
    """
    Handles GET requests, and sends it to the frontend.
    """
    
    if request.method == 'GET':
        pdf_buffer = create_pdf()

        response = HttpResponse(pdf_buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="generated.pdf"'
        return response