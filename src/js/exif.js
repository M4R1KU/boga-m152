import EXIF from'./lib/exif-lib';
let md5 = require('md5');

export class ExifStore {
    constructor() {
        this.store = {};
    }

    get(key) {
        if (this.store.hasOwnProperty(key)) {
            return this.store[key];
        }
        return null;
    }

    putIfAbsent(key, data) {
        if (this.store.hasOwnProperty(key)) {
            return this.store[key];
        }
        this.store[key] = data;
    }
}

let exifStore = new ExifStore();
const EXIF_MAPPING = [
    {
        displayName: 'Camera',
        icon: 'photo_camera',
        transform: function (imgData) {
            return `${EXIF.getTag(imgData, 'Make')} ${EXIF.getTag(imgData, 'Model')}`;
        }
    },
    {
        displayName: 'Focal Length',
        icon: 'switch_camera',
        transform: function (imgData) {
            return `${EXIF.getTag(imgData, 'FocalLength')} mm`;
        }
    },
    {
        displayName: 'Aperture',
        icon: 'camera',
        transform: function(imgData ) {
            let value = EXIF.getTag(imgData, 'ApertureValue');
            return `f/${Math.sqrt(Math.pow(2, value)).toPrecision(3)}`;
        }
    },
    {
        displayName: 'ISO',
        icon: 'brightness_6',
        tagName: 'ISOSpeedRatings'
    },
    {
        displayName: 'Exposure Program',
        icon: 'exposure',
        tagName: 'ExposureProgram'
    },
    {
        displayName: 'Shutter speed',
        icon: 'timer',
        transform: function (imgData) {
            let value = EXIF.getTag(imgData, 'ExposureTime');
            if (!value) {
                return '-';
            }
            if (value.numerator && value.denominator) {
                return `${value.numerator}/${value.denominator} s`;
            }
            return `${value} s`;
        }
    }
];

export function extractImageData(image, callback) {
    let cache = exifStore.get(md5(image.outerHTML));
    if (cache) {
        callback.call(null, cache);
        return true;
    }
    return EXIF.getData(image, function () {
        let output = EXIF_MAPPING
            .map(mapping => {
                let value = mapping.transform ? mapping.transform(this) : EXIF.getTag(this, mapping.tagName);
                return {
                    displayName: mapping.displayName,
                    icon: mapping.icon,
                    value: value
                }
            });
        exifStore.putIfAbsent(md5(image.outerHTML), output);
        callback.call(null, output);
    });
}