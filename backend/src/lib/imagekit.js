import ImageKit, {toFile} from "@imagekit/nodejs";

const imagekit=new ImageKit({privateKey:process.env.IMAGEKIT_PRIVATE_KEY});

// hasImageKitConfig method check if (process.env.IMAGEKIT_PRIVATE_KEY) value is provided
function hasImageKitConfig(){
    return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
}


// OriginalName= "My Photo(1).png"
// result => "Chat-17022026-My_Photo__(1)_.png"
// this helper makes a safe, unique filename for uploaded files
function createFileName(originalName="upload") {
    const safeName=originalName.replace(/[a-zA-Z0-9._-]/g,"_");
    return `chat-${Date.now()}-${safeName}`;
}


/**
 * Upload image or video to ImageKit(documentation)
 * @see https://imagekit.io/docs/api-reference/upload-file/upload-file
 */
async function uploadChatMedia(file){
    const fileName=createFileName(file.originalName);

    const result=await imagekit.files.upload({
        file: await toFile(file.buffer, fileName, { type: file.mimetype }),
        fileName,
        folder:"/chat"
    });

    return result.url;
}


export {hasImageKitConfig, uploadChatMedia};
