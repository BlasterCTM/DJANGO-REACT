# MainApi/views.py

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Todo
from .serializer import TodoSerializer

# Lista y crea nuevas tareas
class TodoListCreateView(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        titulo = self.request.query_params.get('titulo', None)
        if titulo:
            queryset = queryset.filter(titulo__icontains=titulo)
        return queryset

# Obtiene, actualiza y elimina una tarea específica
class TodoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

# Lista las tareas publicadas
@api_view(['GET'])
def todo_list_published(request):
    todos = Todo.objects.filter(hecho=True)
    todo_serializer = TodoSerializer(todos, many=True)
    return Response(todo_serializer.data)

@api_view(['POST'])
def todo_create(request):
    todo_serializer = TodoSerializer(data=request.data)
    if todo_serializer.is_valid():
        todo_serializer.save()
        return Response(todo_serializer.data, status=status.HTTP_201_CREATED)
    return Response(todo_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# views.py
@api_view(['PUT'])
def todo_update(request, pk):
    try:
        todo = Todo.objects.get(pk=pk)
    except Todo.DoesNotExist:
        return Response({'message': 'La tarea no existe'}, status=status.HTTP_404_NOT_FOUND)

    print('Request data:', request.data)  
    todo_serializer = TodoSerializer(todo, data=request.data)
    if todo_serializer.is_valid():
        todo_serializer.save()
        return Response(todo_serializer.data)
    else:
        print('Serializer errors:', todo_serializer.errors)  
        return Response(todo_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def todo_delete(request, pk):
    try:
        todo = Todo.objects.get(pk=pk)
    except Todo.DoesNotExist:
        return Response({'message': 'La tarea no existe'}, status=status.HTTP_404_NOT_FOUND)

    todo.delete()
    return Response({'message': 'La tarea fue eliminada exitosamente!'}, status=status.HTTP_204_NO_CONTENT)
