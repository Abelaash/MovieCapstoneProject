# recommender_engine.py

import requests
import time
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel



def fetch_movie_ids(api_key, max_pages=30):
    movie_ids = []
    url_base = "https://api.themoviedb.org/3/movie/popular"
    for page in range(1, max_pages + 1):
        url = f"{url_base}?api_key={api_key}&language=en-US&page={page}"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            movie_ids.extend([movie['id'] for movie in data['results']])
            time.sleep(0.3)  # Avoid rate limits
        else:
            break
    return movie_ids

def fetch_movie_details(movie_id, api_key):
    url_details = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={api_key}&language=en-US"
    response = requests.get(url_details)
    if response.status_code == 200:
        return response.json()
    return None


class MovieRecommender:
    def __init__(self, api_key, max_pages=5):
        self.api_key = api_key
        self.movie_data = self._build_movie_data(max_pages)
        self.tfidf_matrix, self.cosine_sim = self._build_similarity_matrix()

    def _build_movie_data(self, max_pages):
        movie_ids = fetch_movie_ids(self.api_key, max_pages)
        movie_data = []
        for movie_id in movie_ids:
            details = fetch_movie_details(movie_id, self.api_key)
            if details:
                movie_data.append({
                    "title": details.get("title", ""),
                    "overview": details.get("overview", "")
                })
        return pd.DataFrame(movie_data)

    def _build_similarity_matrix(self):
        tfidf = TfidfVectorizer(stop_words='english')
        self.movie_data['overview'] = self.movie_data['overview'].fillna('')
        tfidf_matrix = tfidf.fit_transform(self.movie_data['overview'])
        cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
        return tfidf_matrix, cosine_sim

    def recommend(self, title, top_n=5):
        indices = pd.Series(self.movie_data.index, index=self.movie_data['title']).drop_duplicates()
        if title not in indices:
            return []
        idx = indices[title]
        sim_scores = list(enumerate(self.cosine_sim[idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        sim_scores = sim_scores[1:top_n+1]
        movie_indices = [i[0] for i in sim_scores]
        return self.movie_data['title'].iloc[movie_indices].tolist()
