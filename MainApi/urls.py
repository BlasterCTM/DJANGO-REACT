from django.urls import path
from .views import (
    TodoListCreateView, TodoDetailView, todo_list_published,
    todo_create, todo_update, todo_delete
)

urlpatterns = [
    path('todos/', TodoListCreateView.as_view(), name='todo-list'),
    path('todos/<int:pk>/', TodoDetailView.as_view(), name='todo-detail'),
    path('todos/published/', todo_list_published, name='todo-list-published'),
    path('todos/create/', todo_create, name='todo-create'),
    path('todos/update/<int:pk>/', todo_update, name='todo-update'),
    path('todos/delete/<int:pk>/', todo_delete, name='todo-delete'),
]
