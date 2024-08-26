import { BlobServiceClient } from "@azure/storage-blob";
import axios from "axios";

const storageAccount = 'leaksandpipeskeyframes';
const containerName = 'key-frames';
const sasToken = 'sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-11-29T16:37:49Z&st=2024-08-13T08:37:49Z&sip=0.0.0.0-255.255.255.255&spr=https';
const blobServiceUrl = `https://${storageAccount}.blob.core.windows.net`;

const blobServiceClient = new BlobServiceClient(`${blobServiceUrl}?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function processImages() {
    let iter = containerClient.listBlobsFlat();
    for await (const blob of iter) {
        const imageUrl = `${blobServiceUrl}/${containerName}/${blob.name}`;
        try {
            const response = await axios({
                method: "POST",
                url: "https://detect.roboflow.com/ptdf_project_updated/1",
                params: {
                    api_key: "x0WvO7ZDLz4mx3oeqbRF",
                    image: imageUrl
                }
            });
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }
}

processImages();
