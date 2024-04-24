// Set your API key
const API_KEY = "";

// Function to fetch channel information
async function getChannelInfo(channelName) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${channelName}&type=channel&key=${API_KEY}`
    );
    const data = await response.json();

    console.log("API Response:", data); // Log the API response

    if (data.items && data.items.length > 0) {
      const channelId = data.items[0].snippet.channelId;
      const channelTitle = data.items[0].snippet.channelTitle;
      const channelThumbnail = data.items[0].snippet.thumbnails.default.url;
      const subscriberCount = await getSubscriberCount(channelId);
      return { channelTitle, channelThumbnail, subscriberCount };
    } else {
      return "Channel not found.";
    }
  } catch (error) {
    console.error("Error fetching channel data:", error);
    return "Error fetching channel data.";
  }
}

// Function to fetch subscriber count
async function getSubscriberCount(channelId) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`
    );
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      return data.items[0].statistics.subscriberCount;
    } else {
      return "Subscriber count not available.";
    }
  } catch (error) {
    console.error("Error fetching subscriber count:", error);
    return "Error fetching subscriber count.";
  }
}

// Function to render channel information
function renderChannelInfo(channelInfo) {
  const container = document.getElementById("container");
  container.innerHTML = `
            <img src="${channelInfo.channelThumbnail}" alt="Channel Thumbnail">
            <div>Username: ${channelInfo.channelTitle}</div>
            <div>Subscriber Count: ${channelInfo.subscriberCount}</div>
        </div>
    `;
}

// Event listener for search input
document
  .getElementById("channelSearch")
  .addEventListener("input", async function () {
    const searchTerm = this.value.trim();
    if (searchTerm !== "") {
      const channelInfo = await getChannelInfo(searchTerm);
      renderChannelInfo(channelInfo);
    } else {
      document.getElementById("container").innerHTML = ""; // Clear container if search term is empty
    }
  });
