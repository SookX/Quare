from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def question(request):
    if request.method == 'POST':
        try:
            questions_list = request.data.get("body", [])
            if not questions_list:
                return Response({"error": "No questions provided"}, status=status.HTTP_400_BAD_REQUEST)

            questions_dict = {item['question']: item['answer'] for item in questions_list}

            #word = vasi_model_func(questions_dict)

            sc_response = ['asdadasdadsad']
            #sc_response = func2(word)

            return Response({"message": "Questions processed successfully!", "data": sc_response})   
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)