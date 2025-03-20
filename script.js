const imageWrapper = document.querySelector(".images");
const searchInput = document.querySelector(".search input");
const loadMoreBtn = document.querySelector(".gallery .load-more");
const toggleBtns = document.querySelectorAll(".toggle-btn");
const lightbox = document.querySelector(".lightbox");
const downloadImgBtn = lightbox.querySelector(".uil-import");
const closeImgBtn = lightbox.querySelector(".close-icon");

// API Configuration
const apiKey = "oWHkoImMtm8OPlfqJ9KXff2lL5coaofpkZunkcksO1NPCFrVqk54VUCv";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;
let currentType = "images"; // Default type

// Function to fetch & display images
const getImages = (apiURL) => {
    searchInput.blur();
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");

    fetch(apiURL, { headers: { Authorization: apiKey } })
        .then(res => res.json())
        .then(data => {
            imageWrapper.innerHTML += data.photos.map(img =>
                `<li class="card">
                    <img onclick="showLightbox('${img.photographer}', '${img.src.large2x}')" src="${img.src.large2x}" alt="img">
                    <div class="details">
                        <div class="photographer">
                            <i class="uil uil-camera"></i>
                            <span>${img.photographer}</span>
                        </div>
                        <button onclick="downloadImg('${img.src.large2x}');">
                            <i class="uil uil-import"></i>
                        </button>
                    </div>
                </li>`
            ).join("");

            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.remove("disabled");
        })
        .catch(() => alert("Failed to load images!"));
};

// Function to fetch & display videos
const getVideos = (apiURL) => {
    searchInput.blur();
    loadMoreBtn.innerText = "Loading...";
    loadMoreBtn.classList.add("disabled");

    fetch(apiURL, { headers: { Authorization: apiKey } })
        .then(res => res.json())
        .then(data => {
            imageWrapper.innerHTML += data.videos.map(video =>
                `<li class="card">
                    <video controls>
                        <source src="${video.video_files[0].link}" type="video/mp4">
                        Your browser does not support videos.
                    </video>
                    <div class="details">
                        <div class="photographer">
                            <i class="uil uil-camera"></i>
                            <span>${video.user.name || 'Unknown'}</span>
                        </div>
                        <button onclick="downloadVideo('${video.video_files[0].link}');">
                            <i class="uil uil-import"></i> <!-- Download icon -->
                        </button>
                    </div>
                </li>`
            ).join("");


            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.remove("disabled");
        })
        .catch(() => alert("Failed to load videos!"));
};

// Handle Load More
const loadMore = () => {
    currentPage++;
    let apiUrl = currentType === "images"
        ? `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
        : `https://api.pexels.com/videos/popular?page=${currentPage}&per_page=${perPage}`;

    if (searchTerm) {
        apiUrl = currentType === "images"
            ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
            : `https://api.pexels.com/videos/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`;
    }

    currentType === "images" ? getImages(apiUrl) : getVideos(apiUrl);
};

// Handle Search
const searchContent = (e) => {
    if (e.target.value === "") return searchTerm = null;
    if (e.key === "Enter") {
        currentPage = 1;
        searchTerm = e.target.value;
        imageWrapper.innerHTML = "";

        let apiUrl = currentType === "images"
            ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=1&per_page=${perPage}`
            : `https://api.pexels.com/videos/search?query=${searchTerm}&page=1&per_page=${perPage}`;

        currentType === "images" ? getImages(apiUrl) : getVideos(apiUrl);
    }
};

// Toggle Between Images & Videos
toggleBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        currentType = e.target.dataset.type;
        imageWrapper.innerHTML = "";
        currentPage = 1;
        searchTerm = null;
        searchInput.value = "";

        toggleBtns.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");

        let apiUrl = currentType === "images"
            ? `https://api.pexels.com/v1/curated?page=1&per_page=${perPage}`
            : `https://api.pexels.com/videos/popular?page=1&per_page=${perPage}`;

        currentType === "images" ? getImages(apiUrl) : getVideos(apiUrl);
    });
});

// Initial Load
getImages(`https://api.pexels.com/v1/curated?page=1&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMore);
searchInput.addEventListener("keyup", searchContent);

const downloadVideo = (videoUrl) => {
    fetch(videoUrl)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "downloaded-video.mp4"; // Default filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(() => alert("Failed to download the video!"));
};

const downloadImg = (imgUrl) => {
    fetch(imgUrl)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "downloaded-image.jpg"; // Default file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(() => alert("Failed to download the image!"));
};
