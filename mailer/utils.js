const blobToBase64 = async (blob) => {
    let buffer = Buffer.from(await blob.text());
    return "data:" + blob.type + ";base64," + buffer.toString("base64");
};

module.exports = { blobToBase64 };
