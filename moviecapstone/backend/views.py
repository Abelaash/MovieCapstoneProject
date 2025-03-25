from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Watchlist
from .serializers import WatchlistSerializer
from .recommender_engine import MovieRecommender

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
recommender = MovieRecommender(api_key="your_tmdb_api_key")

@api_view(["POST"])
def recommend_movies_by_ids(request):
    liked_ids = request.data.get("liked_ids", [])
    if not liked_ids or len(liked_ids) < 5:
        return Response({"error": "Please provide at least 5 liked movie IDs."}, status=400)
    
    try:
        recommendations = recommender.recommend_for_ids(liked_ids)
        return Response({"recommendations": recommendations})
    except Exception as e:
        return Response({"error": str(e)}, status=500)