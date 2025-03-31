// Here the frontend sends a post request

// We use the POST method to send data to the django server
export const getRecommendations = async (likedIds) => {
    const response = await fetch("http://localhost:8000/api/recommend/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ liked_ids: likedIds }), // send movie ids
    });
  
    const data = await response.json();
    return data.recommendations; //receive movie ids
  };
  
