import fs from "fs";
import path from "path";
import exifr from "exifr";

export class photoGeolocation {
    constructor(directory) {
        this.directory = directory
        this.outputPath = `${directory}locations.json`
    }
    #readFolder(){
        return new Promise((resolve, reject) => {
            fs.readdir(this.directory, (err, files) => {
                if (err) {
                    reject(`Error reading directory: ${err}`);
                    return;
                }

                if (files.length === 0) {
                    resolve([]);
                    return;
                }

                let processedFiles = 0;
                let locationJson = [];

                files.forEach(file => {
                    const filePath = path.join(this.directory, file);
                    fs.readFile(filePath, (err, data) => {
                        if (err) {
                            console.error(`Could not read file ${file}:`, err);
                            processedFiles++;
                            checkCompletion();
                            return;
                        }
                        const uint8ArrayData = new Uint8Array(data.buffer);
                        exifr.parse(uint8ArrayData)
                            .then(photo => {
                                if (photo && photo.latitude && photo.longitude) {
                                    locationJson.push({
                                        file: file,
                                        latitude: photo.latitude,
                                        longitude: photo.longitude
                                    });
                                } else {
                                    console.log(`No GPS data on ${file}`);
                                }
                            })
                            .catch(err => {
                                console.error(`Could not extract GPS data from ${file}, ${err}`);
                            })
                            .finally(() => {
                                processedFiles++;
                                checkCompletion();
                            });
                    });
                });

                const checkCompletion = () => {
                    if (processedFiles === files.length) {
                        resolve(locationJson);
                    }
                }
            });
        });
    }

    async returnData() {
        return await this.#readFolder();
    }
    toFile() {
        this.#readFolder().then(result=> {
            fs.writeFile(this.outputPath, JSON.stringify(result, null, 2), (err) => {
                if(err) {
                    console.error(`Error writing to location: ${err}`)
                }
            })
        }).catch(err=>console.log(`Unable to write to file: ${err}`))
    }
}