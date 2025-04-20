import google.generativeai as genai
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Watchlist, User
from .serializers import WatchlistSerializer
from .recommender_engine import MovieRecommender
from datetime import date
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.db import IntegrityError
import json

@api_view(['POST'])
def add_to_watchlist(request):
    user_id = request.data.get("user_id")
    movie_id = request.data.get("movie_id")
    movie_title = request.data.get("movie_title")  
    poster_path = request.data.get("poster_path")
    media_type = request.data.get("media_type")  # New field added

    if not all([user_id, movie_id, movie_title, poster_path, media_type]):
        return Response({"error": "user_id, movie_id, movie_title, poster_path, and media_type are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the movie is already in the watchlist
    if Watchlist.objects.filter(user_id=user_id, movie_id=movie_id).exists():
        return Response({"message": "Movie is already in the watchlist"}, status=status.HTTP_200_OK)

    # Add to watchlist
    watchlist_entry = Watchlist.objects.create(
        user_id=user_id,
        movie_id=movie_id,
        movie_title=movie_title,
        poster_path=poster_path,
        media_type=media_type  # Save the media type in the database
    )

    serializer = WatchlistSerializer(watchlist_entry)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def watchlist(request, user_id):
    # Query the watchlist for the specific user
    watchlist_items = Watchlist.objects.filter(user_id=user_id)

    # Serialize the data
    serializer = WatchlistSerializer(watchlist_items, many=True)

    # Return the serialized data as a response
    return Response(serializer.data)



@api_view(['GET'])
def watchlist(request, user_id):
    # Query the watchlist for the specific user
    watchlist_items = Watchlist.objects.filter(user_id=user_id)

    # Serialize the data
    serializer = WatchlistSerializer(watchlist_items, many=True)

    # Return the serialized data as a response
    return Response(serializer.data)


# Instantiate recommender once globally
recommender = MovieRecommender(api_key="88b27e6ed4beb439aab05a195400d017")


# Here the backend receives the request, then gets the recommendations by calling the right methods
# after generating recommendations it sends the data back to the front end.  
@api_view(["POST"])
def recommend_movies_by_ids(request):
    liked_ids = request.data.get("liked_ids", [])
    if not liked_ids or len(liked_ids) < 5:
        return Response({"error": "Please provide at least 5 liked movie IDs."}, status=400)
    
    try:
        recommendations = recommender.recommend_for_ids(liked_ids)
        return Response({"recommendations": recommendations}) #JSON response sent to frontend
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def check_username_availability(request):
    username = request.query_params.get('username', '')

    if not username:
        return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

    is_taken = User.objects.filter(username=username).exists()
    return Response({'is_taken': is_taken})


@api_view(['POST'])
def register_user(request):
    try:
        data = request.data
        dob = date(int(data['year']), int(data['month']), int(data['day']))

        # Check if the username already exists
        if User.objects.filter(username=data['username']).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_409_CONFLICT)

        user = User.objects.create(
            first_name=data['firstName'],
            last_name=data.get('lastName', ''),
            date_of_birth=dob,
            country=data['country'],
            username=data['username'],
            password=make_password(data['password']),
            liked_movie_ids=json.dumps(data['likedMovieIds'])  
        )

        return Response({
            'message': 'User registered successfully',
            'user': {
                'user_id': user.user_id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'date_of_birth': str(user.date_of_birth),
                'country': user.country,
                'username': user.username,
                'liked_movie_ids': json.loads(user.liked_movie_ids)
            }
        }, status=status.HTTP_201_CREATED)

    except IntegrityError:
        return Response({'error': 'Username must be unique'}, status=status.HTTP_409_CONFLICT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def login_user(request):
    data = request.data
    username = data['username']
    password = data['password']

    try:
        user = User.objects.get(username=username)
        if check_password(password, user.password):
            return Response({
                'message': 'Login successful',
                'user': {
                    'user_id': user.user_id,
                    'liked_movie_ids': json.loads(user.liked_movie_ids)
                }
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=401)
    except User.DoesNotExist:
        return Response({'error': 'Username does not exist'}, status=404)


# AI chat bot functionality
genai.configure(api_key="AIzaSyDO0Tg6ZX7ij1S6bBzL6aGe2Zz5k4bbb3o")

chat_sessions = {}  # In-memory store (temp solution)

@api_view(["POST"])
def chat_with_gemini(request):
    message = request.data.get("message", "")
    session_id = request.data.get("user_id")  # This user id thing does not work

    if not message:
        return Response({"error": "No message provided."}, status=400)

    # System instructions (prompt engineering)
    system_prompt = (
        "You are PandaAI, a friendly and knowledgeable movie expert who works for Panda Picks — "
        "a non fictional/real movie recommendation app. Your job is to help users with anything related to movies and TV shows. "
        "Only answer questions that are related to movies, actors, directors, genres, plots, recommendations, "
        "or movie trivia. If the question is not related to movies, respond politely and inform them that you can "
        "only answer movie-related questions as part of your role at Panda Picks. Respond with the Panda Picks tone — helpful, modern, and fun."
    )

    if session_id not in chat_sessions:
        chat_sessions[session_id] = genai.GenerativeModel(model_name="gemini-1.5-flash", system_instruction=system_prompt).start_chat()

    chat = chat_sessions[session_id]

    try:
        response = chat.send_message(message)
        return Response({"reply": response.text})
    except Exception as e:
        return Response({"error": str(e)}, status=500)