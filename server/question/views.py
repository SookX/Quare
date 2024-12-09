from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
import io
import sys
import os
from reportlab.pdfgen import canvas
from groq import Groq
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import io

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from AI_Models.STSC import utils
from Alek.webscrape import scrape_google_maps

classes = utils.load_classes().squeeze()
model, embeddings = utils.load_weights_and_embeddings(classes)

def get_specialist(api_key, disease):
    client = Groq(api_key=api_key)

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Which type of doctor treats {disease}? Respond with just the name of the specialist. (Always the same answer)"
            }
        ],
        model="llama3-8b-8192",  
    )

    return chat_completion.choices[0].message.content





def create_pdf(data):
    buffer = io.BytesIO()
    pdf = SimpleDocTemplate(buffer, pagesize=letter)

    styles = getSampleStyleSheet()

    subtitle_style = ParagraphStyle(
        name='Subtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=14,
        alignment=1,  
        spaceAfter=12
    )

    header_style = ParagraphStyle(
        name='Header',
        parent=styles['Heading4'],
        fontName='Helvetica-Bold',
        fontSize=12,
        alignment=1,
        spaceAfter=6,
        textColor=colors.whitesmoke,
    )

    row_style = ParagraphStyle(
        name='Row',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        alignment=1,
        spaceAfter=6,
        textColor=colors.black,
    )

    story = []

    story.append(Paragraph(f"Specialist Recommendations for {data['disease']}", styles['Title']))
    story.append(Paragraph("Prepared by Quare.AI", subtitle_style))
    story.append(Spacer(1, 20))

    story.append(Paragraph(f"Disease: {data['disease']}", row_style))
    story.append(Paragraph(f"Specialist: {data['specialist']}", row_style))
    story.append(Spacer(1, 20))

    for specialist in data['list_of_specialist']:
        story.append(Spacer(1, 10))  
        
        story.append(Paragraph(f"<b>Name:</b> {specialist.get('name', '')}", row_style))
        story.append(Paragraph(f"<b>Rating:</b> {specialist.get('rating', '')}", row_style))
        story.append(Paragraph(f"<b>Reviews:</b> {specialist.get('reviews_count', '')}", row_style))
        story.append(Paragraph(f"<b>Address:</b> {specialist.get('address', '')}", row_style))
        story.append(Paragraph(f"<b>Contact:</b> {specialist.get('contact', '')}", row_style))
        
        website_label = f"<link href='{specialist.get('website', '')}'>Visit Website</link>"
        story.append(Paragraph(f"<b>Website:</b> {website_label}", row_style))

    story.append(Spacer(1, 50))
    story.append(Paragraph("Generated using Quare.AI", row_style))

    pdf.build(story)
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
            location = str(request.data.get('location'))
            if not question_list:
                return Response({"error": "No questions provided"}, status=status.HTTP_400_BAD_REQUEST)

            text = ' '.join(question_list)
            word = utils.predict(text, model, classes, embeddings)
            
            specialist = get_specialist(api_key=os.getenv('GROQ_API'), disease=word)
            
            sc_response = scrape_google_maps(specialist, location)
            print(sc_response)

            return Response({"message": "Questions processed successfully!", "data": sc_response, 'specialist': specialist, 'disease': word})   
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
@api_view(['POST'])
def send_pdf(request):
    """
    Handles POST requests, and sends it to the frontend.
    """
    
    if request.method == 'POST':
        disease = str(request.data.get("disease"))
        specialist = str(request.data.get('specialist'))
        list_of_specialists = list(request.data.get('list_of_specialists'))

        data = {
            'disease': disease,
            'specialist': specialist,
            'list_of_specialist': list_of_specialists

        }
        
        pdf_buffer = create_pdf(data)

        response = HttpResponse(pdf_buffer, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="generated.pdf"'
        return response