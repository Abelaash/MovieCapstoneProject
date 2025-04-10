from django.db import models

class Watchlist(models.Model):
    # Defining the fields to match the existing columns
    watchlist_id = models.AutoField(primary_key=True)  # Auto incremented ID
    user_id = models.IntegerField()  # User ID, non-nullable
    movie_id = models.IntegerField() 
    movie_title = models.CharField(max_length=255)  # Movie title should be a CharField
    poster_path = models.CharField(max_length=255)
    media_type = models.CharField(max_length=255)

    # Meta class to specify the existing table name and prevent Django from managing it
    class Meta:
        db_table = 'watchlist'  # Table name as it exists in the database
        managed = False  # Tell Django not to create, delete, or modify the table


class User(models.Model):
    user_id = models.AutoField(primary_key=True)  
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150, blank=True, null=True)  
    date_of_birth = models.DateField()
    country = models.CharField(max_length=100)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    genre_id = models.IntegerField()

    class Meta:
        db_table = 'user'
        managed = True

    def __str__(self):
        return self.username