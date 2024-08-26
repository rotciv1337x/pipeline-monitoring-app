import axios from "axios";

axios({
    method: "POST",
    url: "https://detect.roboflow.com/ptdf_project_updated/1",
    params: {
        api_key: "x0WvO7ZDLz4mx3oeqbRF",
        image: "https://leaksandpipeskeyframes.blob.core.windows.net/key-frames/key-frames/2024/8/22/Pipeline_Sample_frame_108.jpg"
    }
})
.then(function(response) {
    console.log(response.data);
})
.catch(function(error) {
    console.log(error.message);
});
