from django.db import models

# Create your models here.


class Todo(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion  = models.TextField(blank=True)
    hecho = models.BooleanField(default=False)


def __str__(self):
    return self.titulo
