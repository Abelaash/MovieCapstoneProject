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

