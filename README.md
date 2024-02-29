# Telicent Ontology App
The main purpose of the Telicent Ontology App is to visualise & extend (IES) ontology and to build diagrams and generate RDF.

The Ontology app has two main views: Ontology View and Instance View. In the Ontology View, users can add extensions to the (IES) ontology, view existing diagrams of classes and object properties (relationships), and save extensions to the triple store. Once development is complete, the new extensions, added by the user becomes usable across the complete suite of Telicent Apps, as well as the Ontology App Instance view.  

In Instance View, users can create specific diagrams, which automatically generates corresponding RDF in the built-in IDE. Users can also type/paste RDF to generate diagrams, serving as a tool for validation and visualisation.

## Prerequisites
- **[OpenJDK](https://knasmueller.net/how-to-install-java-openjdk-17-on-macos-big-sur)**
- **Kraft Kafka** - Download and install the latest binary from [Apache Kafka](https://kafka.apache.org/quickstart).

## Installation

### Get up and running
```yaml
version "3.8"

services:
  ontology-app:
    build:
      context: .
    environment:
      - FONTAWESOME_TOKEN: <add_fa_token_here>
      - ONTOLOGY_SERVICE_URL: <triple_store_url>

```
1. Ensure your triple store is running with an 'ontology' topic created.

2. Create .env file and copy contents from .env.local (This step can be skipped
   if you already have a .env file)

```
touch .env && cp .env.local .env
```

3. Install dependencies

```
yarn install
```

4. Start application

```
yarn start
```

## Developer Notes

### Making a commit

If you are creating a commit using the GitHub CLI, Commitizen will ask a number
of questions to help you create a commit message. If you wish to
create your own commit message, you can skip this step and write your own.
Commitlint will however run to check that your commit message is
written in the format Commitizen expects. It is important to create meaningful
commit messages, as this is what will be included in the changelog to help keep
track of versioning.

Before you push to origin tests will be run automatically to
ensure you have not committed any breaking changes. This is to encourage us to
ensure the tests reflect current functionality. 

### Environment variables

At the root of the project you will find two .env.\* files. Both files contain
the required environment variables needed for the application to run.

- `.env.default` file is often used while packaging the application for
  deployment. Therefore, the variables in this file should be left empty.

- `.env.local` file is often used for local development and can be used to
  create your `.env` file.

`.env` is your local copy of the `.env.local` file and should not be committed.
When running the application for the first time, you will need to create this
file (Step 1 in [Getting Started](#get-up-and-running) section above).

In the package.json you will find a prestart script which runs `env.sh` script. This
script requires the `.env` file. The script will generate `env-config.js` files
in the root of the project and in the public directory for the `index.html` to
use. These files should also not be committed.

#### Variables list (as of 29 Feb 2024)


- **FONTAWESOME_TOKEN** (string) - Token provided by FontAwesome
<br />Optional
- **ONTOLOGY_SERVICE-URL** (string) - API endpoint
- **BETA** (boolean) - If set to true, the application is in its beta stage
  <br />Optional
  <br/>Defaults to true

## Weird things to note

1. Only way to change shapes without using PRO features of React-Flow is by
   setting the style of the associated class names of Node Types in the
   index.css.


