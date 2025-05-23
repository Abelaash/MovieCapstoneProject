# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Users(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    day = models.IntegerField(blank=True, null=True)
    month = models.CharField(max_length=20, blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=14)
    username = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'users'


class Watchlist(models.Model):
    watchlist_id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    movie_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'watchlist'
