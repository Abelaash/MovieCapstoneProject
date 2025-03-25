// CapstoneProject/api/recommend.js

export const getRecommendations = async (likedIds) => {
    const response = await fetch("http://localhost:8000/api/recommend/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ liked_ids: likedIds }),
    });
  
    const data = await response.json();
    return data.recommendations;
  };
  
  