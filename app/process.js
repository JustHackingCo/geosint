const fs = require('fs');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const fetch = require('node-fetch');
const chokidar = require('chokidar');

const api_key = process.env.MAPS_API_KEY;
const schema = require('./schema.json');

async function processYamlFile() {
    try {
        const yamlData = fs.readFileSync('challenges.yml', 'utf8');
        const jsonData = yaml.load(yamlData);

        const ajv = new Ajv();
        const validate = ajv.compile(schema);

        const isValid = validate(jsonData);
        
        if (isValid) {
            console.log('YAML data has been validated.');
            const fullData = await gather_chall_info(jsonData);
            const jsonContent = JSON.stringify(fullData, null, 2);
            fs.writeFileSync('challs.json', jsonContent, 'utf8');
            console.log('Challenge json has been written.');
        } else {
            console.error('YAML data is not valid according to the schema.');
            console.error(validate.errors);
        }
    } catch (error) {
        console.error('Error reading or parsing YAML file:', error);
    }
}


async function gather_chall_info(jsonData) {
    const data = {};
    for (const [comp, challs] of Object.entries(jsonData)) {
        data[comp] = {};
        for (const [name, properties] of Object.entries(challs)) {
            data[comp][name] = properties;
            if (properties.pano === null) {
                console.log(`retrieving pano_id for ${name}`);
                url = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${properties.lat},${properties.lng}&key=${api_key}`;
                let resp = await fetch(url);
                if (resp.ok) {
                    let resp_data = await resp.json();
                    let pano_id = resp_data['pano_id'];
                    data[comp][name]['pano'] = pano_id;
                    console.log(`retrieved pano_id ${pano_id} for ${name}`);
                }
            }
        }
    }
    return data;
}

function watchYamlFile() {
    const watcher = chokidar.watch('challenges.yml');
    watcher.on('change', (path) => {
        console.log(`File ${path} has been modified. Processing...`);
        processYamlFile(); 
    });
}

if (process.argv[2] === 'continuous') {
    watchYamlFile(); 
    console.log('Continuous mode is enabled. Watching for changes...');
} else {
    processYamlFile(); 
    console.log('Processing yaml file.');
}