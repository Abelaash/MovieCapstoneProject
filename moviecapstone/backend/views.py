from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Watchlist, User
from .serializers import WatchlistSerializer
from .recommender_engine import MovieRecommender
from datetime import date

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

@api_view(['POST'])
def register_user(request):
    try:
        data = request.data

        dob = date(int(data['year']), int(data['month']), int(data['day']))

        user = User.objects.create(
            first_name=data['firstName'],
            last_name=data.get('lastName', ''),
            date_of_birth=dob,
            country=data['country'],
            username=data['username'],
            password=data['password'],
            genre_id=data['genreId']
        )
        
        user_data = {
            'user_id': user.user_id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_of_birth': str(user.date_of_birth),
            'country': user.country,
            'username': user.username,
            'password': user.password,  
            'genre_id': user.genre_id
        }

        return Response(user_data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# @api_view(['POST'])
# def register_user(request):
#     try:
#         data = request.data

#         # Extract and validate form fields
#         dob = date(int(data['year']), int(data['month']), int(data['day']))

#         user = User.objects.create(
#             first_name=data['firstName'],
#             last_name=data.get('lastName', ''),
#             date_of_birth=dob,
#             country=data['country'],
#             username=data['username'],
#             password=data['password'],
#             genre_id=data['genreId']
#         )

#         return Response({'message': 'User registered successfully', 'user_id': user.user_id}, status=status.HTTP_201_CREATED)

#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)